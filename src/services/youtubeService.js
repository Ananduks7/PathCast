const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const CACHE_TTL_MS = 10 * 60 * 1000;

const responseCache = new Map();
const inFlightRequests = new Map();

const requireEnv = () => {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  const channelId = import.meta.env.VITE_YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    throw new Error("Missing YouTube config. Set VITE_YOUTUBE_API_KEY and VITE_YOUTUBE_CHANNEL_ID.");
  }

  return { apiKey, channelId };
};

const withCache = async (cacheKey, fetcher, ttl = CACHE_TTL_MS) => {
  const now = Date.now();
  const cached = responseCache.get(cacheKey);

  if (cached && now - cached.timestamp < ttl) {
    return cached.data;
  }

  const existingRequest = inFlightRequests.get(cacheKey);
  if (existingRequest) {
    return existingRequest;
  }

  const requestPromise = fetcher()
    .then((data) => {
      responseCache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    })
    .finally(() => {
      inFlightRequests.delete(cacheKey);
    });

  inFlightRequests.set(cacheKey, requestPromise);
  return requestPromise;
};

const youtubeRequest = async (endpoint, params) => {
  const { apiKey } = requireEnv();
  const query = new URLSearchParams({ ...params, key: apiKey });
  const response = await fetch(`${YOUTUBE_API_BASE}/${endpoint}?${query.toString()}`);

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`YouTube API error (${response.status}): ${body}`);
  }

  return response.json();
};

const fetchAllPages = async (endpoint, baseParams) => {
  const items = [];
  let pageToken;

  do {
    const payload = await youtubeRequest(endpoint, {
      ...baseParams,
      ...(pageToken ? { pageToken } : {}),
    });
    items.push(...(payload.items ?? []));
    pageToken = payload.nextPageToken;
  } while (pageToken);

  return items;
};

const chunkArray = (values, chunkSize) => {
  const chunks = [];
  for (let index = 0; index < values.length; index += chunkSize) {
    chunks.push(values.slice(index, index + chunkSize));
  }
  return chunks;
};

const parseDuration = (isoDuration) => {
  if (!isoDuration) return "";

  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "";

  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);

  if (hours === 0 && minutes === 0) {
    return `${seconds}s`;
  }

  if (hours > 0) {
    const paddedMinutes = String(minutes).padStart(2, "0");
    return `${hours}h ${paddedMinutes}m`;
  }

  return `${minutes}m`;
};

const toLecture = (video, categoryByVideoId = {}, fallbackCategory = "General Pathology", live = false) => {
  const videoId = typeof video.id === "string" ? video.id : video.id?.videoId;
  const snippet = video.snippet ?? {};
  const contentDetails = video.contentDetails ?? {};
  const statistics = video.statistics ?? {};

  return {
    id: videoId,
    title: snippet.title ?? "Untitled",
    speaker: snippet.channelTitle ?? "Unknown Speaker",
    specialty: categoryByVideoId[videoId] ?? fallbackCategory,
    duration: live ? "LIVE" : parseDuration(contentDetails.duration),
    thumbnail:
      snippet.thumbnails?.high?.url ||
      snippet.thumbnails?.medium?.url ||
      snippet.thumbnails?.default?.url ||
      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    description: snippet.description ?? "",
    isLive: live,
    youtubeId: videoId,
    publishedAt: snippet.publishedAt,
    viewCount: Number(statistics.viewCount ?? 0),
  };
};

const getVideosByIds = async (videoIds) => {
  const uniqueIds = Array.from(new Set(videoIds.filter(Boolean)));
  if (uniqueIds.length === 0) return [];

  const chunks = chunkArray(uniqueIds, 50);
  const payloads = await Promise.all(
    chunks.map((chunk) =>
      youtubeRequest("videos", {
        part: "snippet,contentDetails,statistics,liveStreamingDetails",
        id: chunk.join(","),
        maxResults: "50",
      })
    )
  );

  return payloads.flatMap((payload) => payload.items ?? []);
};

const getCategoryLookup = async () => {
  const { channelId } = requireEnv();

  return withCache(
    `category-lookup:${channelId}`,
    async () => {
      const playlists = await getChannelPlaylists();
      const lookup = {};

      await Promise.all(
        playlists.map(async (playlist) => {
          const items = await fetchAllPages("playlistItems", {
            part: "snippet,contentDetails",
            playlistId: playlist.id,
            maxResults: "50",
          });

          items.forEach((item) => {
            const videoId = item.contentDetails?.videoId;
            if (!videoId || lookup[videoId]) return;
            lookup[videoId] = playlist.title;
          });
        })
      );

      return lookup;
    },
    30 * 60 * 1000
  );
};

export const getChannelPlaylists = async () => {
  const { channelId } = requireEnv();

  return withCache(
    `channel-playlists:${channelId}`,
    async () => {
      const items = await fetchAllPages("playlists", {
        part: "snippet,contentDetails",
        channelId,
        maxResults: "50",
      });

      return items.map((item) => ({
        id: item.id,
        title: item.snippet?.title ?? "Untitled Playlist",
        description: item.snippet?.description ?? "",
        thumbnail:
          item.snippet?.thumbnails?.high?.url ||
          item.snippet?.thumbnails?.medium?.url ||
          item.snippet?.thumbnails?.default?.url ||
          "",
        videoCount: Number(item.contentDetails?.itemCount ?? 0),
      }));
    },
    30 * 60 * 1000
  );
};

export const getPlaylistVideos = async (playlistId) => {
  if (!playlistId) return [];

  return withCache(
    `playlist-videos:${playlistId}`,
    async () => {
      const [playlistMeta, playlistItems] = await Promise.all([
        youtubeRequest("playlists", {
          part: "snippet",
          id: playlistId,
          maxResults: "1",
        }),
        fetchAllPages("playlistItems", {
          part: "snippet,contentDetails",
          playlistId,
          maxResults: "50",
        }),
      ]);

      const fallbackCategory =
        playlistMeta.items?.[0]?.snippet?.title || import.meta.env.VITE_YOUTUBE_DEFAULT_CATEGORY || "General Pathology";

      const videoIds = playlistItems
        .map((item) => item.contentDetails?.videoId)
        .filter(Boolean);

      const videos = await getVideosByIds(videoIds);
      const byId = new Map(videos.map((video) => [video.id, video]));

      return videoIds
        .map((videoId) => byId.get(videoId))
        .filter(Boolean)
        .map((video) => toLecture(video, {}, fallbackCategory));
    },
    20 * 60 * 1000
  );
};

const getVideosFromSearch = async (params, limit) => {
  const { channelId } = requireEnv();

  const searchPayload = await youtubeRequest("search", {
    part: "snippet",
    channelId,
    type: "video",
    maxResults: String(Math.min(limit, 50)),
    ...params,
  });

  const videoIds = (searchPayload.items ?? [])
    .map((item) => item.id?.videoId)
    .filter(Boolean);

  return getVideosByIds(videoIds);
};

const formatEasternDateTime = (isoString) => {
  if (!isoString) {
    return { date: "", time: "" };
  }

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return { date: "", time: "" };
  }

  const dateLabel = date.toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const timeLabel = date.toLocaleTimeString("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit",
  });

  return { date: dateLabel, time: `${timeLabel} ET` };
};

const inferEventFormat = (title) => {
  const lower = String(title ?? "").toLowerCase();
  if (lower.includes("workshop")) return "workshop";
  if (lower.includes("conference") || lower.includes("congress")) return "conference";
  if (lower.includes("webinar")) return "webinar";
  return "lecture";
};

const toEvent = (video, type) => {
  const videoId = typeof video.id === "string" ? video.id : video.id?.videoId;
  const snippet = video.snippet ?? {};
  const liveDetails = video.liveStreamingDetails ?? {};

  const anchorIso =
    type === "upcoming"
      ? liveDetails.scheduledStartTime || snippet.publishedAt
      : liveDetails.actualEndTime || liveDetails.actualStartTime || snippet.publishedAt;

  const { date, time } = formatEasternDateTime(anchorIso);

  return {
    id: videoId,
    title: snippet.title ?? "Untitled",
    date,
    time,
    type,
    format: inferEventFormat(snippet.title),
    location: "Live Stream",
    description: snippet.description ?? "",
    link: videoId ? `https://www.youtube.com/watch?v=${videoId}` : undefined,
  };
};

export const getLatestVideos = async (limit = 20) => {
  const { channelId } = requireEnv();

  return withCache(
    `latest-videos:${channelId}:${limit}`,
    async () => {
      const [videos, categoryLookup] = await Promise.all([
        getVideosFromSearch({ order: "date" }, limit),
        getCategoryLookup(),
      ]);

      return videos
        .map((video) => toLecture(video, categoryLookup))
        .sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime())
        .slice(0, limit);
    }
  );
};

export const getMostWatchedVideos = async (limit = 20) => {
  const { channelId } = requireEnv();

  return withCache(
    `most-watched:${channelId}:${limit}`,
    async () => {
      const [videos, categoryLookup] = await Promise.all([
        getVideosFromSearch({ order: "viewCount" }, limit),
        getCategoryLookup(),
      ]);

      return videos
        .map((video) => toLecture(video, categoryLookup))
        .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
        .slice(0, limit);
    }
  );
};

export const getTrendingVideos = async (limit = 20) => {
  const { channelId } = requireEnv();
  const publishedAfter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  return withCache(
    `trending-videos:${channelId}:${limit}`,
    async () => {
      const [videos, categoryLookup] = await Promise.all([
        getVideosFromSearch({ order: "date", publishedAfter }, 50),
        getCategoryLookup(),
      ]);

      return videos
        .map((video) => toLecture(video, categoryLookup))
        .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
        .slice(0, limit);
    }
  );
};

export const getLiveVideos = async (limit = 3) => {
  const { channelId } = requireEnv();

  // No withCache here — React Query handles its own caching and polling.
  // We only deduplicate truly concurrent in-flight requests.
  const dedupeKey = `live-videos:${channelId}:${limit}`;
  const existing = inFlightRequests.get(dedupeKey);
  if (existing) return existing;

  const request = (async () => {
    const searchPayload = await youtubeRequest("search", {
      part: "snippet",
      channelId,
      eventType: "live",
      type: "video",
      maxResults: String(Math.min(limit, 10)),
    });

    const videoIds = (searchPayload.items ?? [])
      .map((item) => item.id?.videoId)
      .filter(Boolean);

    if (videoIds.length === 0) return [];

    const [videos, categoryLookup] = await Promise.all([getVideosByIds(videoIds), getCategoryLookup()]);

    return videos
      .map((video) => toLecture(video, categoryLookup, "Live", true))
      .slice(0, limit);
  })();

  inFlightRequests.set(dedupeKey, request);
  request.finally(() => inFlightRequests.delete(dedupeKey));

  return request;
};

export const getChannelStatistics = async () => {
  const { channelId } = requireEnv();

  return withCache(
    `channel-statistics:${channelId}`,
    async () => {
      const payload = await youtubeRequest("channels", {
        part: "statistics",
        id: channelId,
        maxResults: "1",
      });

      const stats = payload.items?.[0]?.statistics ?? {};
      return {
        subscriberCount: stats.subscriberCount
          ? Number(stats.subscriberCount)
          : null,
        videoCount: stats.videoCount ? Number(stats.videoCount) : null,
      };
    },
    30 * 60 * 1000,
  );
};

export const getUpcomingEvents = async (limit = 20) => {
  const { channelId } = requireEnv();

  return withCache(
    `events:upcoming:${channelId}:${limit}`,
    async () => {
      const [upcomingLivePayload, recentPayload] = await Promise.all([
        youtubeRequest("search", {
          part: "snippet",
          channelId,
          eventType: "upcoming",
          type: "video",
          order: "date",
          maxResults: "50",
        }),
        youtubeRequest("search", {
          part: "snippet",
          channelId,
          type: "video",
          order: "date",
          maxResults: "50",
        }),
      ]);

      const upcomingIds = new Set(
        (upcomingLivePayload.items ?? [])
          .map((item) => item.id?.videoId)
          .filter(Boolean),
      );

      // Pick up scheduled premieres too (often show as liveBroadcastContent="upcoming").
      (recentPayload.items ?? []).forEach((item) => {
        if (item?.snippet?.liveBroadcastContent === "upcoming") {
          const videoId = item.id?.videoId;
          if (videoId) upcomingIds.add(videoId);
        }
      });

      const videos = await getVideosByIds(Array.from(upcomingIds));

      const mapped = videos
        .map((video) => {
          const anchorIso =
            video.liveStreamingDetails?.scheduledStartTime ||
            video.snippet?.publishedAt ||
            "";
          return {
            event: toEvent(video, "upcoming"),
            ts: anchorIso ? new Date(anchorIso).getTime() : Number.POSITIVE_INFINITY,
          };
        })
        .sort((a, b) => a.ts - b.ts)
        .map((entry) => entry.event)
        .slice(0, limit);

      return mapped;
    },
    5 * 60 * 1000,
  );
};

export const getPastLivestreamEvents = async (limit = 30) => {
  const { channelId } = requireEnv();

  return withCache(
    `events:completed:${channelId}:${limit}`,
    async () => {
      const searchPayload = await youtubeRequest("search", {
        part: "snippet",
        channelId,
        eventType: "completed",
        type: "video",
        order: "date",
        maxResults: "50",
      });

      const videoIds = (searchPayload.items ?? [])
        .map((item) => item.id?.videoId)
        .filter(Boolean);

      const videos = await getVideosByIds(videoIds);

      const mapped = videos
        .map((video) => {
          const anchorIso =
            video.liveStreamingDetails?.actualEndTime ||
            video.liveStreamingDetails?.actualStartTime ||
            video.snippet?.publishedAt ||
            "";
          return {
            event: toEvent(video, "past"),
            ts: anchorIso ? new Date(anchorIso).getTime() : 0,
          };
        })
        .sort((a, b) => b.ts - a.ts)
        .map((entry) => entry.event)
        .slice(0, limit);

      return mapped;
    },
    10 * 60 * 1000,
  );
};

export const clearYoutubeCache = () => {
  responseCache.clear();
  inFlightRequests.clear();
};

import { useQuery } from "@tanstack/react-query";
import { getLiveVideos } from "@/services/youtubeService";
import type { Lecture } from "@/data/lectures";

/**
 * Hook that polls the YouTube channel for active live streams.
 *
 * - Polls every 2 minutes to conserve YouTube Data API v3 quota.
 * - Background polling disabled — tab must be visible to poll.
 * - React Query deduplicates by queryKey: all components share one request.
 */
export const useLiveStatus = () => {
  const query = useQuery<Lecture[]>({
    queryKey: ["youtube", "live-status"],
    queryFn: () => getLiveVideos(4),
    staleTime: 60 * 1000, // consider data stale after 1 min
    gcTime: 5 * 60 * 1000, // keep unused data for 5 min
    refetchInterval: 2 * 60 * 1000, // poll every 2 minutes
    refetchIntervalInBackground: false, // pause polling when tab is hidden
    retry: 1,
    structuralSharing: false,
  });

  const liveVideos: Lecture[] = query.data ?? [];

  return {
    /** `true` when at least one live stream is detected */
    isLive: liveVideos.length > 0,
    /** The live-stream lectures (may be empty) */
    liveVideos,
    /** React Query meta (isLoading, isFetching, error, etc.) */
    query,
  };
};

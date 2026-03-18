import { useQuery } from "@tanstack/react-query";
import { getLiveVideos } from "@/services/youtubeService";
import type { Lecture } from "@/data/lectures";

/**
 * Global hook that polls the YouTube channel for active live streams.
 *
 * - Polls every 30 seconds so the UI reacts within half a minute of a stream
 *   starting or ending.
 * - `staleTime` is kept shorter than the refetch interval so every poll is
 *   treated as "fresh" immediately.
 * - Always enabled (no visibility gate) so the Navbar can use it on every page.
 *
 * Because React Query deduplicates by `queryKey`, every component that calls
 * this hook shares the same underlying fetch — no duplicate network requests.
 */
export const useLiveStatus = () => {
  const query = useQuery<Lecture[]>({
    queryKey: ["youtube", "live-status"],
    queryFn: () => getLiveVideos(4),
    staleTime: 0, // always treat data as stale so refetches actually run
    gcTime: 30 * 1000, // garbage-collect old data after 30 s
    refetchInterval: 30 * 1000, // poll every 30 s
    refetchIntervalInBackground: true, // keep polling even if the tab is hidden
    retry: 2,
    // Ensure React re-renders when the live video list changes (different IDs)
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

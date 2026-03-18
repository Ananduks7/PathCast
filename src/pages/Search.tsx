import { useState, useMemo, useCallback } from "react";
import {
  Search as SearchIcon,
  X,
  SlidersHorizontal,
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TestimonialCarousel, {
  type Testimonial,
} from "@/components/TestimonialCarousel";
import mariaTestimonialImage from "@/assets/Testimonial-Image/Maria Sarah Lenon.jpg";
import jorgeTestimonialImage from "@/assets/Testimonial-Image/Jorge Radif Rassi Filho.png";
import chenchenTestimonialImage from "@/assets/Testimonial-Image/Chenchen.jpg";
import VideoCard from "@/components/VideoCard";
import VideoPlayerModal from "@/components/VideoPlayerModal";
import type { Lecture } from "@/data/lectures";
import { parseDuration } from "@/data/lectures-utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  getChannelPlaylists,
  getPlaylistVideos,
} from "@/services/youtubeService";

type SortOption = "relevance" | "newest" | "oldest" | "duration";
type DurationFilter = "under15" | "15-30" | "30-60" | "60plus";
type PlaylistSortOption = "az" | "za" | "most";

type Playlist = {
  id: string;
  title: string;
  thumbnail?: string;
  videoCount: number;
  description?: string;
};

const formatSpecialtyTitle = (title: string) => title.replace(/^#+/, "").trim();

const getSpecialtyInitials = (title: string) => {
  const cleaned = formatSpecialtyTitle(title).replace(/[^a-zA-Z0-9]/g, "");
  if (!cleaned) return "SP";
  return cleaned.slice(0, 2).toUpperCase();
};

const DURATION_LABELS: Record<DurationFilter, string> = {
  under15: "Under 15 min",
  "15-30": "15–30 min",
  "30-60": "30–60 min",
  "60plus": "1+ hour",
};

const PLAYLIST_SORT_LABELS: Record<PlaylistSortOption, string> = {
  az: "Alphabetical (A–Z)",
  za: "Alphabetical (Z–A)",
  most: "Most lectures",
};

const Search = () => {
  const [query, setQuery] = useState("");
  const [specialtyQuery, setSpecialtyQuery] = useState("");
  const [selectedPlaylistCategories, setSelectedPlaylistCategories] = useState<
    string[]
  >([]);
  const [playlistSortBy, setPlaylistSortBy] =
    useState<PlaylistSortOption>("az");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<DurationFilter[]>(
    [],
  );
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [activePlaylistId, setActivePlaylistId] = useState<string>("");

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    playlistBrowse: true,
    playlistSort: true,
    specialty: true,
    duration: true,
    sort: true,
  });

  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 768,
  );

  const playlistsQuery = useQuery({
    queryKey: ["youtube", "playlists"],
    queryFn: getChannelPlaylists,
    staleTime: 30 * 60 * 1000,
  });

  const playlists = useMemo(
    () => (playlistsQuery.data ?? []) as Playlist[],
    [playlistsQuery.data],
  );

  const activePlaylist = useMemo(
    () => playlists.find((p) => p.id === activePlaylistId) ?? null,
    [playlists, activePlaylistId],
  );

  const playlistVideosQuery = useQuery({
    queryKey: ["youtube", "playlist-videos", activePlaylistId],
    queryFn: () => getPlaylistVideos(activePlaylistId),
    enabled: Boolean(activePlaylistId),
    staleTime: 20 * 60 * 1000,
  });

  const playlistVideos = useMemo(
    () => (playlistVideosQuery.data ?? []) as Lecture[],
    [playlistVideosQuery.data],
  );

  const isLoading = activePlaylistId
    ? playlistVideosQuery.isLoading
    : playlistsQuery.isLoading;

  const allSpecialties = useMemo(
    () =>
      Array.from(
        new Set(playlistVideos.map((lecture) => lecture.specialty)),
      ).sort(),
    [playlistVideos],
  );

  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleSpecialty = (specialty: string) =>
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((value) => value !== specialty)
        : [...prev, specialty],
    );

  const toggleDuration = (duration: DurationFilter) =>
    setSelectedDurations((prev) =>
      prev.includes(duration)
        ? prev.filter((value) => value !== duration)
        : [...prev, duration],
    );

  const clearAll = () => {
    setQuery("");
    setSelectedSpecialties([]);
    setSelectedDurations([]);
    setSortBy("relevance");
  };

  const clearPlaylistFilters = () => {
    setSpecialtyQuery("");
    setSelectedPlaylistCategories([]);
    setPlaylistSortBy("az");
  };

  const togglePlaylistCategory = (playlistId: string) =>
    setSelectedPlaylistCategories((prev) =>
      prev.includes(playlistId)
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId],
    );

  const selectPlaylist = (playlistId: string) => {
    setActivePlaylistId(playlistId);
    setQuery("");
    setSelectedSpecialties([]);
    setSelectedDurations([]);
    setSortBy("relevance");
    if (isMobile) setSidebarOpen(false);
  };

  const clearPlaylist = () => {
    setActivePlaylistId("");
    clearAll();
    setSidebarOpen(!isMobile);
  };

  const activeFilterCount =
    selectedSpecialties.length + selectedDurations.length;

  const playlistCategories = useMemo(
    () =>
      playlists
        .map((playlist) => ({
          id: playlist.id,
          title: formatSpecialtyTitle(playlist.title),
        }))
        .sort((a, b) => a.title.localeCompare(b.title)),
    [playlists],
  );

  const filteredPlaylists = useMemo(() => {
    let filtered = [...playlists];

    if (selectedPlaylistCategories.length > 0) {
      const set = new Set(selectedPlaylistCategories);
      filtered = filtered.filter((playlist) => set.has(playlist.id));
    }

    if (specialtyQuery.trim()) {
      const lower = specialtyQuery.toLowerCase();
      filtered = filtered.filter((playlist) =>
        formatSpecialtyTitle(playlist.title).toLowerCase().includes(lower),
      );
    }

    switch (playlistSortBy) {
      case "az":
        filtered.sort((a, b) =>
          formatSpecialtyTitle(a.title).localeCompare(
            formatSpecialtyTitle(b.title),
          ),
        );
        break;
      case "za":
        filtered.sort((a, b) =>
          formatSpecialtyTitle(b.title).localeCompare(
            formatSpecialtyTitle(a.title),
          ),
        );
        break;
      case "most":
        filtered.sort((a, b) => (b.videoCount ?? 0) - (a.videoCount ?? 0));
        break;
    }

    return filtered;
  }, [playlists, selectedPlaylistCategories, specialtyQuery, playlistSortBy]);

  const playlistFilterCount =
    (selectedPlaylistCategories.length > 0 ? 1 : 0) +
    (specialtyQuery.trim() ? 1 : 0);

  const hasPlaylistFilters = playlistFilterCount > 0 || playlistSortBy !== "az";

  const hasLectureFilters =
    Boolean(query.trim()) || activeFilterCount > 0 || sortBy !== "relevance";

  const matchDuration = useCallback(
    (minutes: number) => {
      if (selectedDurations.length === 0) return true;
      return selectedDurations.some((duration) => {
        switch (duration) {
          case "under15":
            return minutes < 15;
          case "15-30":
            return minutes >= 15 && minutes <= 30;
          case "30-60":
            return minutes > 30 && minutes <= 60;
          case "60plus":
            return minutes > 60;
        }
      });
    },
    [selectedDurations],
  );

  const results = useMemo(() => {
    let filtered = [...playlistVideos];

    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (lecture) =>
          lecture.title.toLowerCase().includes(lowerQuery) ||
          lecture.speaker.toLowerCase().includes(lowerQuery) ||
          lecture.specialty.toLowerCase().includes(lowerQuery) ||
          lecture.description.toLowerCase().includes(lowerQuery),
      );
    }

    if (selectedSpecialties.length > 0) {
      filtered = filtered.filter((lecture) =>
        selectedSpecialties.includes(lecture.specialty),
      );
    }

    if (selectedDurations.length > 0) {
      filtered = filtered.filter((lecture) =>
        matchDuration(parseDuration(lecture.duration)),
      );
    }

    switch (sortBy) {
      case "duration":
        filtered.sort(
          (a, b) => parseDuration(a.duration) - parseDuration(b.duration),
        );
        break;
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.publishedAt ?? 0).getTime() -
            new Date(a.publishedAt ?? 0).getTime(),
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.publishedAt ?? 0).getTime() -
            new Date(b.publishedAt ?? 0).getTime(),
        );
        break;
    }

    return filtered;
  }, [
    query,
    playlistVideos,
    selectedSpecialties,
    selectedDurations,
    sortBy,
    matchDuration,
  ]);

  const playLecture = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setPlayerOpen(true);
  };

  const activeFilters = [
    ...selectedSpecialties.map((specialty) => ({
      label: specialty,
      clear: () => toggleSpecialty(specialty),
    })),
    ...selectedDurations.map((duration) => ({
      label: DURATION_LABELS[duration],
      clear: () => toggleDuration(duration),
    })),
  ];

  const searchTestimonials: Testimonial[] = [
    {
      quote:
        "As a practicing pathologist in the Philippines, I find pathCast to be an invaluable resource for both daily diagnostics and ongoing learning. Its well-curated lectures reflect real-world cases in surgical pathology and cytology, helping bridge the gap between theory and practice. It’s especially useful for trainees and young consultants, and provides accessible, high-quality education in settings with limited subspecialty mentorship. I highly recommend pathCast for anyone committed to continuous learning and diagnostic excellence.",
      authorName: "Maria Sarah Lenon, MD, FPSP",
      designation: "Fellow in Anatomic and Clinical Pathology",
      institution: "University of Santo Tomas Hospital",
      authorImageSrc: mariaTestimonialImage,
      authorImageAlt: "Maria Sarah Lenon, MD, FPSP",
      country: "Philippines",
    },
    {
      quote:
        "I became acquainted with pathCast through the lectures and classes delivered by Professor Dr. Rifat. Since then, I have been complementing my studies in pathology by watching the videos available on the channel. As members of the future generation of pathologists, we must consistently make use of information technology tools to enhance our knowledge. For this reason, I believe that PathCast plays an important role in deepening and advancing our studies.",
      authorName: "Jorge Radif Rassi Filho, MD",
      designation: "Pathologist, Professor",
      institution: "Federal University of Goiás",
      authorImageSrc: jorgeTestimonialImage,
      authorImageAlt: "Jorge Radif Rassi Filho, MD",
      country: "Brazil",
    },
    {
      quote:
        "I have attended multiple lectures on PathCast and found them incredibly rewarding. The lectures cover the “bread-and-butter” foundations of various pathology subspecialties while also introducing emerging concepts and recent advances in the field. The content is well organized, practical, and directly applicable to both residency training and daily diagnostic practice. I believe PathCast is an excellent resource for pathology residents preparing for boards as well as for practicing pathologists who want to stay updated.",
      authorName: "Chenchen Niu, MD",
      designation: "Pathology Resident (PGY4)",
      institution: "University of California Irvine",
      authorImageSrc: chenchenTestimonialImage,
      authorImageAlt: "Chenchen Niu, MD",
      country: "USA",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#0d2e2e] via-[#0d3535] to-[#0a2222] overflow-hidden min-h-[480px] flex flex-col justify-center">
        {/* subtle dot-grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8 pt-36 pb-20 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm font-medium tracking-widest uppercase text-teal-300/80 mb-4"
          >
            pathCast Library
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
          >
            Lecture Library
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/75 leading-relaxed max-w-2xl mx-auto"
          >
            Browse categories and explore hundreds of free pathology lectures
            from world-renowned experts.
          </motion.p>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="relative z-10 border-t border-white/10"
        >
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 flex flex-wrap justify-center gap-12 md:gap-20">
            {[
              { value: "300+", label: "LECTURES" },
              { value: "50+", label: "SPECIALTIES" },
              { value: "Free", label: "OPEN ACCESS" },
            ].map(({ value, label }) => (
              <div key={label} className="flex items-center gap-4">
                <div>
                  <p className="text-3xl md:text-4xl font-bold text-white leading-none">
                    {value}
                  </p>
                  <p className="text-xs font-semibold tracking-widest text-white/50 mt-1.5">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 pt-10">
        {!activePlaylistId ? (
          <>
            <div className="flex items-center justify-between gap-3 mb-6">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                type="button"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {playlistFilterCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {playlistFilterCount}
                  </span>
                )}
              </button>
            </div>

            {isLoading ? (
              <div className="py-20 text-center">
                <p className="text-muted-foreground">Loading categories...</p>
              </div>
            ) : playlists.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-muted-foreground">No categories found.</p>
              </div>
            ) : (
              <div className="flex gap-6">
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.aside
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: isMobile ? "100%" : 280, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex-shrink-0 overflow-hidden ${
                        isMobile
                          ? "fixed inset-0 z-40 bg-background p-4 pt-20"
                          : "sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto"
                      }`}
                    >
                      <div className="space-y-1 pr-2">
                        {isMobile && (
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-foreground">
                              Filters
                            </h3>
                            <button
                              onClick={() => setSidebarOpen(false)}
                              type="button"
                            >
                              <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                          </div>
                        )}

                        <FilterSection
                          title="Browse By"
                          open={openSections.playlistBrowse}
                          onToggle={() => toggleSection("playlistBrowse")}
                        >
                          <div className="space-y-2">
                            <input
                              value={specialtyQuery}
                              onChange={(event) =>
                                setSpecialtyQuery(event.target.value)
                              }
                              placeholder="Search categories"
                              className="w-full h-10 px-3 bg-card border border-border rounded-lg text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50"
                            />

                            <div className="space-y-1">
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedPlaylistCategories([])
                                }
                                className={`block w-full text-left text-sm px-3 py-1.5 rounded transition-colors ${
                                  selectedPlaylistCategories.length === 0
                                    ? "bg-primary/15 text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                }`}
                              >
                                All Categories
                              </button>

                              <div className="space-y-1 max-h-48 overflow-y-auto">
                                {playlistCategories.map((category) => (
                                  <label
                                    key={String(category.id)}
                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer px-1 py-0.5"
                                  >
                                    <Checkbox
                                      checked={selectedPlaylistCategories.includes(
                                        category.id,
                                      )}
                                      onCheckedChange={() =>
                                        togglePlaylistCategory(category.id)
                                      }
                                    />
                                    <span className="truncate">
                                      {category.title}
                                    </span>
                                  </label>
                                ))}
                              </div>

                              {playlistCategories.length === 0 && (
                                <p className="text-xs text-muted-foreground px-1 py-2">
                                  No categories available.
                                </p>
                              )}
                            </div>

                            {hasPlaylistFilters && (
                              <button
                                type="button"
                                onClick={clearPlaylistFilters}
                                className="text-xs text-primary hover:underline"
                              >
                                Clear filters
                              </button>
                            )}
                          </div>
                        </FilterSection>

                        <FilterSection
                          title="Sort By"
                          open={openSections.playlistSort}
                          onToggle={() => toggleSection("playlistSort")}
                        >
                          <div className="space-y-1">
                            {(
                              Object.entries(PLAYLIST_SORT_LABELS) as [
                                PlaylistSortOption,
                                string,
                              ][]
                            ).map(([value, label]) => (
                              <button
                                key={value}
                                onClick={() => setPlaylistSortBy(value)}
                                className={`block w-full text-left text-sm px-3 py-1.5 rounded transition-colors ${
                                  playlistSortBy === value
                                    ? "bg-primary/15 text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                }`}
                                type="button"
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </FilterSection>

                        {hasPlaylistFilters && (
                          <button
                            type="button"
                            onClick={clearPlaylistFilters}
                            className={`${buttonVariants({ variant: "outline", size: "sm" })} w-full`}
                          >
                            Clear all
                          </button>
                        )}

                        {isMobile && (
                          <button
                            onClick={() => setSidebarOpen(false)}
                            className="w-full mt-4 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium"
                            type="button"
                          >
                            Show {filteredPlaylists.length} categories
                          </button>
                        )}
                      </div>
                    </motion.aside>
                  )}
                </AnimatePresence>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    <span className="text-foreground font-medium">
                      {filteredPlaylists.length}
                    </span>{" "}
                    specialt{filteredPlaylists.length === 1 ? "y" : "ies"}
                  </p>

                  {filteredPlaylists.length === 0 ? (
                    <div className="py-20 text-center">
                      <p className="text-muted-foreground">
                        No categories found.
                      </p>
                      <button
                        type="button"
                        onClick={clearPlaylistFilters}
                        className="text-primary text-sm mt-2 hover:underline"
                      >
                        Clear filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                      {filteredPlaylists.map((playlist) => (
                        <button
                          key={playlist.id}
                          onClick={() => selectPlaylist(playlist.id)}
                          className="text-left group"
                          type="button"
                        >
                          <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors h-full flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-muted border border-border flex items-center justify-center mb-6 overflow-hidden">
                              {playlist.thumbnail ? (
                                <img
                                  src={playlist.thumbnail}
                                  alt={formatSpecialtyTitle(playlist.title)}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <span className="text-primary font-bold text-xl tracking-wide">
                                  {getSpecialtyInitials(playlist.title)}
                                </span>
                              )}
                            </div>

                            <h2 className="text-base font-semibold text-foreground leading-snug tracking-tight">
                              {formatSpecialtyTitle(playlist.title)}
                            </h2>
                            <p className="text-[11px] tracking-widest uppercase text-muted-foreground mt-2">
                              Specialty
                            </p>

                            {playlist.description?.trim() ? (
                              <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
                                {playlist.description.trim()}
                              </p>
                            ) : null}

                            <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                              <GraduationCap className="w-4 h-4" />
                              <span>
                                {playlist.videoCount} Lecture
                                {playlist.videoCount !== 1 ? "s" : ""}
                              </span>
                            </div>

                            <div className="mt-6 w-full">
                              <div
                                className={`${buttonVariants({ variant: "outline" })} w-full`}
                              >
                                View Lectures
                                <ArrowRight className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="min-w-0">
                <button
                  type="button"
                  onClick={clearPlaylist}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  All Specialties
                </button>
                <h2 className="text-xl md:text-2xl font-bold text-foreground mt-2 truncate">
                  {activePlaylist?.title ?? "Selected Specialty"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {playlistVideos.length} lecture
                  {playlistVideos.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="relative mb-6">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search lectures, topics, or institutions"
                className="w-full h-14 pl-12 pr-12 bg-card border border-border rounded-xl text-foreground text-base placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {activeFilters.map((filter) => (
                  <Badge
                    key={filter.label}
                    variant="secondary"
                    className="flex items-center gap-1 cursor-pointer hover:bg-secondary/80"
                    onClick={filter.clear}
                  >
                    {filter.label}
                    <X className="w-3 h-3" />
                  </Badge>
                ))}
                <button
                  onClick={clearAll}
                  className="text-xs text-primary hover:underline ml-2"
                  type="button"
                >
                  Clear all
                </button>
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                type="button"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            <div className="flex gap-6">
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.aside
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: isMobile ? "100%" : 280, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex-shrink-0 overflow-hidden ${
                      isMobile
                        ? "fixed inset-0 z-40 bg-background p-4 pt-20"
                        : "sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto"
                    }`}
                  >
                    <div className="space-y-1 pr-2">
                      {isMobile && (
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-foreground">
                            Filters
                          </h3>
                          <button
                            onClick={() => setSidebarOpen(false)}
                            type="button"
                          >
                            <X className="w-5 h-5 text-muted-foreground" />
                          </button>
                        </div>
                      )}

                      <FilterSection
                        title="Sub-Specialty"
                        open={openSections.specialty}
                        onToggle={() => toggleSection("specialty")}
                      >
                        {allSpecialties.length === 0 ? (
                          <p className="text-xs text-muted-foreground px-1 py-2">
                            No sub-specialties available.
                          </p>
                        ) : (
                          <div className="space-y-1 max-h-48 overflow-y-auto">
                            {allSpecialties.map((specialty) => (
                              <label
                                key={specialty}
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer px-1 py-0.5"
                              >
                                <Checkbox
                                  checked={selectedSpecialties.includes(
                                    specialty,
                                  )}
                                  onCheckedChange={() =>
                                    toggleSpecialty(specialty)
                                  }
                                />
                                <span className="truncate">{specialty}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </FilterSection>
                      <FilterSection
                        title="Sort By"
                        open={openSections.sort}
                        onToggle={() => toggleSection("sort")}
                      >
                        <div className="space-y-1">
                          {(
                            [
                              ["relevance", "Relevance"],
                              ["newest", "Newest"],
                              ["oldest", "Oldest"],
                              ["duration", "Duration"],
                            ] as [SortOption, string][]
                          ).map(([value, label]) => (
                            <button
                              key={value}
                              onClick={() => setSortBy(value)}
                              className={`block w-full text-left text-sm px-3 py-1.5 rounded transition-colors ${
                                sortBy === value
                                  ? "bg-primary/15 text-primary font-medium"
                                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
                              }`}
                              type="button"
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </FilterSection>

                      <FilterSection
                        title="Duration"
                        open={openSections.duration}
                        onToggle={() => toggleSection("duration")}
                      >
                        <div className="space-y-1">
                          {(
                            Object.entries(DURATION_LABELS) as [
                              DurationFilter,
                              string,
                            ][]
                          ).map(([key, label]) => (
                            <label
                              key={key}
                              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer px-1 py-0.5"
                            >
                              <Checkbox
                                checked={selectedDurations.includes(key)}
                                onCheckedChange={() => toggleDuration(key)}
                              />
                              {label}
                            </label>
                          ))}
                        </div>
                      </FilterSection>

                      {hasLectureFilters && (
                        <button
                          type="button"
                          onClick={clearAll}
                          className={`${buttonVariants({ variant: "outline", size: "sm" })} w-full`}
                        >
                          Clear all
                        </button>
                      )}

                      {isMobile && (
                        <button
                          onClick={() => setSidebarOpen(false)}
                          className="w-full mt-4 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium"
                          type="button"
                        >
                          Show {results.length} results
                        </button>
                      )}
                    </div>
                  </motion.aside>
                )}
              </AnimatePresence>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground mb-4">
                  <span className="text-foreground font-medium">
                    {results.length}
                  </span>{" "}
                  lecture{results.length !== 1 ? "s" : ""} found
                </p>
                {isLoading ? (
                  <div className="py-20 text-center">
                    <p className="text-muted-foreground">Loading lectures...</p>
                  </div>
                ) : results.length === 0 ? (
                  <div className="py-20 text-center">
                    <p className="text-muted-foreground">
                      No lectures found matching your criteria.
                    </p>
                    <button
                      onClick={clearAll}
                      className="text-primary text-sm mt-2 hover:underline"
                      type="button"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-x-4 gap-y-8 [&>div]:w-full">
                    {results.map((lecture) => (
                      <VideoCard
                        key={lecture.id}
                        lecture={lecture}
                        onPlay={playLecture}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <section className="mt-12 px-4 md:px-8 pb-12">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              What Our Community Says
            </h2>
            <p className="text-muted-foreground mt-2">
              Hear from pathologists and educators around the world
            </p>
          </div>
          <TestimonialCarousel testimonials={searchTestimonials} />
        </div>
      </section>

      <Footer />

      <VideoPlayerModal
        lecture={selectedLecture}
        open={playerOpen}
        onOpenChange={setPlayerOpen}
      />
    </div>
  );
};

function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border pb-3 mb-3">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-sm font-semibold text-foreground py-2"
      >
        {title}
        {open ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Search;

import { useState, useMemo, useCallback, useRef } from "react";
import {
  Search as SearchIcon,
  X,
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  ChevronDown,
  Check,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { Badge } from "@/components/ui/badge";
import {
  getChannelPlaylists,
  getPlaylistVideos,
  searchChannelVideos,
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
  const [specialtyPopoverOpen, setSpecialtyPopoverOpen] = useState(false);

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

  // ── Global video search (fires when typing in the main search bar) ──
  const videoSearchQuery = useQuery({
    queryKey: ["youtube", "search", specialtyQuery],
    queryFn: () => searchChannelVideos(specialtyQuery, 24),
    enabled: !activePlaylistId && specialtyQuery.trim().length >= 1,
    staleTime: 5 * 60 * 1000,
  });
  const searchedVideos = useMemo(
    () => (videoSearchQuery.data ?? []) as Lecture[],
    [videoSearchQuery.data],
  );

  const allSpecialties = useMemo(
    () =>
      Array.from(
        new Set(playlistVideos.map((lecture) => lecture.specialty)),
      ).sort(),
    [playlistVideos],
  );

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
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const clearPlaylist = () => {
    setActivePlaylistId("");
    clearAll();
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
        "As a practicing pathologist in the Philippines, I consider PathCast a valuable resource for both daily diagnostics and ongoing learning. Its well-organized lectures present real-world cases in surgical pathology and cytology, linking theory with practice. It is especially useful for trainees and early-career consultants, providing accessible, high-quality education even in settings with limited subspecialty support. I strongly recommend PathCast for those committed to continuous learning.",
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
            className="text-sm font-medium tracking-widest uppercase text-[#7EECD8] mb-4"
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
            Browse our comprehensive collection of pathology lectures. Filter by
            speaker, topic, or search for specific keywords.
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
            {/* ── TOP FILTER BAR ───────────────────────────────────── */}
            <div className="flex flex-col gap-3 mb-5">
              {/* Row 1 – full-width search */}
              <div className="relative w-full">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  value={specialtyQuery}
                  onChange={(e) => setSpecialtyQuery(e.target.value)}
                  placeholder="Search specialties..."
                  className="w-full h-14 pl-12 pr-10 bg-card border border-border rounded-xl text-foreground text-base placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                />
                {specialtyQuery && (
                  <button
                    onClick={() => setSpecialtyQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    type="button"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
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
              <div>
                {/* Count + dropdowns in one row */}
                <div className="flex flex-col items-center gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">
                      {filteredPlaylists.length}
                    </span>{" "}
                    specialt{filteredPlaylists.length === 1 ? "y" : "ies"}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
                    {/* Browse By Specialty — searchable */}
                    <Popover
                      open={specialtyPopoverOpen}
                      onOpenChange={setSpecialtyPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="h-11 px-3 inline-flex items-center gap-2 bg-card border border-border rounded-lg text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/50 whitespace-nowrap"
                        >
                          {selectedPlaylistCategories.length > 0
                            ? (playlistCategories.find(
                                (c) => c.id === selectedPlaylistCategories[0],
                              )?.title ?? "Category")
                            : "Category"}
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search specialty..." />
                          <CommandList>
                            <CommandEmpty>No specialty found.</CommandEmpty>
                            <CommandGroup>
                              <CommandItem
                                value="all"
                                onSelect={() => {
                                  setSelectedPlaylistCategories([]);
                                  setSpecialtyPopoverOpen(false);
                                }}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${selectedPlaylistCategories.length === 0 ? "opacity-100" : "opacity-0"}`}
                                />
                                All Specialties
                              </CommandItem>
                              {playlistCategories.map((cat) => (
                                <CommandItem
                                  key={cat.id}
                                  value={cat.title}
                                  onSelect={() => {
                                    setSelectedPlaylistCategories(
                                      selectedPlaylistCategories[0] === cat.id
                                        ? []
                                        : [cat.id],
                                    );
                                    setSpecialtyPopoverOpen(false);
                                  }}
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 ${selectedPlaylistCategories[0] === cat.id ? "opacity-100" : "opacity-0"}`}
                                  />
                                  {cat.title}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {/* Sort By */}
                    <select
                      value={playlistSortBy}
                      onChange={(e) =>
                        setPlaylistSortBy(e.target.value as PlaylistSortOption)
                      }
                      className="h-11 px-3 bg-card border border-border rounded-lg text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      {(
                        Object.entries(PLAYLIST_SORT_LABELS) as [
                          PlaylistSortOption,
                          string,
                        ][]
                      ).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>

                    {hasPlaylistFilters && (
                      <button
                        type="button"
                        onClick={clearPlaylistFilters}
                        className="h-11 px-4 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors whitespace-nowrap"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {filteredPlaylists.length === 0 &&
                searchedVideos.length === 0 ? (
                  <div className="py-20 text-center">
                    <p className="text-muted-foreground">No results found.</p>
                    <button
                      type="button"
                      onClick={clearPlaylistFilters}
                      className="text-primary text-sm mt-2 hover:underline"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Specialties grid */}
                    {filteredPlaylists.length > 0 && (
                      <>
                        {specialtyQuery.trim() && (
                          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                            Specialties
                          </h3>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-10">
                          {filteredPlaylists.map((playlist, i) => (
                            <motion.button
                              key={playlist.id}
                              onClick={() => selectPlaylist(playlist.id)}
                              className="text-left group"
                              type="button"
                              initial={{ opacity: 0, y: 16 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, margin: "-40px" }}
                              transition={{
                                duration: 0.35,
                                delay: Math.min(i % 3, 2) * 0.07,
                              }}
                            >
                              <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-colors h-full flex flex-col">
                                {/* Rectangular banner */}
                                <div className="w-full aspect-video bg-muted flex items-center justify-center overflow-hidden">
                                  {playlist.thumbnail ? (
                                    <img
                                      src={playlist.thumbnail}
                                      alt={formatSpecialtyTitle(playlist.title)}
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <span className="text-primary font-bold text-2xl tracking-wide">
                                      {getSpecialtyInitials(playlist.title)}
                                    </span>
                                  )}
                                </div>

                                {/* Card body */}
                                <div className="p-5 flex flex-col flex-1">
                                  <h2 className="text-base font-semibold text-foreground leading-snug tracking-tight">
                                    {formatSpecialtyTitle(playlist.title)}
                                  </h2>
                                  <p className="text-[11px] tracking-widest uppercase text-muted-foreground mt-1">
                                    Specialty
                                  </p>

                                  {playlist.description?.trim() ? (
                                    <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                                      {playlist.description.trim()}
                                    </p>
                                  ) : null}

                                  <div className="mt-auto">
                                    <hr className="border-border mb-4" />
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <GraduationCap className="w-4 h-4" />
                                        <span>
                                          {playlist.videoCount} Lecture
                                          {playlist.videoCount !== 1 ? "s" : ""}
                                        </span>
                                      </div>
                                      <span className="inline-flex items-center gap-1 text-sm text-foreground group-hover:text-primary transition-colors no-underline">
                                        View
                                        <ArrowRight className="w-3.5 h-3.5" />
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Videos section — shown when a search query is active */}
                    {specialtyQuery.trim().length >= 1 && (
                      <>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3 mt-2">
                          Videos
                        </h3>
                        {videoSearchQuery.isLoading ? (
                          <p className="text-muted-foreground text-sm mb-8">
                            Searching videos...
                          </p>
                        ) : searchedVideos.length === 0 ? (
                          <p className="text-muted-foreground text-sm mb-8">
                            No videos found.
                          </p>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 [&>div]:w-full mb-10">
                            {searchedVideos.map((lecture) => (
                              <VideoCard
                                key={lecture.id}
                                lecture={lecture}
                                onPlay={playLecture}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
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

            {/* Search bar */}
            <div className="relative mb-4">
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

            {/* Count + filter dropdowns in one row */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-medium">
                  {results.length}
                </span>{" "}
                lecture{results.length !== 1 ? "s" : ""} found
              </p>
              <div className="flex flex-wrap gap-2">
                {/* Sub-Specialty */}
                <select
                  value={selectedSpecialties[0] ?? ""}
                  onChange={(e) =>
                    setSelectedSpecialties(
                      e.target.value ? [e.target.value] : [],
                    )
                  }
                  className="h-11 px-3 bg-card border border-border rounded-lg text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">All Sub-Specialties</option>
                  {allSpecialties.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                {/* Duration */}
                <select
                  value={selectedDurations[0] ?? ""}
                  onChange={(e) =>
                    setSelectedDurations(
                      e.target.value ? [e.target.value as DurationFilter] : [],
                    )
                  }
                  className="h-11 px-3 bg-card border border-border rounded-lg text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">All Durations</option>
                  {(
                    Object.entries(DURATION_LABELS) as [
                      DurationFilter,
                      string,
                    ][]
                  ).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>

                {/* Sort By */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="h-11 px-3 bg-card border border-border rounded-lg text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="duration">Duration</option>
                </select>

                {hasLectureFilters && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="h-11 px-4 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors whitespace-nowrap"
                  >
                    Clear all
                  </button>
                )}
              </div>
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
              </div>
            )}

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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 [&>div]:w-full">
                {results.map((lecture) => (
                  <VideoCard
                    key={lecture.id}
                    lecture={lecture}
                    onPlay={playLecture}
                  />
                ))}
              </div>
            )}
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

export default Search;

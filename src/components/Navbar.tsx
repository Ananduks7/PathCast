import { useMemo, useState } from "react";
import { Search, Menu, X, Radio } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ThemeToggle from "@/components/ThemeToggle";
import SearchOverlay from "@/components/SearchOverlay";
import VideoPlayerModal from "@/components/VideoPlayerModal";
import pathcastLogo from "@/assets/pathcast-logo.png";
import pathcastWhiteLogo from "@/assets/pathCast-white.png";
import type { Lecture } from "@/data/lectures";
import type { SearchItem } from "@/types/search";
import { speakers } from "@/data/speakers";
import { resources } from "@/data/resources";
import { events } from "@/data/events";
import { getLatestVideosSimple } from "@/services/youtubeService";
import { useLiveStatus } from "@/hooks/use-live-status";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Lecture-Library", href: "/search" },
  { label: "Faculty", href: "/speakers" },
  { label: "Resources", href: "/resources" },
  { label: "Events", href: "/events" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isNavItemActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return (
      location.pathname === href || location.pathname.startsWith(`${href}/`)
    );
  };

  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [playerOpen, setPlayerOpen] = useState(false);

  const { isLive } = useLiveStatus();

  const globalSearchLecturesQuery = useQuery({
    queryKey: ["youtube", "global-search-lectures"],
    queryFn: () => getLatestVideosSimple(80),
    enabled: searchOpen, // only fetch when the user actually opens search
    staleTime: 30 * 60 * 1000,
  });

  const handleSearchClick = () => {
    setSearchOpen(true);
  };

  const handleSelectLecture = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setPlayerOpen(true);
  };

  const searchItems = useMemo<SearchItem[]>(() => {
    const pageItems: SearchItem[] = navItems.map((item) => ({
      type: "page",
      id: item.href,
      title: item.label,
      href: item.href,
    }));

    const speakerItems: SearchItem[] = speakers.map((speaker) => ({
      type: "speaker",
      id: speaker.id,
      title: speaker.name,
      subtitle: speaker.institution,
      href: `/speakers/${speaker.id}`,
    }));

    const resourceItems: SearchItem[] = resources.map((resource) => ({
      type: "resource",
      id: resource.id,
      title: resource.title,
      subtitle: resource.category,
      href: resource.link,
      external: true,
    }));

    const eventItems: SearchItem[] = events.map((event) => ({
      type: "event",
      id: String(event.id),
      title: event.title,
      subtitle: `${event.date} · ${event.location}`,
      href: "/events",
    }));

    const fetchedLectures = (globalSearchLecturesQuery.data ?? []) as Lecture[];
    const lectureByYoutubeId = new Map<string, Lecture>();
    for (const lecture of fetchedLectures) {
      if (lecture.youtubeId) lectureByYoutubeId.set(lecture.youtubeId, lecture);
    }

    const lectureItemsById = new Map<string, SearchItem>();

    for (const lecture of fetchedLectures) {
      const key = lecture.youtubeId ?? lecture.id;
      lectureItemsById.set(key, {
        type: "lecture",
        id: key,
        title: lecture.title,
        subtitle: `${lecture.speaker} · ${lecture.specialty}`,
        lecture,
      });
    }

    for (const speaker of speakers) {
      for (const speakerLecture of speaker.lectures) {
        if (!speakerLecture.youtubeId) continue;

        const fetched = lectureByYoutubeId.get(speakerLecture.youtubeId);
        const lecture: Lecture = fetched
          ? {
              ...fetched,
              title: speakerLecture.title || fetched.title,
              speaker: speaker.name || fetched.speaker,
              specialty: speakerLecture.subspecialty || fetched.specialty,
              youtubeId: speakerLecture.youtubeId,
            }
          : {
              id: speakerLecture.youtubeId,
              title: speakerLecture.title,
              speaker: speaker.name,
              specialty: speakerLecture.subspecialty,
              duration: "",
              thumbnail: "",
              description: "",
              youtubeId: speakerLecture.youtubeId,
            };

        lectureItemsById.set(speakerLecture.youtubeId, {
          type: "lecture",
          id: speakerLecture.youtubeId,
          title: lecture.title,
          subtitle: `${lecture.speaker} · ${lecture.specialty}`,
          lecture,
        });
      }
    }

    return [
      ...pageItems,
      ...speakerItems,
      ...eventItems,
      ...resourceItems,
      ...Array.from(lectureItemsById.values()),
    ];
  }, [globalSearchLecturesQuery.data]);

  const handleSelectItem = (item: SearchItem) => {
    switch (item.type) {
      case "lecture":
        handleSelectLecture(item.lecture);
        return;
      case "resource":
        window.open(item.href, "_blank", "noopener,noreferrer");
        return;
      case "page":
      case "speaker":
      case "event":
        navigate(item.href);
        return;
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 nav-blur border-b border-border/30">
      <div className="relative w-full max-w-[1400px] mx-auto flex items-center justify-between px-4 md:px-8 h-16">
        {/* Logo */}
        <div className="flex items-center">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
            className="flex items-center gap-1"
          >
            <img
              src={pathcastLogo}
              alt="pathCast"
              className="h-8 dark:hidden"
            />
            <img
              src={pathcastWhiteLogo}
              alt="pathCast"
              className="h-8 hidden dark:block"
            />
            <span className="font-bold text-lg text-primary dark:text-[#EAF2F5]">
              pathCast
            </span>
          </a>
        </div>

        {/* Center nav (desktop) */}
        <div className="hidden md:flex items-center gap-6 lg:gap-7 xl:gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.href);
              }}
              className={`text-sm transition-colors duration-200 ${
                isNavItemActive(item.href)
                  ? "text-primary dark:text-[#4EC6B5] font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSearchClick}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            type="button"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <ThemeToggle />
          {isLive ? (
            <a
              href="/#live"
              onClick={(e) => {
                e.preventDefault();
                if (location.pathname === "/") {
                  document
                    .getElementById("live")
                    ?.scrollIntoView({ behavior: "smooth" });
                } else {
                  navigate("/#live");
                }
              }}
              className="hidden sm:flex items-center gap-1.5 bg-[#FF0033] text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-[#FF0033]/90 transition-colors"
            >
              <Radio className="w-3.5 h-3.5 live-pulse" />
              Live Now
            </a>
          ) : (
            <span className="hidden sm:flex items-center gap-1.5 bg-muted text-muted-foreground px-4 py-1.5 rounded text-sm font-medium cursor-default opacity-60">
              <Radio className="w-3.5 h-3.5" />
              Offline
            </span>
          )}
          <button
            className="md:hidden p-2 text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border/30 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.href);
                    setMobileOpen(false);
                  }}
                  className={`text-sm ${
                    isNavItemActive(item.href)
                      ? "text-primary dark:text-[#4EC6B5] font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </a>
              ))}
              {isLive ? (
                <a
                  href="/#live"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileOpen(false);
                    if (location.pathname === "/") {
                      document
                        .getElementById("live")
                        ?.scrollIntoView({ behavior: "smooth" });
                    } else {
                      navigate("/#live");
                    }
                  }}
                  className="flex items-center gap-1.5 bg-[#FF0033] text-white px-4 py-2 rounded text-sm font-medium w-fit"
                >
                  <Radio className="w-3.5 h-3.5 live-pulse" />
                  Live Now
                </a>
              ) : (
                <span className="flex items-center gap-1.5 bg-muted text-muted-foreground px-4 py-2 rounded text-sm font-medium w-fit opacity-60">
                  <Radio className="w-3.5 h-3.5" />
                  Offline
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay
        open={searchOpen}
        items={searchItems}
        onClose={() => setSearchOpen(false)}
        onSelectItem={handleSelectItem}
      />
      <VideoPlayerModal
        lecture={selectedLecture}
        open={playerOpen}
        onOpenChange={setPlayerOpen}
      />
    </nav>
  );
};

export default Navbar;

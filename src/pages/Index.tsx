import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Globe, Play, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import LiveNowSection from "@/components/LiveNowSection";
import VideoRow from "@/components/VideoRow";
import VideoPlayerModal from "@/components/VideoPlayerModal";
import Footer from "@/components/Footer";
import TestimonialCarousel, {
  type Testimonial,
} from "@/components/TestimonialCarousel";
import tatianeTestimonialImage from "@/assets/Testimonial-Image/Tatiane Comunello, MD.png";
import enricoTestimonialImage from "@/assets/Testimonial-Image/Enrico Munari, MD, PhD.png";
import neilTestimonialImage from "@/assets/Testimonial-Image/Neil Theise, MD.jpg";
import type { Lecture } from "@/data/lectures";
import {
  getChannelStatistics,
  getLatestVideos,
  getPlaylistVideos,
} from "@/services/youtubeService";
import { useSectionVisible } from "@/hooks/use-section-visible";
import { useLiveStatus } from "@/hooks/use-live-status";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import CTASection from "@/components/CTASection";

type ChannelStats = {
  subscriberCount: number | null;
  videoCount: number | null;
};

const Index = () => {
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [playerOpen, setPlayerOpen] = useState(false);

  const { liveVideos } = useLiveStatus();

  const recentSection = useSectionVisible<HTMLDivElement>();
  const trendingNowSection = useSectionVisible<HTMLDivElement>();
  const pathBoardsSection = useSectionVisible<HTMLDivElement>();
  const pathLegendsSection = useSectionVisible<HTMLDivElement>();
  const pathcastPicksSection = useSectionVisible<HTMLDivElement>();

  const heroQuery = useQuery({
    queryKey: ["youtube", "hero"],
    queryFn: () => getLatestVideos(1),
    staleTime: 10 * 60 * 1000,
  });

  const channelStatsQuery = useQuery<ChannelStats>({
    queryKey: ["youtube", "channel", "statistics"],
    queryFn: getChannelStatistics,
    staleTime: 30 * 60 * 1000,
  });

  const latestQuery = useQuery({
    queryKey: ["youtube", "latest"],
    queryFn: () => getLatestVideos(12),
    enabled: recentSection.isVisible,
    staleTime: 10 * 60 * 1000,
  });

  const trendingNowQuery = useQuery({
    queryKey: ["youtube", "playlist", "PL4GDLmrdXtfT5gvsPfpaSIrz6aOkVekYE"],
    queryFn: () => getPlaylistVideos("PL4GDLmrdXtfT5gvsPfpaSIrz6aOkVekYE"),
    enabled: trendingNowSection.isVisible,
    staleTime: 20 * 60 * 1000,
  });

  const pathBoardsQuery = useQuery({
    queryKey: ["youtube", "playlist", "PL4GDLmrdXtfT-w9Q93NlvptjuZ1QYfzYB"],
    queryFn: () => getPlaylistVideos("PL4GDLmrdXtfT-w9Q93NlvptjuZ1QYfzYB"),
    enabled: pathBoardsSection.isVisible,
    staleTime: 20 * 60 * 1000,
  });

  const pathLegendsQuery = useQuery({
    queryKey: ["youtube", "playlist", "PL4GDLmrdXtfSUAx0_jni2dbxhN3UJCKK1"],
    queryFn: () => getPlaylistVideos("PL4GDLmrdXtfSUAx0_jni2dbxhN3UJCKK1"),
    enabled: pathLegendsSection.isVisible,
    staleTime: 20 * 60 * 1000,
  });

  const pathcastPicksQuery = useQuery({
    queryKey: ["youtube", "playlist", "PL4GDLmrdXtfSooTUd1yCY-Tk6V7Bi4sVP"],
    queryFn: () => getPlaylistVideos("PL4GDLmrdXtfSooTUd1yCY-Tk6V7Bi4sVP"),
    enabled: pathcastPicksSection.isVisible,
    staleTime: 20 * 60 * 1000,
  });

  const playLecture = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setPlayerOpen(true);
  };

  const formatCount = (value: number | null) => {
    if (!value && value !== 0) return "—";
    if (value >= 10_000) {
      return new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(value);
    }
    return new Intl.NumberFormat("en-US").format(value);
  };

  const subscriberCount = channelStatsQuery.data?.subscriberCount ?? null;
  const videoCount = channelStatsQuery.data?.videoCount ?? null;

  const testimonials: Testimonial[] = [
    {
      quote:
        "As a pathologist in training, pathCast is a fundamental support in my education. I consistently seek its guidance with the confidence that the information provided is up-to-date, practical, and delivered by highly qualified professionals. It is wonderful to be able to rely on a platform that truly supports my training and complements my studies.",
      authorName: "Tatiane Comunello, MD",
      designation: "Resident Physician, Pathology",
      institution: "A.C. Camargo Cancer Center",
      authorImageSrc: tatianeTestimonialImage,
      authorImageAlt: "Tatiane Comunello, MD",
      country: "Brazil",
    },
    {
      quote:
        "pathCast is a revolutionary way to learn pathology: open-access, case-based live teaching on YouTube and Facebook, then archived as subspecialty playlists for quick on-demand review. It’s a real example of democratizing diagnostic knowledge worldwide. I use it constantly, and I strongly encourage my residents to do the same as part of their routine training.",
      authorName: "Enrico Munari, MD, PhD ",
      designation: "Pathologist",
      institution: "AOUI Verona",
      authorImageSrc: enricoTestimonialImage,
      authorImageAlt: "Enrico Munari, MD, PhD",
      country: "Italy",
    },
    {
      quote:
        "pathCast is one of the most inspiring and efficient global efforts to spread state-of-the-art pathology diagnostic practices ever conceived.",
      authorName: "Neil Theise, MD",
      designation: "Inaugural pathCast speaker",
      institution: "Formerly at New York University",
      authorImageSrc: neilTestimonialImage,
      authorImageAlt: "Neil Theise, MD",
      country: " NY",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroCarousel lectures={heroQuery.data ?? []} onPlay={playLecture} />

      {/* ── Section A: Stats ─────────────────────────────────────── */}
      <section className="section-a w-full py-8 md:py-10">
        <div className="px-4 md:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-8">
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">
                By the numbers
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Our Channel by the Numbers
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-card border border-border rounded-2xl shadow-sm p-8 flex flex-col gap-4 hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-4xl font-bold text-foreground leading-none tracking-tight">
                    {formatCount(subscriberCount)}+
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    YouTube Subscribers
                  </p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl shadow-sm p-8 flex flex-col gap-4 hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Play className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-4xl font-bold text-foreground leading-none tracking-tight">
                    {formatCount(videoCount)}+
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Total Lectures
                  </p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl shadow-sm p-8 flex flex-col gap-4 hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-4xl font-bold text-foreground leading-none tracking-tight">
                    170+
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Countries Reached
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section B: Live + Video Rows ─────────────────────────── */}
      <section className="section-b w-full py-10">
        <LiveNowSection lectures={liveVideos} onPlay={playLecture} />

        {/* Video rows heading */}
        <div className="px-4 md:px-8 mt-10 mb-2">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">
            Explore Content
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Featured Lectures
          </h2>
        </div>

        <div ref={recentSection.ref} className="mt-6">
          <VideoRow
            title="New On pathCast"
            lectures={latestQuery.data ?? []}
            onPlay={playLecture}
          />
        </div>
        <div ref={pathBoardsSection.ref}>
          <VideoRow
            title="PathBoards"
            lectures={pathBoardsQuery.data ?? []}
            onPlay={playLecture}
          />
        </div>
        <div ref={trendingNowSection.ref}>
          <VideoRow
            title="Trending Now"
            lectures={trendingNowQuery.data ?? []}
            onPlay={playLecture}
          />
        </div>
        <div ref={pathLegendsSection.ref}>
          <VideoRow
            title="Pathology Legends"
            lectures={pathLegendsQuery.data ?? []}
            onPlay={playLecture}
          />
        </div>
        <div ref={pathcastPicksSection.ref}>
          <VideoRow
            title="pathCast Picks"
            lectures={pathcastPicksQuery.data ?? []}
            onPlay={playLecture}
          />
        </div>
      </section>
      <CTASection />

      {/* ── Section A: Testimonials ───────────────────────────────── */}
      <section className="section-a w-full py-12 px-4 md:px-8">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              What Our Community Says
            </h2>
            <p className="text-muted-foreground mt-2">
              Hear from pathologists and educators around the world
            </p>
          </div>
          <TestimonialCarousel testimonials={testimonials} />
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

export default Index;

import { useState } from "react";
import { Play, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { Lecture } from "@/data/lectures";

interface HeroCarouselProps {
  lectures: Lecture[];
  onPlay?: (lecture: Lecture) => void;
}

const HeroCarousel = ({ lectures, onPlay }: HeroCarouselProps) => {
  const [thumbHovered, setThumbHovered] = useState(false);
  const navigate = useNavigate();

  const featured = lectures[0] ?? null;

  return (
    <section className="relative w-full min-h-[80vh] flex items-center overflow-hidden bg-background">
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* ── LEFT: Static copy ── */}
          <motion.div
            className="flex-1 max-w-xl"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Badge */}
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6">
              Global Open-Access Pathology Education
            </span>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] mb-5">
              Bridging the <span className="text-primary">Knowledge Gap</span>{" "}
              in Pathology Worldwide
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Access hundreds of free, high-quality pathology lectures from
              world-renowned experts. Streamed live and available on-demand.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/search")}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors shadow-md"
              >
                Browse Lectures
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/about")}
                className="flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-lg font-semibold text-sm hover:bg-accent transition-colors"
              >
                Learn More
              </button>
            </div>
          </motion.div>

          {/* ── RIGHT: Featured video card ── */}
          <motion.div
            className="flex-1 w-full max-w-xl lg:max-w-2xl lg:ml-auto"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          >
            {featured ? (
              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-border/60 cursor-pointer group"
                onClick={() => onPlay?.(featured)}
                onMouseEnter={() => setThumbHovered(true)}
                onMouseLeave={() => setThumbHovered(false)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-muted overflow-hidden">
                  <img
                    src={featured.thumbnail}
                    alt={featured.title}
                    className={`w-full h-full object-cover transition-transform duration-500 ${thumbHovered ? "scale-105" : "scale-100"}`}
                  />

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className={`w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg transition-transform duration-200 ${thumbHovered ? "scale-110" : "scale-100"}`}
                    >
                      <Play className="w-6 h-6 text-primary fill-primary ml-1" />
                    </div>
                  </div>

                  {/* Featured badge */}
                  <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded">
                    Featured Lecture
                  </span>

                  {/* Duration */}
                  <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-0.5 rounded font-medium">
                    {featured.duration}
                  </span>
                </div>

                {/* Card footer */}
                <div className="bg-card px-5 py-4">
                  <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug mb-1">
                    {featured.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {featured.speaker}
                  </p>
                </div>
              </div>
            ) : (
              /* Skeleton while loading */
              <div className="relative rounded-2xl overflow-hidden border border-border/60 shadow-2xl">
                <div className="aspect-video bg-muted animate-pulse" />
                <div className="bg-card px-5 py-4 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;

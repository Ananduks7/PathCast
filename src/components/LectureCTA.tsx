import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight, Play } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Lecture } from "@/data/lectures";

type StaticCard = {
  title: string;
  label: string;
  date: string;
  thumbnail: string;
};

const STATIC_CARDS: StaticCard[] = [
  {
    title: "Advances in Digital Pathology",
    label: "Lecture • 12 min read",
    date: "March 2026",
    thumbnail: "",
  },
  {
    title: "AI in Cancer Diagnostics",
    label: "Lecture • 10 min read",
    date: "February 2026",
    thumbnail: "",
  },
  {
    title: "Histopathology Essentials",
    label: "Lecture • 15 min read",
    date: "January 2026",
    thumbnail: "",
  },
];

type CardData = {
  id: string;
  title: string;
  label: string;
  date: string;
  thumbnail: string;
  youtubeId?: string;
};

function toCardData(lectures: Lecture[]): CardData[] {
  return lectures.slice(0, 3).map((l) => ({
    id: l.id,
    title: l.title,
    label: `Lecture • ${l.duration ?? ""}`,
    date: l.publishedAt
      ? new Intl.DateTimeFormat("en-US", {
          month: "long",
          year: "numeric",
        }).format(new Date(l.publishedAt))
      : "",
    thumbnail: l.thumbnail,
    youtubeId: l.youtubeId,
  }));
}

function fromStatic(): CardData[] {
  return STATIC_CARDS.map((c, i) => ({ ...c, id: String(i) }));
}

type LectureCTAProps = {
  /** Pass the latest fetched lectures; falls back to static placeholders if empty */
  lectures?: Lecture[];
  className?: string;
};

const LectureCTA = ({ lectures, className }: LectureCTAProps) => {
  const cards: CardData[] =
    lectures && lectures.length >= 3 ? toCardData(lectures) : fromStatic();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -400 : 400, behavior: "smooth" });
    setTimeout(updateScrollState, 350);
  };

  return (
    <section className={cn("py-16 md:py-20 px-4 md:px-8", className)}>
      <div className="w-full max-w-[1400px] mx-auto">
        {/* Header row */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
              Expand Your Knowledge
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Insights &amp; Lectures from Leading Pathologists
            </p>
          </div>
        </div>

        {/* Cards */}
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8"
        >
          {cards.map((card) => (
            <Link
              key={card.id}
              to={
                card.youtubeId
                  ? `/search?q=${encodeURIComponent(card.title)}`
                  : "/search"
              }
              className="group block"
            >
              {/* Thumbnail */}
              <div className="relative overflow-hidden rounded-sm bg-muted aspect-video mb-4">
                {card.thumbnail ? (
                  <img
                    src={card.thumbnail}
                    alt={card.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Play className="w-10 h-10 text-muted-foreground/30" />
                  </div>
                )}
              </div>

              {/* Meta */}
              <p className="text-xs text-muted-foreground flex justify-between mb-2">
                <span>{card.label}</span>
                {card.date && <span>{card.date}</span>}
              </p>

              {/* Title */}
              <h3 className="text-base font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
                {card.title}
              </h3>
            </Link>
          ))}
        </div>

        {/* CTA block */}
        <div className="mt-14 text-center">
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-7 py-3 border border-border rounded-sm text-sm font-medium text-foreground hover:bg-muted transition-colors duration-200"
          >
            Explore All Lectures
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LectureCTA;

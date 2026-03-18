import { Radio } from "lucide-react";
import type { Lecture } from "@/data/lectures";

interface LiveNowSectionProps {
  lectures: Lecture[];
  onPlay?: (lecture: Lecture) => void;
}

const LiveNowSection = ({ lectures, onPlay }: LiveNowSectionProps) => {
  if (lectures.length === 0) return null;

  return (
    <section id="live" className="px-4 md:px-8 mb-10 md:mb-12">
      <div className="flex items-center gap-2 mb-4">
        <Radio className="w-5 h-5 text-primary live-pulse" />
        <h2 className="text-lg md:text-xl font-semibold text-foreground">
          Live Now
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {lectures.map((lecture) => (
          <div
            key={lecture.id}
            onClick={() => onPlay?.(lecture)}
            className="relative bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors group cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onPlay?.(lecture);
              }
            }}
          >
            <div className="relative aspect-video">
              <img
                src={lecture.thumbnail}
                alt={lecture.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded">
                <span className="w-1.5 h-1.5 bg-primary-foreground rounded-full live-pulse" />
                LIVE
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-foreground text-sm line-clamp-1">
                {lecture.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {lecture.speaker}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay?.(lecture);
                }}
                className="mt-3 bg-primary text-primary-foreground text-xs font-medium px-4 py-2 rounded hover:bg-primary/90 transition-colors"
              >
                Join Live
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LiveNowSection;

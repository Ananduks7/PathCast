import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import VideoCard from "./VideoCard";
import type { Lecture } from "@/data/lectures";

interface VideoRowProps {
  title: string;
  lectures: Lecture[];
  onPlay?: (lecture: Lecture) => void;
}

const VideoRow = ({ title, lectures, onPlay }: VideoRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (lectures.length === 0) return null;

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="mb-8 md:mb-10">
      <div className="flex items-center justify-between px-4 md:px-8 mb-3">
        <h2 className="text-lg md:text-xl font-bold text-foreground">
          {title}
        </h2>
        <div className="flex gap-1">
          <button
            onClick={() => scroll("left")}
            className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="video-row-scroll px-4 md:px-8">
        {lectures.map((lecture) => (
          <VideoCard key={lecture.id} lecture={lecture} onPlay={onPlay} />
        ))}
      </div>
    </section>
  );
};

export default VideoRow;

import { Play, Clock, User } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import type { Lecture } from "@/data/lectures";

interface VideoCardProps {
  lecture: Lecture;
  onPlay?: (lecture: Lecture) => void;
}

interface PreviewPos {
  top: number;
  left: number;
  width: number;
}

const VideoCard = ({ lecture, onPlay }: VideoCardProps) => {
  const [hovered, setHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPos, setPreviewPos] = useState<PreviewPos | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    timerRef.current = setTimeout(() => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const previewW = Math.max(rect.width * 1.35, 320);
        // Center over the card; clamp so it doesn't go off-screen
        let left = rect.left + rect.width / 2 - previewW / 2;
        left = Math.max(8, Math.min(left, window.innerWidth - previewW - 8));
        setPreviewPos({ top: rect.top, left, width: previewW });
      }
      setShowPreview(true);
    }, 600);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setShowPreview(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  // Recalculate position on scroll so preview stays aligned
  useEffect(() => {
    if (!showPreview) return;
    const update = () => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const previewW = Math.max(rect.width * 1.35, 320);
        let left = rect.left + rect.width / 2 - previewW / 2;
        left = Math.max(8, Math.min(left, window.innerWidth - previewW - 8));
        setPreviewPos({ top: rect.top, left, width: previewW });
      }
    };
    window.addEventListener("scroll", update, true);
    return () => window.removeEventListener("scroll", update, true);
  }, [showPreview]);

  return (
    <motion.div
      ref={cardRef}
      className="relative flex-shrink-0 w-[200px] md:w-[260px] lg:w-[360px] cursor-pointer group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onPlay?.(lecture)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
    >
      {/* Base card */}
      <div className="video-card-base rounded-md overflow-hidden">
        <div className="relative aspect-video bg-muted">
          <img
            src={lecture.thumbnail}
            alt={lecture.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <span className="absolute bottom-2 right-2 bg-background/80 text-foreground text-xs px-1.5 py-0.5 rounded font-medium">
            {lecture.duration}
          </span>
          <div
            className={`absolute inset-0 bg-background/50 flex items-center justify-center transition-opacity duration-200 ${
              hovered && !showPreview ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Play className="w-4 h-4 text-primary-foreground fill-current ml-0.5" />
            </div>
          </div>
        </div>
        <div className="p-2.5">
          <h3 className="text-sm font-medium text-foreground line-clamp-1">
            {lecture.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {lecture.speaker}
          </p>
          <span className="inline-block mt-1.5 text-[10px] font-medium bg-secondary/15 text-secondary px-2 py-0.5 rounded-full border border-secondary/20">
            {lecture.specialty}
          </span>
        </div>
      </div>

      {/* Netflix-style hover preview — rendered in a portal so it escapes all overflow */}
      {showPreview &&
        previewPos &&
        createPortal(
          <AnimatePresence>
            <motion.div
              key={lecture.id}
              initial={{ opacity: 0, scale: 0.93, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 6 }}
              transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                position: "fixed",
                top: previewPos.top,
                left: previewPos.left,
                width: previewPos.width,
                zIndex: 9999,
                transformOrigin: "center top",
                pointerEvents: "auto",
              }}
              onMouseEnter={() => {
                /* keep open */
              }}
              onMouseLeave={handleMouseLeave}
              onClick={() => onPlay?.(lecture)}
            >
              <div className="bg-card rounded-lg overflow-hidden shadow-2xl shadow-black/30 border border-border/60">
                {/* Video preview */}
                <div className="relative aspect-video bg-muted">
                  {lecture.youtubeId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${lecture.youtubeId}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0&enablejsapi=1`}
                      title={lecture.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <img
                      src={lecture.thumbnail}
                      alt={lecture.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent" />
                </div>

                {/* Info section */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlay?.(lecture);
                      }}
                      className="flex items-center gap-1.5 bg-foreground text-background px-4 py-2 rounded-md text-sm font-semibold hover:bg-foreground/90 transition-colors"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Watch
                    </button>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-foreground line-clamp-2">
                      {lecture.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {lecture.speaker}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lecture.duration}
                      </span>
                    </div>
                  </div>

                  <span className="inline-block text-[10px] font-medium bg-secondary/15 text-secondary px-2 py-0.5 rounded-full border border-secondary/20">
                    {lecture.specialty}
                  </span>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {lecture.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body,
        )}
    </motion.div>
  );
};

export default VideoCard;

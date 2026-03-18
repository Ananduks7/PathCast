import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  X,
  Play,
  GraduationCap,
  Calendar,
  BookOpen,
  FileText,
  ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { SearchItem } from "@/types/search";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  items: SearchItem[];
  onSelectItem: (item: SearchItem) => void;
}

const SearchOverlay = ({
  open,
  items,
  onClose,
  onSelectItem,
}: SearchOverlayProps) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const uniqueItems = Array.from(
      new Map(items.map((item) => [`${item.type}:${item.id}`, item])).values(),
    );
    return uniqueItems
      .filter((item) => {
        const title = item.title.toLowerCase();
        const subtitle = (item.subtitle ?? "").toLowerCase();
        return title.includes(q) || subtitle.includes(q);
      })
      .slice(0, 12);
  }, [query, items]);

  const getLeadingIcon = (item: SearchItem) => {
    switch (item.type) {
      case "speaker":
        return <GraduationCap className="w-5 h-5 text-primary" />;
      case "event":
        return <Calendar className="w-5 h-5 text-primary" />;
      case "resource":
        return <BookOpen className="w-5 h-5 text-primary" />;
      case "page":
        return <FileText className="w-5 h-5 text-primary" />;
      case "lecture":
        return <Play className="w-5 h-5 text-primary fill-current" />;
    }
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="min-h-full w-full flex items-start justify-center p-4 pt-20 md:pt-24">
            <div className="w-full max-w-3xl bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 border-b border-border px-4 py-4">
                <Search className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search lectures, faculty, resources, events..."
                  className="flex-1 bg-transparent text-lg md:text-xl text-foreground outline-none placeholder:text-muted-foreground"
                />
                <button
                  onClick={onClose}
                  className="p-2 text-muted-foreground hover:text-foreground"
                  type="button"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-2 py-2 md:px-4 md:py-4">
                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                  {query.trim() && results.length === 0 && (
                    <p className="text-muted-foreground text-sm py-8 text-center">
                      No results found for "{query}"
                    </p>
                  )}
                  {results.map((item) => {
                    const isLecture = item.type === "lecture";
                    const thumbnail =
                      item.type === "lecture"
                        ? item.lecture.thumbnail
                        : undefined;

                    return (
                      <button
                        key={`${item.type}:${item.id}`}
                        onClick={() => {
                          onSelectItem(item);
                          onClose();
                          setQuery("");
                        }}
                        className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors text-left group"
                        type="button"
                      >
                        {isLecture ? (
                          <div className="relative w-28 aspect-video rounded overflow-hidden flex-shrink-0 bg-muted">
                            {thumbnail ? (
                              <img
                                src={thumbnail}
                                alt=""
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                {getLeadingIcon(item)}
                              </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-background/50 transition-opacity">
                              <Play className="w-5 h-5 text-primary fill-current" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                            {getLeadingIcon(item)}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {item.title}
                          </p>
                          {item.subtitle && (
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                              {item.subtitle}
                            </p>
                          )}
                        </div>

                        {item.type === "resource" && (
                          <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default SearchOverlay;

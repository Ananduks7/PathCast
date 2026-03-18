import { useMemo, useState } from "react";
import { Calendar, Clock, ExternalLink, Video } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  getPastLivestreamEvents,
  getUpcomingEvents,
} from "@/services/youtubeService";
import type { Event } from "@/data/events";

const FORMAT_COLORS: Record<string, string> = {
  webinar: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  conference: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  lecture: "bg-green-500/10 text-green-400 border-green-500/20",
  workshop: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

const FILTERS = ["all", "upcoming", "past"] as const;

const Events = () => {
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("upcoming");

  const upcomingQuery = useQuery({
    queryKey: ["youtube", "events", "upcoming"],
    queryFn: () => getUpcomingEvents(30),
    staleTime: 5 * 60 * 1000,
  });

  const pastQuery = useQuery({
    queryKey: ["youtube", "events", "past"],
    queryFn: () => getPastLivestreamEvents(60),
    staleTime: 10 * 60 * 1000,
  });

  const allEvents = useMemo(() => {
    const upcoming = (upcomingQuery.data ?? []) as Event[];
    const past = (pastQuery.data ?? []) as Event[];
    return [...upcoming, ...past];
  }, [upcomingQuery.data, pastQuery.data]);

  const filtered = useMemo(
    () => allEvents.filter((e) => filter === "all" || e.type === filter),
    [allEvents, filter],
  );

  const isLoading = upcomingQuery.isLoading || pastQuery.isLoading;
  const hasError = Boolean(upcomingQuery.error || pastQuery.error);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-[#0d2e2e] via-[#0d3535] to-[#0a2222] overflow-hidden min-h-[480px] flex flex-col justify-center">
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
            pathCast Events
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
          >
            Upcoming &amp; Past Events
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/75 leading-relaxed max-w-2xl mx-auto"
          >
            Join live pathology lectures, webinars, and workshops from leading
            experts around the world. All events are free and open-access.
          </motion.p>
        </div>
      </section>

      <section className="section-a w-full">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 pb-12 pt-10">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all"
                ? "All Events"
                : f === "upcoming"
                  ? "Upcoming"
                  : "Past"}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {hasError ? (
          <div className="text-center py-20 text-muted-foreground">
            Unable to load events right now.
          </div>
        ) : isLoading && allEvents.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            Loading events...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {filtered.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4 hover:border-primary/40 transition-colors"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${FORMAT_COLORS[event.format]}`}
                  >
                    {event.format}
                  </span>
                  {event.type === "upcoming" ? (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                      Upcoming
                    </span>
                  ) : (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                      Past
                    </span>
                  )}
                </div>

                {/* Title */}
                <div>
                  <h2 className="text-base font-semibold text-foreground leading-snug mb-1">
                    {event.title}
                  </h2>
                  {event.speaker && (
                    <p className="text-sm text-primary">{event.speaker}</p>
                  )}
                  {event.specialty && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {event.specialty}
                    </p>
                  )}
                </div>

                {/* Meta */}
                <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="w-3.5 h-3.5 shrink-0" />
                    {event.location}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {event.description}
                </p>

                {/* CTA */}
                {event.link && event.type === "upcoming" && (
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:bg-primary/90 transition-colors w-fit"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Join
                  </a>
                )}

                {event.link && event.type === "past" && (
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:bg-primary/90 transition-colors w-fit"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Watch
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && !hasError && filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No events found.
          </div>
        )}

      </div>
      </section>
      <Footer />
    </div>
  );
};

export default Events;

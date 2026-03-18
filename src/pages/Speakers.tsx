import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  User,
  MapPin,
  GraduationCap,
  Play,
  Users,
  Building2,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TestimonialCarousel, {
  type Testimonial,
} from "@/components/TestimonialCarousel";
import faustoTestimonialImage from "@/assets/Testimonial-Image/Fausto Rodriguez, MD.jpg";
import hadasTestimonialImage from "@/assets/Testimonial-Image/Hadas Skupsky, MD FAAD.jpg";
import felipeTestimonialImage from "@/assets/Testimonial-Image/Felipe D’Almeida Costa, MD, PhD.png";
import {
  speakers,
  allSpeakerSubspecialties,
  allInstitutions,
} from "@/data/speakers";
import type { Speaker } from "@/data/speakers";

const BATCH_SIZE = 20;

const Speakers = () => {
  const [query, setQuery] = useState("");
  const [selectedSubspecialty, setSelectedSubspecialty] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [selectedLetter, setSelectedLetter] = useState("");
  const sentinelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    let result = [...speakers];
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.institution.toLowerCase().includes(q) ||
          s.subspecialties.some((sub) => sub.toLowerCase().includes(q)),
      );
    }
    if (selectedSubspecialty) {
      result = result.filter((s) =>
        s.subspecialties.includes(selectedSubspecialty),
      );
    }
    if (selectedInstitution) {
      result = result.filter((s) => s.institution === selectedInstitution);
    }
    if (selectedLetter) {
      result = result.filter((s) =>
        s.name.trimStart().toUpperCase().startsWith(selectedLetter),
      );
    }
    return result;
  }, [query, selectedSubspecialty, selectedInstitution, selectedLetter]);

  // Reset visible count whenever filters change
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [query, selectedSubspecialty, selectedInstitution, selectedLetter]);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filtered.length));
  }, [filtered.length]);

  // Sentinel observer — fires loadMore when bottom sentinel enters viewport
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  const visibleSpeakers = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const speakerTestimonials: Testimonial[] = [
    {
      quote:
        "I have been delivering online lectures through pathCast since 2018, with over 20 sessions presented. It is an excellent educational platform, particularly for sharing updates on the evolving WHO Classification and cIMPACT-NOW. Its flexibility supports both formal lectures and interactive, case-based slide discussions using my own microscope, closely replicating traditional teaching. A particularly rewarding aspect is the global reach, including participants who may not access major international meetings. Most recently, I appreciated the opportunity to present to Spanish-speaking audiences, further extending its impact.",
      authorName: "Fausto Rodriguez, MD",
      designation: "Professor of Pathology",
      institution: "University of California, Los Angeles",
      authorImageSrc: faustoTestimonialImage,
      authorImageAlt: "Fausto Rodriguez, MD",
      country: "USA",
    },
    {
      quote:
        "pathCast is an outstanding educational resource for both trainees and practicing pathologists. The platform brings together world-class experts and delivers high-quality, practical lectures that are accessible from anywhere. It has been a privilege to help develop the dermatopathology curriculum and contribute to such a valuable global learning community.",
      authorName: "Hadas Skupsky, MD FAAD",
      designation: "Dermatopathologist",
      institution: "University of California, Irvine",
      authorImageSrc: hadasTestimonialImage,
      authorImageAlt: "Hadas Skupsky, MD FAAD",
      country: "USA",
    },
    {
      quote:
        "It has been a privilege to contribute to pathCast both as a lecturer and as a coordinator of our Latin American lecture series. Delivering sessions in Spanish and Portuguese allowed us to broaden access to high-quality pathology education and engage colleagues across diverse regions. pathCast represents an innovative and inclusive academic platform that connects pathologists worldwide and fosters meaningful knowledge exchange. The platform’s commitment to academic rigor, accessibility, and international collaboration makes it a valuable resource for pathologists at every stage of training and practice. I am grateful to be part of this growing global community!",
      authorName: "Felipe D’Almeida Costa, MD, PhD",
      designation: "",
      institution: "A.C. Camargo Cancer Center",
      authorImageSrc: felipeTestimonialImage,
      authorImageAlt: "Felipe D’Almeida Costa, MD, PhD",
      country: "Brazil",
    },
  ];

  const marqueeInstitutions = [
    "Cleveland Clinic",
    "Weill Cornell Medicine",
    "Johns Hopkins University",
    "Harvard Medical School",
    "Mayo Clinic",
    "Memorial Sloan Kettering",
    "Emory University",
    "Yale School of Medicine",
    "University of Pennsylvania",
    "UCLA Geffen School of Medicine",
    "MD Anderson Cancer Center",
    "University of Toronto",
    "Icahn School of Medicine at Mt. Sinai",
    "NYU Grossman School of Medicine",
    "Brigham and Women's Hospital",
    "University of Chicago",
    "A.C. Camargo Cancer Center",
    "University of Sydney",
    "Loma Linda University",
    "University of Virginia",
  ];

  return (
    <div className="min-h-screen bg-background">
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
          will-change: transform;
        }
        .marquee-wrapper:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>

      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#0d2e2e] via-[#0d3535] to-[#0a2222] overflow-hidden min-h-[480px] flex flex-col justify-center">
        {/* subtle grid texture */}
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
            pathCast Faculty
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
          >
            Our Faculty
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/75 leading-relaxed max-w-2xl mx-auto"
          >
            World-renowned experts from leading institutions across the world,
            sharing expertise freely with the global community.
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
              { icon: Users, value: "100+", label: "FACULTY" },
              { icon: Building2, value: "50+", label: "INSTITUTIONS" },
              { icon: Globe, value: "6", label: "CONTINENTS" },
            ].map(({ icon: Icon, value, label }) => (
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

      {/* ── SCROLLING INSTITUTION TICKER ─────────────────────────────── */}
      <div className="marquee-wrapper bg-background border-b border-border overflow-hidden py-4 select-none">
        <div className="animate-marquee flex gap-0 whitespace-nowrap">
          {[...marqueeInstitutions, ...marqueeInstitutions].map((name, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 px-6 text-xs font-semibold tracking-widest uppercase text-muted-foreground"
            >
              {name}
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40 shrink-0" />
            </span>
          ))}
        </div>
      </div>

      {/* ── SEARCH + FILTERS ─────────────────────────────────────────── */}
      <section className="section-a w-full">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 pt-10">
          {/* Sticky wrapper — on mobile: search only; on md+: search + dropdowns + A-Z */}
          <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm pt-2 pb-3 -mx-4 md:-mx-8 px-4 md:px-8 border-b border-border/50 mb-3">
            {/* Row: search always visible; dropdowns hidden on mobile */}
            <div className="flex flex-col md:flex-row gap-3 md:mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, institution, or subspecialty..."
                  className="w-full h-11 pl-10 pr-4 bg-card border border-border rounded-lg text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              {/* Dropdowns — sticky on desktop only */}
              <select
                value={selectedSubspecialty}
                onChange={(e) => setSelectedSubspecialty(e.target.value)}
                className="hidden md:block h-11 px-3 bg-card border border-border rounded-lg text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">All Subspecialties</option>
                {allSpeakerSubspecialties.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select
                value={selectedInstitution}
                onChange={(e) => setSelectedInstitution(e.target.value)}
                className="hidden md:block h-11 px-3 bg-card border border-border rounded-lg text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/50 max-w-xs"
              >
                <option value="">All Institutions</option>
                {allInstitutions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* A–Z bar — sticky on all screens */}
            <div className="w-full overflow-x-auto mt-2 md:mt-0">
              <div className="flex items-center w-full min-w-max md:min-w-0 bg-card border border-border rounded-lg p-1 divide-x divide-border">
                <button
                  onClick={() => setSelectedLetter("")}
                  className={`shrink-0 px-3 py-1.5 rounded text-xs font-semibold transition-colors whitespace-nowrap ${
                    selectedLetter === ""
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  All
                </button>
                <div className="flex flex-1 items-center divide-x divide-border">
                  {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
                    <button
                      key={letter}
                      onClick={() =>
                        setSelectedLetter((prev) =>
                          prev === letter ? "" : letter,
                        )
                      }
                      className={`flex-1 min-w-[1.6rem] py-1.5 text-xs font-semibold transition-colors text-center ${
                        selectedLetter === letter
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile-only: dropdowns scroll normally */}
          <div className="md:hidden flex flex-col gap-3 mb-4">
            <select
              value={selectedSubspecialty}
              onChange={(e) => setSelectedSubspecialty(e.target.value)}
              className="h-11 px-3 bg-card border border-border rounded-lg text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All Subspecialties</option>
              {allSpeakerSubspecialties.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={selectedInstitution}
              onChange={(e) => setSelectedInstitution(e.target.value)}
              className="h-11 px-3 bg-card border border-border rounded-lg text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All Institutions</option>
              {allInstitutions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            <span className="text-foreground font-medium">
              {filtered.length}
            </span>{" "}
            faculty
          </p>

          {/* Speaker Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-6">
            {visibleSpeakers.map((speaker, i) => (
              <SpeakerCard key={speaker.id} speaker={speaker} index={i} />
            ))}
          </div>

          {/* Sentinel + loader */}
          <div ref={sentinelRef} className="pb-12">
            {hasMore && (
              <div className="flex justify-center py-6">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-b w-full py-12 px-4 md:px-8">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="text-center mb-10">
            <p className="text-muted-foreground mt-2">IN THEIR WORDS</p>
            <br />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              What our Faculty say
            </h2>
          </div>
          <TestimonialCarousel testimonials={speakerTestimonials} />
        </div>
      </section>

      <Footer />
    </div>
  );
};

function SpeakerCard({ speaker, index }: { speaker: Speaker; index: number }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
      className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group cursor-pointer"
      onClick={() => navigate(`/speakers/${speaker.id}`)}
    >
      <div className="p-5 space-y-3">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto overflow-hidden">
          {speaker.image ? (
            <img
              src={speaker.image}
              alt={speaker.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-7 h-7 text-muted-foreground" />
          )}
        </div>

        <div className="text-center">
          <h3 className="text-sm font-semibold text-foreground line-clamp-1">
            {speaker.name}
          </h3>
          {speaker.position && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <GraduationCap className="w-3 h-3 flex-shrink-0" />
              <span className="line-clamp-1">{speaker.position}</span>
            </p>
          )}
          {speaker.institution && (
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="line-clamp-1">{speaker.institution}</span>
            </p>
          )}
        </div>

        {/* Subspecialties */}
        <div className="flex flex-wrap justify-center gap-1">
          {speaker.subspecialties.slice(0, 2).map((sub) => (
            <span
              key={sub}
              className="text-[10px] font-medium bg-secondary/15 text-secondary px-2 py-0.5 rounded-full border border-secondary/20"
            >
              {sub}
            </span>
          ))}
          {speaker.subspecialties.length > 2 && (
            <span className="text-[10px] text-muted-foreground">
              +{speaker.subspecialties.length - 2}
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/speakers/${speaker.id}`);
          }}
          className="w-full mt-2 flex items-center justify-center gap-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground dark:bg-primary/30 dark:text-primary-foreground dark:hover:bg-primary/60 py-2 rounded-lg text-xs font-medium transition-colors"
        >
          <Play className="w-3 h-3" />
          View Lectures ({speaker.lectures.length})
        </button>
      </div>
    </motion.div>
  );
}

export default Speakers;

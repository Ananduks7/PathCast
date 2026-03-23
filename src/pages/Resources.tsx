import { useState, useMemo } from "react";
import {
  Search,
  ExternalLink,
  BookOpen,
  FileText,
  GraduationCap,
  Mic,
  Wrench,
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { resources } from "@/data/resources";

const CATEGORIES = [
  { key: "all", label: "All", icon: BookOpen },
  {
    key: "Professional Organizations",
    label: "Professional Organizations",
    icon: Mic,
  },
  { key: "Board Prep", label: "Board Prep", icon: GraduationCap },
  { key: "Academic Websites", label: "Academic Websites", icon: BookOpen },
  { key: "Key Guidelines", label: "Key Guidelines", icon: FileText },
  {
    key: "Digital Slide Libraries",
    label: "Digital Slide Libraries",
    icon: BookOpen,
  },
  {
    key: "AI & Digital Pathology Tools",
    label: "AI & Digital Pathology Tools",
    icon: Wrench,
  },
];

const Resources = () => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    let result = resources;
    if (activeCategory !== "all") {
      result = result.filter((r) => r.category === activeCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q),
      );
    }
    return result;
  }, [query, activeCategory]);

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
            className="text-sm font-medium tracking-widest uppercase text-[#7EECD8] mb-4"
          >
            pathCast Knowledge Hub
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
          >
            Resources
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/75 leading-relaxed max-w-2xl mx-auto"
          >
            A curated knowledge hub for pathology education — guidelines,
            research, tools, and more.
          </motion.p>
        </div>
      </section>

      <section className="section-a w-full">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 pb-12 pt-10">
          {/* Search */}
          <div className="relative mb-6 max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search resources..."
              className="w-full h-11 pl-10 pr-4 bg-card border border-border rounded-lg text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            ))}
          </div>

          {/* Resource Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((resource, i) => (
              <motion.a
                key={resource.id}
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.4) }}
                className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group block"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-medium bg-secondary/15 text-secondary px-2 py-0.5 rounded-full border border-secondary/20 uppercase">
                    {resource.category}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {resource.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {resource.description}
                </p>
              </motion.a>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">No resources found.</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Resources;

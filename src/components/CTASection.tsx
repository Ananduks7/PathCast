import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ctaBg from "@/assets/hero-1.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${ctaBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d2e2e] via-[#0d3535] to-[#0a2222]" />
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative z-10 text-center px-4 md:px-8 max-w-2xl mx-auto text-white"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to expand your knowledge?
        </h2>
        <p className="text-white/80 text-base md:text-lg mb-8 leading-relaxed">
          Join thousands of pathologists worldwide and get access to our
          complete library of lectures.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate("/search")}
            className="inline-flex items-center gap-2 bg-white text-[#013F51] font-semibold px-8 py-3 rounded-lg hover:bg-white/90 transition-colors"
          >
            <Play className="w-4 h-4" />
            Start Watching
          </button>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 border border-white/30 bg-transparent text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;

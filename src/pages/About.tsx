import { motion } from "framer-motion";
import {
  Globe,
  Users,
  Play,
  Eye,
  Clock,
  TrendingUp,
  DollarSign,
  ExternalLink,
  ChevronRight,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import storyBg from "@/assets/hero-2.jpg";
import globalBg from "@/assets/hero-3.jpg";
import TestimonialCarousel, {
  type Testimonial,
} from "@/components/TestimonialCarousel";
import sophieTestimonialImage from "@/assets/Testimonial-Image/Sophie Engelhardt.png";
import dreTestimonialImage from "@/assets/Testimonial-Image/Dre Barnachea.png";
import lisaTestimonialImage from "@/assets/Testimonial-Image/Lisa Centeno.png";
import vladyslavTestimonialImage from "@/assets/Testimonial-Image/Vladyslav Ilchenko.jpg";
import abdullahTestimonialImage from "@/assets/Testimonial-Image/Abdullah Alharbi.jpg";
import raulTestimonialImage from "@/assets/Testimonial-Image/Raul Gonzalez.jpg";
import rifatMannanImage from "@/assets/Testimonial-Image/Rifat Mannan.jpg";

import { useQuery } from "@tanstack/react-query";
import { getChannelStatistics } from "@/services/youtubeService";

type ChannelStats = {
  subscriberCount: number | null;
  videoCount: number | null;
};

const formatCount = (value: number | null) => {
  if (!value && value !== 0) return "—";
  if (value >= 1_000_000)
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  if (value >= 10_000)
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  return new Intl.NumberFormat("en-US").format(value);
};

const publications = [
  {
    title:
      "pathCast: An Interactive Medical Education Curriculum That Leverages Livestreaming on Facebook and YouTube.",
    authors: "Madrigal E, Mannan R.",
    journal: "Academic Pathology, 2020",
    doi: "10.1177/2374289520976393",
    link: "https://pubmed.ncbi.nlm.nih.gov/32345884/",
  },
  {
    title:
      "pathCast – Making Subspecialty Pathology Education Accessible Globally Through Leverage of Live-Streaming Technology.",
    authors: "Cima L, Mannan R, Madrigal E, et al.",
    journal: "Journal of Pathology Informatics, 2021",
    doi: "10.4103/jpi.jpi_17_21",
    link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8183345/",
  },
];

const mediaCoverage = [
  {
    title: "People of Pathology Podcast",
    description:
      "Featured episode discussing pathCast's global impact on pathology education.",
    link: "https://www.podbean.com/media/share/pb-gyiz5-de5412",
  },
  {
    title: "Live from The Johns Hopkins, Welcome to pathCast",
    description:
      "Coverage of pathCast as an innovative open-access learning platform.",
    link: "https://www.hopkinsmedicine.org/news/articles/2018/06/live-from-the-johns-hopkins-hospital-welcome-to-pathcast",
  },
  {
    title: "Casting a Training Lifeline - The Pathologist",
    description:
      "Feature story on democratizing pathology education through live-streaming.",
    link: "https://thepathologist.com/issues/2018/articles/jul/casting-a-training-lifeline/",
  },
];

const learningTools = [
  {
    name: "Learn Pathology, Harvard Medical School",
    description: "Faculty and speakers contributing to pathCast curriculum.",
    link: "https://learn.mghpathology.org/index.php/pathCast",
  },
  {
    name: "Johns Hopkins University",
    description: "Partner institution with recurring visiting lecturers.",
    link: "https://pathology.jhu.edu/education/clinician-training",
  },
];

const collaborations = [
  {
    title: "PBPATH - Pancreatobiliary Pathology Short Course",
    description:
      "A free 2-day online course on Pancreatobiliary pathology, in collaboration with Pancreatobiliary Pathology Society,  which was streamed live on FaceBook.com/PathCast and YouTube.com/pathCast.",
    link: "https://pbpath.org/pbps-pathcast-2022/",
    links: "#",
  },
  {
    title: "GIPS-pathCast eMasterClass (2025)",
    description:
      "A free live session on pathology of “Gastric Cancer”, with lectures by experts from around the world",
    link: "https://usgips.com/event/gips-pathcast-emasterclass/",
    links:
      "https://youtube.com/playlist?list=PL4GDLmrdXtfShKhWbF0MY3LYE05ShU3kv&si=ihOZo3oC9nV2uA51",
  },
  {
    title: "pathCast-LATAM series",
    description:
      "Dedicated lecture series for Latin American pathologists, delivered in Spanish and Portuguese.",
    link: "https://youtube.com/playlist?list=PL4GDLmrdXtfR_7iXAGafPJ2_eJYPzgy-k&si=gJTbm2zknhblmR6A",
    links: "#",
  },
  {
    title: "Multilingaul lectures on Milan System for Salivary Gland Cytology",
    description:
      "A multilingual lecture series to promote the Milan System for Reporting Salivary Gland Cytology",
    link: "https://youtube.com/playlist?list=PL4GDLmrdXtfT_xsGkbWyE7Cv15t8na3KN&si=IciWBZJifV_72D7M",
    links: "#",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const About = () => {
  const navigate = useNavigate();

  const channelStatsQuery = useQuery<ChannelStats>({
    queryKey: ["youtube", "channel", "statistics"],
    queryFn: getChannelStatistics,
    staleTime: 30 * 60 * 1000,
  });

  const subscriberCount = channelStatsQuery.data?.subscriberCount ?? null;
  const videoCount = channelStatsQuery.data?.videoCount ?? null;

  // Testimonials shown under Our Story
  const storyTestimonials: Testimonial[] = [
    {
      quote:
        "pathCast is my go-to resource when starting in a new team and learning the basics, but also whenever I want to have a deep dive on a specific topic. The sessions are incredibly giving, with experts from around the world, sharing their knowledge and contributing to learning and growing. pathCast is an invaluable resource for pathologists, and I couldn't recommend it more. As a tip, just subscribe to their channel on YouTube to never miss an episode!",
      authorName: "Sophie Engelhardt, MD",
      designation: "Pathology Resident",
      institution: "",
      authorImageSrc: sophieTestimonialImage,
      authorImageAlt: "Sophie Engelhardt, MD",
      country: "Denmark",
    },
    {
      quote:
        "As a pathology trainee, I’ve found pathCast to be an outstanding educational resource. The episodes cover a wide range of topics across pathology subspecialties and make complex concepts approachable and directly applicable to daily diagnostic work.",
      authorName: "Dre Barnachea, MD",
      designation: "Pathology Resident (PGY3)",
      institution: "University of California Irvine",
      authorImageSrc: dreTestimonialImage,
      authorImageAlt: "Dre Barnachea, MD",
      country: "USA",
    },
    {
      quote:
        "pathCast has become an invaluable resource for the pathology community, with over 300 organ system–based presentations across anatomical and clinical pathology at its core. Case-based discussions, WHO updates, digital pathology, and emerging AI keep the content current. What sets it apart is the clarity of diagnostic reasoning—complex topics are thoughtfully organized to support structured thinking in real-world practice.",
      authorName: "Lisa Centeno, MD",
      designation: "Trainee",
      institution: "University of Santo Tomas",
      authorImageSrc: lisaTestimonialImage,
      authorImageAlt: "Lisa Centeno, MD",
      country: "Philippines",
    },
  ];

  // Testimonials shown above Recognition
  const recognitionTestimonials: Testimonial[] = [
    {
      quote:
        "PathCast has become a vital resource for pathology in Ukraine. During ongoing war, attending international conferences is often impossible for many of us. PathCast bridges this gap by connecting us to the global medical community. Under Dr. Rifat Mannan’s leadership, it offers access to lectures from leading pathologists and WHO experts at no cost. Beyond teaching, it equips us with essential knowledge and skills to continue our work. We are deeply grateful for this open-access resource.",
      authorName: "Vladyslav Ilchenko, MD",
      designation: "Assistant Professor",
      institution: "Shupyk National Healthcare University of Ukraine",
      authorImageSrc: vladyslavTestimonialImage,
      authorImageAlt: "Vladyslav Ilchenko, MD",
      country: "Ukraine",
    },
    {
      quote:
        "As a consultant AP/GU pathologist and board examiner, I value platforms that provide clinically relevant education. PathCast stands out by integrating classification updates, new data, and real-world diagnostic decision-making. Its sessions go beyond summaries, addressing practical challenges where morphology, immunohistochemistry, and WHO frameworks intersect. The discussion on renal oncocytic neoplasms was balanced, evidence-based, and highly applicable.",
      authorName: "Abdullah Alharbi, MD",
      designation: "Consultant Pathologist",
      institution: "King Fahad Armed Forces Hospital",
      authorImageSrc: abdullahTestimonialImage,
      authorImageAlt: "Abdullah Alharbi, MD",
      country: "Saudi Arabia",
    },
    {
      quote:
        "pathCast has been an amazing way to interact with the pathology community. I've learned a lot from their lectures, and I've really enjoyed the opportunity to provide some lectures as well. Several people have come up to me and said they watched one of my pathCast talks, and it always leads to a great conversation. I am very glad that this resource remains available to pathologists worldwide.",
      authorName: "Raul Gonzalez, MD",
      designation: "Professor",
      institution: "Emory University School of Medicine",
      authorImageSrc: raulTestimonialImage,
      authorImageAlt: "Raul Gonzalez, MD",
      country: "USA",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── SECTION 1: HERO ─────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#0d2e2e] via-[#0d3535] to-[#0a2222] overflow-hidden min-h-[480px] flex flex-col justify-center">
        {/* subtle dot-grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center px-4 md:px-8 max-w-3xl mx-auto pt-36 pb-20"
        >
          <p className="text-sm font-medium tracking-widest uppercase text-[#7EECD8] mb-4">
            Open Access · Global · Expert-Led
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            About pathCast
          </h1>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10">
            pathCast (a portmanteau of <em>pathology</em> and <em>simulcast</em>
            ) is a global, open-access platform dedicated to bridging the
            knowledge gap in pathology through live, expert-led high quality
            lectures, accessible to anyone, anywhere.
          </p>
          <button
            onClick={() => navigate("/search")}
            className="inline-flex items-center gap-2 bg-white text-[#0d2e2e] font-semibold px-8 py-3 rounded-lg hover:bg-white/90 transition-colors"
          >
            <Play className="w-4 h-4" />
            Explore Lectures
          </button>
        </motion.div>
      </section>

      {/* ── SECTION 2: OUR STORY ────────────────────────────────────── */}
      <section className="section-a py-20 md:py-28 px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left: text */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
              Our Story
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
              Born out of a belief that pathology education should have no
              borders.
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Co-founded in 2016 at Mount Sinai West Hospital, New York, by{" "}
                <strong className="text-foreground">Dr. Rifat Mannan</strong>{" "}
                and{" "}
                <strong className="text-foreground">Dr. Emilio Madrigal</strong>{" "}
                as a resident-led initiative, pathCast was built on a simple
                belief: pathology education should be collaborative, inclusive,
                and free from geographic boundaries.
              </p>
              <p>
                Currently maintained and directed by Dr. Rifat Mannan, pathCast
                has grown into a vibrant academic community, hosting hundreds of
                live lectures across multiple subspecialties, delivered by
                renowned experts from around the world.
              </p>
              <p>
                Each session runs typically one hour, streamed live and made
                freely available for on-demand viewing, ensuring continued
                access for learners across all time zones.
              </p>
              <p>
                Topics range from diagnostically challenging cases to evolving
                disease classifications.
              </p>
              <p className="text-foreground font-medium italic border-l-2 border-primary pl-4 mt-6">
                Wherever you are, the lecture hall is open.
              </p>
            </div>
          </motion.div>

          {/* Right: image */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]"
          >
            <img
              src={storyBg}
              alt="pathCast live lecture"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Testimonials — under Our Story */}
      <section className="section-b py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-2">
              Testimonials
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              What Our Community Says
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Hear from pathologists and educators around the world.
            </p>
          </motion.div>
          <TestimonialCarousel testimonials={storyTestimonials} />
        </div>
      </section>

      {/* ── LEADERSHIP ─────────────────────────────────────────────── */}
      <section className="section-a py-20 md:py-24 px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
              Leadership
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              The mind behind the mission.
            </h2>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-10 md:gap-16 items-start"
          >
            {/* Headshot */}
            <div className="shrink-0 w-48 md:w-56">
              <div className="rounded-2xl overflow-hidden aspect-square shadow-lg">
                <img
                  src={rifatMannanImage}
                  alt="Rifat Mannan, MD"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="flex-1">
              <a
                href="https://www.cityofhope.org/patients/find-a-doctor/rifat-mannan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-2xl md:text-3xl font-bold text-foreground hover:text-primary transition-colors group"
              >
                Rifat Mannan, MD
                <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity shrink-0" />
              </a>
              <p className="mt-1 text-primary font-medium text-sm">
                Founder &amp; Academic Lead, pathCast
              </p>
              <p className="text-muted-foreground text-sm mt-0.5">
                Associate Clinical Professor of Pathology
              </p>
              <p className="text-muted-foreground text-sm">
                City of Hope, Duarte, California
              </p>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                Dr. Mannan leads the academic vision, educational programming,
                and global collaborations for pathCast. He oversees content
                curation, speaker engagement, and the platform&apos;s continued
                development.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 3: IMPACT / GLOBAL COMMUNITY ───────────────────── */}
      <section className="section-b py-20 md:py-28 px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-12 md:gap-16 items-center">
          {/* Left: stats */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
              Impact
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 leading-tight">
              Global Community
            </h2>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              Our reach continues to expand across continents, connecting
              pathologists worldwide.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Globe, value: "170+", label: "Countries Reached" },
                {
                  icon: Play,
                  value: `${formatCount(videoCount)}+`,
                  label: "Total Lectures",
                },
                {
                  icon: Users,
                  value: "81.4K+",
                  label: "Followers Worldwide",
                },
              ].map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="bg-card border border-border rounded-xl p-5 shadow-sm"
                >
                  <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center mb-4">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground leading-none">
                    {value}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Social media links */}
            <div className="mt-8 pt-7 border-t border-border">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Follow us
              </p>
              <div className="grid grid-cols-4 gap-3">
                {[
                  {
                    label: "X / Twitter",
                    count: "11,300",
                    unit: "followers",
                    href: "https://x.com/pathcast",
                    bg: "bg-black",
                    icon: (
                      <svg
                        viewBox="0 0 24 24"
                        className="w-4 h-4 fill-white"
                        aria-hidden="true"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.258 5.627ZM17.08 19.77h1.833L7.084 4.126H5.117Z" />
                      </svg>
                    ),
                  },
                  {
                    label: "YouTube",
                    count: "43,600",
                    unit: "subscribers",
                    href: "https://www.youtube.com/@pathcast",
                    bg: "bg-[#FF0000]",
                    icon: (
                      <svg
                        viewBox="0 0 24 24"
                        className="w-4 h-4 fill-white"
                        aria-hidden="true"
                      >
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    ),
                  },
                  {
                    label: "Facebook",
                    count: "24,000",
                    unit: "followers",
                    href: "https://www.facebook.com/pathcast",
                    bg: "bg-[#1877F2]",
                    icon: (
                      <svg
                        viewBox="0 0 24 24"
                        className="w-4 h-4 fill-white"
                        aria-hidden="true"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    ),
                  },
                  {
                    label: "Instagram",
                    count: "2,500",
                    unit: "followers",
                    href: "https://www.instagram.com/pathcast",
                    bg: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]",
                    icon: (
                      <svg
                        viewBox="0 0 24 24"
                        className="w-4 h-4 fill-white"
                        aria-hidden="true"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                      </svg>
                    ),
                  },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 hover:border-primary/30 hover:shadow-sm transition-all group"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg ${social.bg} flex items-center justify-center shrink-0`}
                    >
                      {social.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground leading-none">
                        {social.count}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {social.unit}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: world-map visual */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]"
          >
            <img
              src={globalBg}
              alt="Global reach"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 4: YOUTUBE ANALYTICS ───────────────────────────── */}
      <section className="section-a py-20 md:py-24 px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-2">
              YouTube Analytics
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Our Channel by the Numbers
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Eye,
                label: "Total Views",
                value: "3.5M+",
                sub: "All-time video views",
              },
              {
                icon: Clock,
                label: "Watch Time",
                value: "1.2M hrs",
                sub: "Hours of pathology content watched",
              },
              {
                icon: TrendingUp,
                label: "Subscribers",
                value: `${formatCount(subscriberCount)}+`,
                sub: "Active YouTube subscribers",
              },
              {
                icon: DollarSign,
                label: "Free Forever",
                value: "100%",
                sub: "No paywalls. Always open-access.",
              },
            ].map(({ icon: Icon, label, value, sub }, i) => (
              <motion.div
                key={label}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  {label}
                </p>
                <p className="text-3xl font-bold text-foreground leading-none">
                  {value}
                </p>
                <p className="text-xs text-muted-foreground mt-2 leading-snug">
                  {sub}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials — above Recognition */}
      <section className="section-b py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-2">
              Testimonials
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              What Our Community Says
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Hear from pathologists and educators around the world.
            </p>
          </motion.div>
          <TestimonialCarousel testimonials={recognitionTestimonials} />
        </div>
      </section>

      {/* ── SECTION 5: RECOGNITION ─────────────────────────────────── */}
      <section className="section-a py-20 md:py-24 px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-2">
              Recognition
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Publications & Media Coverage
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Publications */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> Publications
              </h3>
              <div className="space-y-4">
                {publications.map((pub) => (
                  <motion.div
                    key={pub.doi}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors shadow-sm"
                  >
                    <p className="text-sm font-medium text-foreground leading-snug mb-2">
                      {pub.title}
                    </p>
                    <p className="text-xs text-muted-foreground mb-1">
                      {pub.authors}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3 italic">
                      {pub.journal}
                    </p>
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                    >
                      DOI: {pub.doi}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Media Coverage */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> Media Coverage
              </h3>
              <div className="space-y-4">
                {mediaCoverage.map((item) => (
                  <motion.a
                    key={item.title}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="flex items-start justify-between gap-4 bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors shadow-sm group"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: LEARNING TOOL ────────────────────────────────── */}
      <section className="section-b py-20 md:py-24 px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-2">
              Trusted Partner
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              pathCast as a Learning Tool
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Leading institutions integrate pathCast into their educational
              programmes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {learningTools.map((tool, i) => (
              <motion.a
                key={tool.name}
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors shadow-sm group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {tool.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {tool.description}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0 group-hover:text-primary transition-colors" />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: COLLABORATIONS ───────────────────────────────── */}
      <section className="section-a py-20 md:py-24 px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-2">
              Collaborations
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Partners & Series
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Formal collaborations that extend pathCast's reach and breadth of
              content.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {collaborations.map((collab, i) => (
              <motion.a
                key={collab.title}
                href={collab.link}
                target={collab.link !== "#" ? "_blank" : undefined}
                rel="noopener noreferrer"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col bg-card border border-border rounded-xl p-6 hover:border-primary/40 hover:shadow-md transition-all group"
              >
                <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  {collab.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                  {collab.description}
                </p>
                {collab.link !== "#" && (
                  <span className="mt-4 inline-flex items-center gap-1 text-xs text-primary font-medium">
                    Learn more <ExternalLink className="w-3 h-3" />
                  </span>
                )}
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 8: CTA ──────────────────────────────────────────── */}
      <CTASection />

      <Footer />
    </div>
  );
};

export default About;

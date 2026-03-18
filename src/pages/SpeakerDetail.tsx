import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  User,
  MapPin,
  GraduationCap,
  Play,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoPlayerModal from "@/components/VideoPlayerModal";
import { speakers } from "@/data/speakers";
import type { Lecture } from "@/data/lectures";

const SpeakerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const speaker = speakers.find((s) => s.id === id);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [playerOpen, setPlayerOpen] = useState(false);

  if (!speaker) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 text-center">
          <p className="text-muted-foreground">Speaker not found.</p>
          <button
            onClick={() => navigate("/speakers")}
            className="text-primary text-sm mt-2 hover:underline"
          >
            Back to Speakers
          </button>
        </div>
      </div>
    );
  }

  const playLecture = (lec: (typeof speaker.lectures)[0]) => {
    setSelectedLecture({
      id: lec.youtubeId,
      title: lec.title,
      speaker: speaker.name,
      specialty: lec.subspecialty,
      duration: "",
      thumbnail: `https://img.youtube.com/vi/${lec.youtubeId}/hqdefault.jpg`,
      description: "",
      youtubeId: lec.youtubeId,
    });
    setPlayerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="section-a w-full">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 pt-24 pb-12">
        <button
          onClick={() => navigate("/speakers")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Speakers
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-6 mb-10"
        >
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mx-auto md:mx-0 overflow-hidden">
            {speaker.image ? (
              <img
                src={speaker.image}
                alt={speaker.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-muted-foreground" />
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-foreground">
              {speaker.name}
            </h1>
            {speaker.position && (
              <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center md:justify-start gap-1.5">
                <GraduationCap className="w-4 h-4" /> {speaker.position}
              </p>
            )}
            {speaker.institution && (
              <p className="text-sm text-muted-foreground mt-0.5 flex items-center justify-center md:justify-start gap-1.5">
                <MapPin className="w-4 h-4" /> {speaker.institution}
              </p>
            )}
            <div className="flex flex-wrap justify-center md:justify-start gap-1.5 mt-3">
              {speaker.subspecialties.map((sub) => (
                <span
                  key={sub}
                  className="text-xs font-medium bg-secondary/15 text-secondary px-2.5 py-1 rounded-full border border-secondary/20"
                >
                  {sub}
                </span>
              ))}
            </div>
            {speaker.profileLink && (
              <a
                href={speaker.profileLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-3"
              >
                View Profile <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </motion.div>

        <h2 className="text-lg font-semibold text-foreground mb-4">
          Lectures ({speaker.lectures.length})
        </h2>
        <div className="space-y-3">
          {speaker.lectures.map((lec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 bg-card border border-border rounded-lg p-4 hover:border-primary/40 transition-colors cursor-pointer group"
              onClick={() => playLecture(lec)}
            >
              <div className="relative w-32 md:w-40 flex-shrink-0 aspect-video rounded overflow-hidden bg-muted">
                {lec.youtubeId && (
                  <img
                    src={`https://img.youtube.com/vi/${lec.youtubeId}/mqdefault.jpg`}
                    alt={lec.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-background/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-6 h-6 text-primary-foreground fill-current" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground line-clamp-2">
                  {lec.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">{lec.date}</p>
                <span className="inline-block mt-2 text-[10px] font-medium bg-secondary/15 text-secondary px-2 py-0.5 rounded-full border border-secondary/20">
                  {lec.subspecialty}
                </span>
                {lec.hostInstitute && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {lec.hostInstitute}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      </section>
      <Footer />
      <VideoPlayerModal
        lecture={selectedLecture}
        open={playerOpen}
        onOpenChange={setPlayerOpen}
      />
    </div>
  );
};

export default SpeakerDetail;

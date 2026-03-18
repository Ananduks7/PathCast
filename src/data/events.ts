export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "live" | "upcoming" | "past";
  format: "webinar" | "conference" | "lecture" | "workshop";
  location: string;
  description: string;
  link?: string;
  speaker?: string;
  specialty?: string;
}

export const events: Event[] = [
  {
    id: "1",
    title: "Hematopathology Update 2026",
    date: "March 20, 2026",
    time: "12:00 PM EST",
    type: "upcoming",
    format: "webinar",
    location: "Live Stream",
    description:
      "A comprehensive update on recent advances in hematopathology, including new WHO classifications and diagnostic challenges.",
    speaker: "Dr. Robert Hasserjian",
    specialty: "Hematopathology",
    link: "https://pathcast.net",
  },
  {
    id: "2",
    title: "Breast Pathology Case Conference",
    date: "March 27, 2026",
    time: "1:00 PM EST",
    type: "upcoming",
    format: "lecture",
    location: "Live Stream",
    description:
      "Interactive case-based seminar covering challenging diagnoses in breast pathology, with audience participation.",
    speaker: "Dr. Stuart Schnitt",
    specialty: "Breast Pathology",
    link: "https://pathcast.net",
  },
  {
    id: "3",
    title: "Neuropathology for the General Pathologist",
    date: "April 3, 2026",
    time: "12:00 PM EST",
    type: "upcoming",
    format: "webinar",
    location: "Live Stream",
    description:
      "Practical approach to common neuropathology specimens encountered in general surgical pathology practice.",
    speaker: "Dr. Arie Perry",
    specialty: "Neuropathology",
    link: "https://pathcast.net",
  },
  {
    id: "4",
    title: "Dermatopathology Workshop",
    date: "April 10, 2026",
    time: "2:00 PM EST",
    type: "upcoming",
    format: "workshop",
    location: "Live Stream",
    description:
      "Hands-on workshop focusing on inflammatory dermatoses and melanocytic lesions with pattern-based approach.",
    speaker: "Dr. Zsolt Argenyi",
    specialty: "Dermatopathology",
    link: "https://pathcast.net",
  },
  {
    id: "5",
    title: "GI Pathology Series: Part 3",
    date: "February 28, 2026",
    time: "12:00 PM EST",
    type: "past",
    format: "lecture",
    location: "Live Stream",
    description:
      "Third installment of the GI pathology series covering colorectal polyps, dysplasia grading, and IBD.",
    speaker: "Dr. Robert Odze",
    specialty: "Gastrointestinal Pathology",
  },
  {
    id: "6",
    title: "Soft Tissue Tumor Updates",
    date: "February 14, 2026",
    time: "1:00 PM EST",
    type: "past",
    format: "webinar",
    location: "Live Stream",
    description:
      "Review of recent molecular advances in soft tissue tumor classification and their diagnostic implications.",
    speaker: "Dr. Cyril Fisher",
    specialty: "Soft Tissue Pathology",
  },
];

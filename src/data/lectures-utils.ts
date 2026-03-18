import type { Lecture } from "./lectures";

export const dedupeLectures = (lectures: Lecture[]) =>
  Array.from(
    new Map(lectures.map((lecture) => [lecture.id, lecture])).values(),
  );

export const getAllSpecialties = (lectures: Lecture[]) =>
  Array.from(new Set(lectures.map((lecture) => lecture.specialty))).sort();

export const getAllSpeakers = (lectures: Lecture[]) =>
  Array.from(new Set(lectures.map((lecture) => lecture.speaker))).sort();

// Parse duration to minutes for filtering
export function parseDuration(d: string): number {
  if (d === "LIVE") return 0;
  const hMatch = d.match(/(\d+)h/);
  const mMatch = d.match(/(\d+)m/);
  return (
    (hMatch ? parseInt(hMatch[1]) * 60 : 0) + (mMatch ? parseInt(mMatch[1]) : 0)
  );
}

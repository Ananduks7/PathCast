export interface Lecture {
  id: string;
  title: string;
  speaker: string;
  specialty: string;
  duration: string;
  thumbnail: string;
  description: string;
  isLive?: boolean;
  youtubeId?: string;
  publishedAt?: string;
  viewCount?: number;
}

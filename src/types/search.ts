import type { Lecture } from "@/data/lectures";

export type SearchItemType =
  | "page"
  | "lecture"
  | "speaker"
  | "resource"
  | "event";

export type SearchItem =
  | {
      type: "page";
      id: string;
      title: string;
      subtitle?: string;
      href: string;
    }
  | {
      type: "speaker";
      id: string;
      title: string;
      subtitle?: string;
      href: string;
    }
  | {
      type: "event";
      id: string;
      title: string;
      subtitle?: string;
      href: string;
    }
  | {
      type: "resource";
      id: string;
      title: string;
      subtitle?: string;
      href: string;
      external: true;
    }
  | {
      type: "lecture";
      id: string;
      title: string;
      subtitle?: string;
      lecture: Lecture;
    };

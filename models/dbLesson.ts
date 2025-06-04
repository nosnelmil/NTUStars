import type { Day } from "~/types/day";

export interface DBLesson {
  day: Day;
  group: string;
  time: number[];
  type: string;
  venue: string;
  weeks: number[];
}
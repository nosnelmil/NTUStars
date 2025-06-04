import type { DBLesson } from "./dbLesson";

// schedule is an object with a variable number of keys each key is a number mapped to a index
export interface DBSchedule {
  [indexNumber: number]: {
    lessons: DBLesson[];
  };
  updatedAt: string;
}
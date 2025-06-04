import type { ParsedLesson } from "./parsedLesson";

export interface ParsedCourse {
  lectures: ParsedLesson[];
  lessons: {
    [index: string]: ParsedLesson[];
  }
  courseName: string;
  courseCode: string;
  au: string;
  description?: string;
}
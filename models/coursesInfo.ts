import type { ParsedCourse } from "./parsedCourse";

export interface CoursesInfo {
  [semester: string]: {
    [courseCode: string]: ParsedCourse;
  }
}
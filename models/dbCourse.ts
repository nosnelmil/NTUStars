import type { DBSchedule } from "./dbSchedule";

export interface DBCourse {
  id: string;
  au: string;
  courseCode: string;
  courseName: string;
  description: string;
  schedule: DBSchedule;
  gradeType: string;
  mutexWith: string[];
  notAvailTo: string[];
  notAvailWith: string[];
  preRequisites: string;
  programme: string;
  remarks: string;
}

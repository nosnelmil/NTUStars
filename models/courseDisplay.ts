import type { ParsedLesson } from "./parsedLesson";

export interface CourseDisplay extends ParsedLesson {
  editable: boolean;
  classNames: string[];
  isPreview: boolean;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  isLoading?: boolean;
  isCustom?: boolean; // for custom events
}
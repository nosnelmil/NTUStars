export function validateCourseCode(courseCode: string): boolean {
  return courseCode != null && courseCode.length == 6
};

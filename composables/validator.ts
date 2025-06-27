export function validateCourseCode(courseCode: string): boolean {
  return (courseCode.length == 6 && /^[a-zA-Z]{2}(?=(?:.*\d){2,})[a-zA-Z0-9]{4}$/.test(courseCode));
};

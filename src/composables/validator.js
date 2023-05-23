export function validateCourseCode(courseCode) {
  const regex = /^[a-zA-Z]{2}\d{4}$/;
  return regex.test(courseCode);
};

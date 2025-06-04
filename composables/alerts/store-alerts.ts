
export function codeDoesNotExist(courseCode: string, semester: string): void {
  console.warn(`Course code ${courseCode} does not exist for semester ${semester}`)
  // Notify.create({
  //   message: `${courseCode} does not exist for sem ${semester}`,
  //   color: 'negative'
  // })
}

export function errorFetchingSchedule(courseCode: string, semester: string, error: string): void {
  console.error(`Error fetching schedule for ${courseCode} in semester ${semester}:`, error)
  // Notify.create({
  //   message: `Failed to fetch ${courseCode} for sem ${semester}: ${error} `,
  //   color: 'negative'
  // })
}
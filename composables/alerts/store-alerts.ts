import { Notify } from "quasar"

export function codeDoesNotExist(courseCode: string, semester: string): void {
  Notify.create({
    message: `${courseCode} does not exist for sem ${semester}`,
    color: 'negative'
  })
}

export function errorFetchingSchedule(courseCode: string, semester: string, error: string): void {
  Notify.create({
    message: `Failed to fetch ${courseCode} for sem ${semester}: ${error} `,
    color: 'negative'
  })
}
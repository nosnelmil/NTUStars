import { Notify } from "quasar"

export function codeDoesNotExist(courseCode: string, semester: string): void {
  Notify.create({
    message: `${courseCode} does not exist for sem ${semester}`,
    color: 'negative'
  })
}

export function errorFetchingSchedule(courseCode: string, semester: string): void {
  Notify.create({
    message: `Unable to load ${courseCode} for sem ${semester}. Please try again. Error Code: 1001 `,
    color: 'negative'
  })
}
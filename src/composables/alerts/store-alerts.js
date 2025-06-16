import { Notify } from 'quasar';

export function codeDoesNotExist(courseCode, semester){
  Notify.create({
    message: `${courseCode} does not exist for sem ${semester}`,
    color: 'negative'
  })
}

export function errorFetchingSchedule(courseCode, semester, error){
  Notify.create({
    message: `Failed to fetch ${courseCode} for sem ${semester}: ${error} `,
    color: 'negative'
  })
}
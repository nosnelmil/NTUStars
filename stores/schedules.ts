import { defineStore } from 'pinia'
import { parseCourseInfoFromDB } from '../composables/parsers';
import { codeDoesNotExist, errorFetchingSchedule } from '../composables/alerts/store-alerts';
import type { DBCourse } from '~/models/dbCourse';
import type { CoursesInfo } from '~/models/coursesInfo';


interface ScheduleState {
  coursesInfo: CoursesInfo;
  isLoading: boolean;
  semesters: Record<string, string>;
}

export const useSchedules = defineStore('schedules', {
  state: (): ScheduleState => {
    return {
      coursesInfo: {},
      isLoading: false,
      semesters: {}
    }
  },
  getters: {
    getSchedule: (state) => {
      return (semester: string, courseCode: string) => {
        return state.coursesInfo[semester]?.[courseCode] || null;
      }
    },
    getSemesters: (state) => Object.entries(state.semesters)
      .map(([key, value]) => { return ({ label: value, value: key }) })
      .sort((a, b) => b.label.localeCompare(a.label))
  },
  actions: {
    async fetchCourseSchedule(semester: string, code: string) {
      const courseCode = code.toUpperCase();
      const courseInfo = this.getSchedule(semester, courseCode)
      if (courseInfo) {
        return courseInfo
      } else {
        // get from database
        const reqBody = JSON.stringify({
          "semester": semester,
          "courseCode": courseCode
        })
        try {
          const response = await fetch(
            useRuntimeConfig().public.getscheduleEndpoint,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: reqBody
            })
          const data = (await response.json()) as DBCourse
          if (data) {
            const parsedCourseInfo = parseCourseInfoFromDB(data)
            if (!(semester in this.coursesInfo)) {
              this.coursesInfo[semester] = {}
            }
            this.coursesInfo[semester][courseCode] = parsedCourseInfo
            return parsedCourseInfo
          } else {
            codeDoesNotExist(courseCode, semester)
          }
        } catch (e) {
          errorFetchingSchedule(courseCode, semester, String(e))
        }

      }
    },
    async fetchSemesters() {
      // get from database
      try {
        const response = await fetch(
          useRuntimeConfig().public.getsemesterEndpoint,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          })
        const data = await response.json()
        if (data) {
          this.semesters = data.semesters
        } else {
          // Notify.create({ message: `Failed to retrieve semesters`, color: 'negative' })
          console.warn("Failed to retrieve semesters")
        }
      } catch (e) {
        // Notify.create({ message: `Error retrieving semesters: ${e}`, color: 'negative'})
        console.error("Error retrieving semesters:", e)
      }
    },

    async fecthCourseSpecificDetails(sem: string, code: string) {
      const semester = sem.toUpperCase();
      const courseCode = code.toUpperCase();
      const courseInfo = this.getSchedule(semester, courseCode)
      if (courseInfo && 'description' in courseInfo) {
        return courseInfo
      } else {
        // get from database
        const reqBody = JSON.stringify({
          "semester": semester,
          "courseCode": courseCode
        })
        try {
          const response = await fetch(
            useRuntimeConfig().public.getcoursecontentEndpoint,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: reqBody
            })
          const data = await response.json()
          if (data) {
            return data
          } else {
            codeDoesNotExist(courseCode, semester)
            return null
          }
        } catch (e) {
          errorFetchingSchedule(courseCode, semester, String(e))
          return null
        }
      }
    },
  },
  persist: true
})

// {
//   afterRestore: (ctx) => {
//     console.log('about to restore,' , ctx.store.$reset()) // to reset persisted state (dev used only)
//     // ctx.store.preview = {}
//   }
// }


import { defineStore } from 'pinia'
import { parseCourseInfoFromDB } from '../composables/parsers';
import { codeDoesNotExist, errorFetchingSchedule } from '../composables/alerts/store-alerts';
import type { DBCourse } from '~/models/dbCourse';
import type { CoursesInfo } from '~/models/coursesInfo';
import { Notify } from 'quasar';


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
      .sort((a, b) => b.label.localeCompare(a.label)),

    getParsedCourseInfo: (state) => {
      return (semester: string, courseCode: string, index: string) => {
        const parsedCourse = state.coursesInfo[semester]?.[courseCode];
        console.log("getParsedCourseInfo", semester, courseCode, index, parsedCourse)
        if (parsedCourse && 'lessons' in parsedCourse) {
          return parsedCourse.lessons[index] || null;
        }
        return null;
      }
    }
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
          console.error("Error fetching schedule:", e)
          errorFetchingSchedule(courseCode, semester)
        }
      }
    },
    async fetchSemesters() {
      // get from database
      console.info("Fetching semesters from database at endpoint:", useRuntimeConfig().public.getsemestersEndpoint)
      try {
        const response = await fetch(
          useRuntimeConfig().public.getsemestersEndpoint,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          })
        const data = await response.json()
        if (data) {
          this.semesters = data.semesters
        } else {
          Notify.create({ message: `Failed to retrieve semesters`, color: 'negative' })
        }
      } catch (e) {
        Notify.create({ message: `Failed to retrieve semesters`, color: 'negative' })
        console.error("Error fetching semesters:", e)
      }
    },

    async fetchCourseIndexes(semester: string, courseCode: string) {
      let parsedCourse = this.getSchedule(semester, courseCode);
      console.log("fetchCourseIndexes", semester, courseCode, parsedCourse)
      if (!parsedCourse) {
        await this.fetchCourseSchedule(semester, courseCode);
        parsedCourse = this.getSchedule(semester, courseCode);
      }
      if (parsedCourse && 'lessons' in parsedCourse) {
        return Array.from(Object.keys(parsedCourse.lessons)).sort((a, b) => a.localeCompare(b))
      }
      return [];
    },

    async fetchCourseSpecificDetails(sem: string, code: string) {
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
          errorFetchingSchedule(courseCode, semester)
          console.error("Error fetching course details:", e)
          return null
        }
      }
    },
  },
  persist: true
})

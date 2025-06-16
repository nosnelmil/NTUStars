import { defineStore } from 'pinia'
import { Notify } from 'quasar';
import { parseCourseInfoFromDB } from '../composables/parsers';
import { codeDoesNotExist, errorFetchingSchedule } from '../composables/alerts/store-alerts';

export const useSchedules = defineStore('schedules', {
  state: () => {
    return {
      coursesInfo: {},
      isLoading: false,
      semesters: {}
    }
  },
  getters: {
    getSchedule: (state) => {
      return (semester, courseCode) => {
        if(semester in state.coursesInfo 
            && courseCode in state.coursesInfo[semester] ){
              return state.coursesInfo[semester][courseCode]
        }
        return null
      }
    },
    getSemesters: (state) => Object.entries(state.semesters)
                                .map(([key,value]) => { return ({label: value, value: key})})
                                .sort((a, b) => b.label.localeCompare(a.label))
    
  },
  actions: {
    async fetchCourseSchedule(semester, code){
      const courseCode = code.toUpperCase();
      let courseInfo = this.getSchedule(semester, courseCode)
      if(courseInfo){
        return courseInfo
      }else{
        // get from database
        const reqBody = JSON.stringify({
          "semester":semester,
          "courseCode": courseCode
        })
        try{
          const response = await fetch(
            import.meta.env.VITE_GETSCHEDULE_ENDPOINT,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: reqBody
            })
          const data = await response.json()
          if(data){
            const parsedCourseInfo = parseCourseInfoFromDB(data)
            if(!(semester in this.coursesInfo)){
              this.coursesInfo[semester] = {}
            }
            this.coursesInfo[semester][courseCode] = parsedCourseInfo
            return parsedCourseInfo
          }else{
            codeDoesNotExist(courseCode, semester)
          }
        }catch(e){
          errorFetchingSchedule(courseCode, semester, e)
        }

      }
    },
    async fetchSemesters(){
      // get from database
      if(Object.keys(this.semesters) >0) return
      try{
        const response = await fetch(
          import.meta.env.VITE_GETSEMESTERS_ENDPOINT,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          })
        const data = await response.json()
        if(data){
          this.semesters = data.semesters
        }else{
          Notify.create({ message: `Failed to retrieve semesters`, color: 'negative' })
        }
      }catch(e){
        Notify.create({ message: `Error retrieving semesters: ${e}`, color: 'negative'})
      }
    },
    // coursesInfo: {
    //   sem: {
    //     <courseCode>: {
    //       <index>:[{},{},{}]
    //       lectures:[{},{},{}]
    //     }
    //   }
    // },

    async fecthCourseSpecificDetails(sem, code){
      const semester = sem.toUpperCase();
      const courseCode = code.toUpperCase();
      let courseInfo = this.getSchedule(semester, courseCode)
      if(courseInfo && 'description' in courseInfo){
        console.log("called")
        return courseInfo
      }else{
        // get from database
        const reqBody = JSON.stringify({
          "semester": semester,
          "courseCode": courseCode
        })
        try{
          const response = await fetch(
            import.meta.env.VITE_GETCOURSECONTENT_ENDPOINT,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: reqBody
            })
          const data = await response.json()
          console.log("called1", data)
          if(data){
            return data
          }else{
            codeDoesNotExist(courseCode, semester)
            return null
          }
        }catch(e){
          errorFetchingSchedule(courseCode, semester, e)
          return null
        }
      }
    },
  },
  persist: true,
  // {
  //   afterRestore: (ctx) => {
  //     console.log('about to restore,' , ctx.store.$reset()) // to reset persisted state (dev used only)
  //     // ctx.store.preview = {}
  //   }
  // }
})



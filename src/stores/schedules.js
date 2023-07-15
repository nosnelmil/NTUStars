import { defineStore } from 'pinia'
import { Notify } from 'quasar';
import { parseCourseInfoFromDB } from '../composables/parsers';
import { codeDoesNotExist } from '../composables/alerts/store-alerts';
function firebaseEndpoint(functionName){
  // return `https://${functionName}-prm4upiq5q-de.a.run.app`
  return `http://127.0.0.1:5001/ntu-schedule-maker/asia-east1/${functionName}` // dev endpoint
}


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
            firebaseEndpoint("getschedule"),
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
          codeDoesNotExist(courseCode, semester, e)
        }

      }
    },
    async fetchSemesters(){
      // get from database
      if(Object.keys(this.semesters) >0) return
      try{
        const response = await fetch(
          firebaseEndpoint("getsemesters"),
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
      if(courseInfo && semester in courseInfo){
        return courseInfo
      }else{
        // get from database
        const reqBody = JSON.stringify({
          "semester": semester,
          "courseCode": courseCode
        })
        try{
          const response = await fetch(
            firebaseEndpoint("getcoursecontent"),
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: reqBody
            })
          const data = await response.json()
          if(data){
            return data
          }else{
            // error
            Notify.create({
              message: `${courseCode} does not exist for sem ${semester}`,
              color: 'negative'
            })
            return null
          }
        }catch(e){
          Notify.create({
            message: `${courseCode} does not exist for sem ${semester}`,
            color: 'negative'
          })
          return null
        }
      }
    },
  },
  persist: false,
  // {
  //   afterRestore: (ctx) => {
  //     console.log('about to restore,' , ctx.store.$reset()) // to reset persisted state (dev used only)
  //     // ctx.store.preview = {}
  //   }
  // }
})



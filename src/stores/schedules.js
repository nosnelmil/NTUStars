import { defineStore } from 'pinia'
import { Notify } from 'quasar';
function firebaseEndpoint(functionName){
  // return `https://${functionName}-prm4upiq5q-de.a.run.app`
  return `http://127.0.0.1:5001/ntu-schedule-maker/asia-east1/${functionName}` // dev endpoint
}
const Day = {
	"MON": "1",
	"TUE": "2",
	"WED": "3",
	"THU": "4",
  "FRI": "5",
  "SAT": "6",
}
const timeDict = {
   0 : "T08:00:00",
   1 : "T08:30:00",
   2 : "T09:00:00",
   3 : "T09:30:00",
   4 : "T10:00:00",
   5 : "T10:30:00",
   6 : "T11:00:00",
   7 : "T11:30:00",
   8 : "T12:00:00",
   9 : "T12:30:00",
   10 : "T13:00:00",
   11 : "T13:30:00",
   12 : "T14:00:00",
   13 : "T14:30:00",
   14 : "T15:00:00",
   15 : "T15:30:00",
   16 : "T16:00:00",
   17 : "T16:30:00",
   18 : "T17:00:00",
   19 : "T17:30:00",
   20 : "T18:00:00",
   21 : "T18:30:00",
   22 : "T19:00:00",
   23 : "T19:30:00",
   24 : "T20:00:00",
   25 : "T20:30:00",
   26 : "T21:00:00",
   27 : "T21:30:00",
   28 : "T22:00:00",
   29 : "T22:30:00",
   30 : "T23:00:00",
   31 : "T23:30:00",
};

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
    getSemesters: (state) => Object.entries(state.semesters).map(([key,value]) => { return ({label: value, value: key})})
    
  },
  actions: {
    async fetchCourseSchedule(semester, code){
      const courseCode = code.toUpperCase();
      let courseInfo = this.getSchedule(semester, courseCode)
      if(courseInfo && semester in courseInfo){
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
            const parsedCourseInfo = this.parseCourseInfoFromDB(data)
            if(!(semester in this.coursesInfo)){
              this.coursesInfo[semester] = {}
            }
            this.coursesInfo[semester][courseCode] = parsedCourseInfo
            return parsedCourseInfo
          }else{
            // error
            Notify.create({
              message: `${courseCode} does not exist for sem ${semester}`,
              color: 'negative'
            })
          }
        }catch(e){
          Notify.create({
            message: `${courseCode} does not exist for sem ${semester}`,
            color: 'negative'
          })
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
          // error
          Notify.create({
            message: `Failed to retrieve semesters`,
            color: 'negative'
          })
        }
      }catch(e){
        Notify.create({
          message: `Error retrieving semesters`,
          color: 'negative'
        })
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

    // Helper Functions
    // parse schedule to timetable format
    parseCourseInfoFromDB(data){
      const {schedule, courseName, courseCode, au} = data
      var result = {
        lectures: [],
        lessons: {},
        courseName: courseName,
        courseCode: courseCode,
        au: au
      }
      var lectureAdded = false
      for(const [index, indexSchedule] of Object.entries(schedule)){
        result[index] = []
        for(var i=0; i<indexSchedule.length; i++){
          const classData = indexSchedule[i]
          if(lectureAdded && classData.type == "LEC/STUDIO") continue;
          let classInfo = {
            id:  `${courseCode} ${index} ${i}`,
            groupid: courseCode+index,
            courseName: courseName,
            courseCode: courseCode,
            index: index,
            type: classData.type,
            group: classData.group,
            venue: classData.venue,
            date: this.getCurrentDay(Day[classData.day]),
            weeks: classData.weeks.toString(),
            frequency: this.parseWeeks(classData.weeks),
            start: this.getCurrentDay(Day[classData.day]) + this.parseStart(classData.time),
            end: this.getCurrentDay(Day[classData.day]) + this.parseEnd(classData.time),
          }
          if(classData.type == "LEC/STUDIO"){
            classInfo.groupid = null
            classInfo.index = ""
            classInfo.group = ""
            result["lectures"].push(classInfo)
          }else{
            (result["lessons"][index] ??= []).push(classInfo)
          }
        }
        lectureAdded = true
      }
      return result
    },
    parseWeeks(weekArray){
      // convert week array to meaningful text
      if(weekArray.length > 4){
        if(weekArray.length > 8){
          return "Every Week"
        }else{
          if(parseInt(weekArray[0]) % 2 == 0){
            return "Even Week"
          }else{
            return "Odd Week"
          }
        }
      }
      return "Week " + weekArray.toString()
    },
    parseStart(timeArray){
      // convert time array to required format
      return timeDict[timeArray[0]]
    },
    parseEnd(timeArray){
      return timeDict[timeArray[timeArray.length-1]+1]
    },
    getCurrentDay (day) {
      return "2023-05-0" + day
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



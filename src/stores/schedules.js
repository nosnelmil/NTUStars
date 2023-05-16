import { defineStore } from 'pinia'
import { Notify } from 'quasar';
import {
  parseDate,
} from '@quasar/quasar-ui-qcalendar/src/QCalendarDay.js'
const firebaseEndpoint = "http://127.0.0.1:5001/ntu-schedule-maker/asia-east2/app/"
const Day = {
	"MON": 1,
	"TUE": 2,
	"WED": 3,
	"THU": 4,
  "FRI": 5,
  "SAT": 6,
}
const timeDict = {
   0 : "0800",
   1 : "0830",
   2 : "0900",
   3 : "0930",
   4 : "1000",
   5 : "1030",
   6 : "1100",
   7 : "1130",
   8 : "1200",
   9 : "1230",
   10 : "1300",
   11 : "1330",
   12 : "1400",
   13 : "1430",
   14 : "1500",
   15 : "1530",
   16 : "1600",
   17 : "1630",
   18 : "1700",
   19 : "1730",
   20 : "1800",
   21 : "1830",
   22 : "1900",
   23 : "1930",
   24 : "2000",
   25 : "2030",
   26 : "2100",
   27 : "2130",
   28 : "2200",
   29 : "2230",
   30 : "2300",
   31 : "2330",
};

export const useSchedules = defineStore('schedules', {
  state: () => {
    return {
      schedules: {},
      isLoading: false
    }
  },
  getters: {
    getSchedule: (state) => {
      return (semester, courseCode) => {
        if(semester in state.schedules 
            && courseCode in state.schedules[semester] ){
              return state.schedules[semester][courseCode]
        }
        return null
      }
    },
  },
  actions: {
    async findCourseSchedule(semester, code){
      console.log("Finding Schedule", semester, code)
      const courseCode = code.toUpperCase();
      let schedule = this.getSchedule(semester, courseCode)
      if(schedule){
        console.log("Found Schedule", schedule)
        return schedule
      }else{
        // get from database
        const reqBody = JSON.stringify({
          "semester":semester,
          "courseCode": courseCode
        })
        const response = await fetch(
          firebaseEndpoint + "get-schedule",
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: reqBody
          })
        const data = await response.json()
        if(data.success){
          const parsedSchedule = this.parseSchedule(data.schedule, data.name)
          if(!(semester in this.courses)){
            this.courses[semester] = {}
          }
          this.courses[semester][courseCode] = parsedSchedule
          console.log("Found Schedule", parsedSchedule)
          return parsedSchedule
        }else{
          // error
          Notify.create({
            message: `${courseCode} does not exist for sem ${semester}`,
            color: 'error'
          })
        }

      }
    },

    // schedules: {
    //   sem: {
    //     <courseCode>: {
    //       <index>:[{},{},{}]
    //       lecture:[{},{},{}]
    //     }
    //   }
    // },

    // Helper Functions
    // parse schedule to timetable format
    parseSchedule(schedule, courseName){
      console.log("Parsing Schedule")
      var result = {}
      var lectureAdded = false
      result["Lecture"] = []
      for(const [index, indexSchedule] of Object.entries(schedule)){
        result[index] = []
        for(var i=0; i<indexSchedule.length; i++){
          const classData = indexSchedule[i]
          if(lectureAdded && classData.type == "LEC/STUDIO") continue;
          let classInfo = {
            id:  `${classData.courseCode} ${index} ${i}`,
            name: courseName,
            courseCode: classData.courseCode,
            index: index,
            type: classData.type,
            group: classData.group,
            venue: classData.venue,
            date: this.getCurrentDay(Day[classData.day]),
            weeks: classData.weeks.toString(),
            frequency: this.parseWeeks(classData.weeks),
            time: this.parseTime(classData.time),
            duration: this.parseDuration(classData.time),
            // isTemp: false
            // TODO: add this in lesson store
            // bgcolor: 'red',
          }
          if(classData.type == "LEC/STUDIO"){
            classInfo.index = ""
            classInfo.group = ""
            result["Lecture"].push(classInfo)
          }else{
            result[index].push(classInfo)
          }
        }
        lectureAdded = true
      }
      console.log("Parsed Successfully", result)
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
    parseTime(timeArray){
      // convert time array to required format
      return timeDict[timeArray[0]]
    },
    parseDuration(timeArray){
      return timeArray.length*30-1
    },
    getCurrentDay (day) {
      const CURRENT_DAY = new Date("2023-05-01")
      const newDay = new Date(CURRENT_DAY)
      newDay.setDate(day)
      const tm = parseDate(newDay)
      return tm.date
    },    
  }
})



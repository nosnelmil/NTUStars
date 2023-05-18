import { defineStore } from 'pinia'
import { useSchedules } from './schedules'
import { parseDate } from '@quasar/quasar-ui-qcalendar/src/QCalendarDay.js'
import { Notify } from 'quasar';

export const useTimetableStore = defineStore('timetable', {
  state: () => {
    return {
      coursesAdded: {},
      preview: {},
      timeTable: {}, // the one thats showing on the screen
      colors: ['red', 'pink', 'green', 'teal', 'blue', 'light-blue', 'cyan', 'deep-purple', 'orange'],
      isLoading: false,
      semester: "2022;2",
    }
  },
  
  getters: {
    getColor: (state) =>  {
      console.log("colors", state.colors)
      return state.colors.pop()
    },
    getLessons: (state) => {
      return state.timeTable[state.semester]
    },
    getCoursesAdded: (state) => {
      return {...state.coursesAdded[state.semester]}
    }
  },
  
  actions: {
    async setPreview(courseCode, showing){
      const scheduleStore = useSchedules()
      const schedule = await scheduleStore.findCourseSchedule(semester, courseCode)
      const preview = []
      if(schedule){
        for(const [index, classInfo] of schedule){
          if (index == "Lecture" || classInfo.index == showing.index) continue
          preview.push({
            isTemp: true,
            bgcolor: showing.bgcolor,
            ...classInfo
          })
        }
      }
    },
    async addCourse(code){
      const courseCode = code.toUpperCase()
      const semester = this.semester
      if(semester in this.coursesAdded && courseCode in this.coursesAdded[semester]){
        Notify.create({message: "Course already in timetable!", color: "negative"})
        return
      }
      if(!(semester in this.coursesAdded)){
        this.coursesAdded[semester] = {}
      }
      this.coursesAdded[semester][courseCode] = {
        isLoading: true,
        courseName: "",
        index: "",
        bgcolor: "",
        courseCode: courseCode
      }
      // retrieve the course scheudle
      const scheduleStore = useSchedules()
      const schedule = await scheduleStore.findCourseSchedule(semester, courseCode)
      if(!schedule) {
        // course does not exist / there is no schedule
        delete this.coursesAdded[semester][courseCode]
        return null
      }
      var bgcolor = this.colors.pop() || "orange"
      const newLessons = []
      // if(!(semester in this.timeTable)) this.timeTable[semester] = []
      for(const classInfo of schedule["lecture"]){
        newLessons.push({
          isTemp: false,
          bgcolor: bgcolor,
          ...classInfo
        })
      }
      let addedIndex = ""
      for(const [index, indexSchedule] of Object.entries(schedule)){
        if(index == "lecture") continue
        for(const classInfo of indexSchedule){
          newLessons.push({
            isTemp: false,
            bgcolor: bgcolor,
            ...classInfo
          })
        }
        addedIndex = index
        break
      }
      if (semester in this.timeTable){
        this.timeTable[semester] = this.timeTable[semester].concat(newLessons)
      }else{
        this.timeTable[semester] = newLessons
      }
      this.coursesAdded[semester][courseCode] = {
        isLoading: false,
        courseName: schedule.name,
        index: addedIndex,
        bgcolor: bgcolor,
        courseCode: courseCode
      }
    },
    removeCourse(code){

    },
    returnColor(color){
      this.state.push(color)
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

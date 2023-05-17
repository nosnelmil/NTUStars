import { defineStore } from 'pinia'
import { useSchedules } from './schedules'
import { parseDate } from '@quasar/quasar-ui-qcalendar/src/QCalendarDay.js'
import { Notify } from 'quasar';

export const useTimetableStore = defineStore('timetable', {
  state: () => {
    return {
      coursesAdded: {},
      preview: [],
      timeTable: [], // the one thats showing on the screen
      colors: ['red', 'pink', 'green', 'teal', 'blue', 'light-blue', 'cyan', 'deep-purple', 'orange'],
      isLoading: false
    }
  },
  
  getters: {
    getColor: (state) =>  {
      return state.colors.pop()
    },
    getLessons: (state) => {
      console.log("Get Lessons called")
      return state.timeTable
    }
  },
  
  actions: {
    async setPreview(semester, courseCode, showing){
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
    async addCourse(semester, courseCode){
      console.log("Adding Course Schedule")
      if(courseCode in this.coursesAdded){
        Notify.create({message: "Course already in timetable!", color: "negative"})
        return
      }
      this.coursesAdded[courseCode] = {
        isLoading: true,
        name: "",
      }
      const scheduleStore = useSchedules()
      const schedule = await scheduleStore.findCourseSchedule(semester, courseCode)
      if(!schedule) return null
      const color = this.getColor
      for(const classInfo of schedule["lecture"]){
        this.timeTable.push({
          isTemp: false,
          bgcolor: color,
          ...classInfo
        })
      }
      for(const [index, indexSchedule] of Object.entries(schedule)){
        if(index == "lecture") continue
        for(const classInfo of indexSchedule){
          this.timeTable.push({
            isTemp: false,
            bgcolor: color,
            ...classInfo
          })
        }
        break
      }
      this.coursesAdded[courseCode] = {
        isLoading: false,
        name: schedule.name
      }
      console.log("Added Course Schedule")
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

import { defineStore } from 'pinia'
import { useSchedules } from './schedules'
import { parseDate } from '@quasar/quasar-ui-qcalendar/src/QCalendarDay.js'
import { Notify, event } from 'quasar';
import { markRaw } from 'vue';

export const useTimetableStore = defineStore('timetable', {
  state: () => {
    return {
      calenderApi: null,
      coursesAdded: {},
      preview: {},
      timeTable: {}, // the one thats showing on the screen
      colors: ['#EF5350', '#EC407A', '#AB47BC', '#7E57C2', '#5C6BC0', '#66BB6A', '#FFCA28', '#FF7043', '#8D6E63', '#78909C'],
      isLoading: false,
      semester: "2022;2",
    }
  },
  
  getters: {
    getColor: (state) =>  {
      console.log("colors", state.colors)
      return state.colors.pop()
    },
    getTimeTable: (state) => {
      return state.timeTable[state.semester]
    },
    getPreview: (state) => {
      return state.preview[state.semester]
    },
    getCoursesAdded: (state) => {
      return {...state.coursesAdded[state.semester]}
    }
  },
  
  actions: {
    setCalendarApi(calenderApi){
      this.calenderApi = calenderApi
      console.log(this.calenderApi)
    },

    async addCourse(code){
      const courseCode = code.toUpperCase()
      const semester = this.semester
      // check if already in timetable
      if(semester in this.coursesAdded && courseCode in this.coursesAdded[semester]){
        Notify.create({message: "Course already in timetable!", color: "negative"})
        return
      }
      // instantiate if needed
      if(!(semester in this.coursesAdded)) this.coursesAdded[semester] = {}
      // add initial value to coursesAdded
      this.coursesAdded[semester][courseCode] = {
        isLoading: true,
        courseName: "",
        index: "",
        backgroundColor: "",
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
      // get a color for this course
      var backgroundColor = this.colors.pop() || "#5C6BC0"
     
      // store ids in state so its easier to delete later
      // instantiate
      if (!(semester in this.timeTable)) this.timeTable[semester] = {}
      this.timeTable[semester][courseCode] = {}
      this.timeTable[semester][courseCode]["lecture"] = []
      this.timeTable[semester][courseCode]["lessons"] = []

      // add the lecture slots for this course
      for(const classInfo of schedule["lecture"]){
        this.calenderApi.getApi().view.calendar.addEvent({
          editable: false,
          classNames: [],
          isTemp: false,
          backgroundColor: backgroundColor,
          borderColor: backgroundColor,
          textColor: 'white',
          ...classInfo
        })
        this.timeTable[semester][courseCode]["lecture"].push(classInfo.id)
      }

      // add the first non-lecture slot for this course
      let addedIndex = ""
      for(const [index, indexSchedule] of Object.entries(schedule)){
        if(index == "lecture" || index == "courseName") continue
        for(const classInfo of indexSchedule){
          this.calenderApi.getApi().view.calendar.addEvent({
            editable: false,
            classNames: [],
            isTemp: false,
            backgroundColor: backgroundColor,
            borderColor: backgroundColor,
            textColor: 'white',
            backgroundColor: backgroundColor,
            ...classInfo
          })
          this.timeTable[semester][courseCode]["lessons"].push(classInfo.id)
        }
        addedIndex = index
        break
      }
    
      // update courses added state
      this.coursesAdded[semester][courseCode] = {
        isLoading: false,
        courseName: schedule.courseName,
        index: addedIndex,
        backgroundColor: backgroundColor,
        courseCode: courseCode
      }
    },
    removeCourse(courseCode){
      const semester = this.semester
      const calendar = this.calenderApi.getApi().view.calendar
      if(!(semester in this.timeTable) || !(courseCode in this.timeTable[semester])){
        Notify.create("Unable to remove course")
        return
      }
      console.log(this.timeTable[semester][courseCode])
      // remove from calendar
      for(const eventId of this.timeTable[semester][courseCode]['lecture']){
        calendar.getEventById(eventId).remove()
      }
      for(const eventId of this.timeTable[semester][courseCode]['lessons']){
        calendar.getEventById(eventId).remove()
      }
      // remove from preview if preview is the deleted coursecode
      this.resetPreview()

      const colorUsed = this.coursesAdded[semester][courseCode].backgroundColor
      this.returnColor(colorUsed)
      delete this.coursesAdded[semester][courseCode]
    },
    async setPreview(courseCode){
      console.log("entered set preview")
      const scheduleStore = useSchedules()
      const semester = this.semester
      const schedule = await scheduleStore.findCourseSchedule(semester, courseCode)
      console.log("schedule", schedule)
      const showing = this.coursesAdded[semester][courseCode]
      const preview = []
      if(schedule){
        for(const [index, indexSchedule] of Object.entries(schedule)){
          if (index == "lecture" || index == "courseName" || indexSchedule[0].index == showing.index) continue
          for(const classInfo of indexSchedule){
            preview.push({
              isTemp: true,
              bgcolor: showing.bgcolor,
              ...classInfo
            })
          }
        }
      }
      this.preview[semester] = preview
    },
    resetPreview(){
      const semester = this.semester
      if(!(semester in this.preview)) return
      const calendar = this.calenderApi.getApi().view.calendar
      for(const eventId of this.preview[semester]){
        calendar.getEventById(eventId.remove())
      }
      this.preview[semester] = []
    },
    returnColor(color){
      this.colors.push(color)
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

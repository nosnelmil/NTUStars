import { defineStore } from 'pinia'
import { useSchedules } from './schedules'
import { Notify } from 'quasar';
import { createEventId } from '../composables/event-utils';


export const useTimetableStore = defineStore('timetable', {
  state: () => {
    return {
      calenderApi: null,
      coursesAdded: {},
      preview: {},
      timeTable: {}, // the one thats showing on the screen
      colors: ['#EF5350', '#EC407A', '#AB47BC', '#7E57C2', '#5C6BC0', '#66BB6A', '#FFCA28', '#FF7043', '#8D6E63', '#78909C'],
      isLoading: false,
      semester: null,
    }
  },
  
  getters: {
    getColor: (state) =>  {
      return state.colors.pop()
    },
    getTimeTable: (state) => {
      return state.timeTable[state.semester]
    },
    getCourseCodeShowingPreview: (state) => {
      if(state.semester in state.preview){
        return state.preview[state.semester].length > 0
          ? state.preview[state.semester][0].courseCode
          : null
      }
    },
    getCoursesAdded: (state) => {
      return {...state.coursesAdded[state.semester]}
    },
    getSemester: (state) => {
      return state.semester
    },
    getSemShortName: (state) =>{
      if(state.semester){
        if(state.semester.at(-1) == "S"){
          return state.semester.replace(";S", " Special Sem")
        }else{
          return state.semester.replace(";", " Sem ")
        }
      }else{
        return "Select Semester"
      }
    }
  },
  
  actions: {
    setCalendarApi(calenderApi){
      this.calenderApi = calenderApi
    },
    async addCourse(code){
      const courseCode = code.toUpperCase()
      const semester = this.semester
      const calendar = this.calenderApi.getApi().view.calendar
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
        calendar.addEvent(addTimetableProp(classInfo,false,backgroundColor))
        this.timeTable[semester][courseCode]["lecture"].push(classInfo.id)
      }

      // add the first non-lecture slot for this course
      let addedIndex = ""
      for(const [index, indexSchedule] of Object.entries(schedule)){
        if(index == "lecture" || index == "courseName") continue
        for(const classInfo of indexSchedule){
          calendar.addEvent(addTimetableProp(classInfo,false,backgroundColor))
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
    addCustomEvent(selectInfo, name){
      const semester = this.semester
      const calendar = this.calenderApi.getApi().view.calendar
      // Add to custom events if needed
      let color
      if(!(semester in this.timeTable)){
        this.timeTable[semester] = {}
      }
      if(!("custom" in this.timeTable[semester]) || !this.timeTable[semester]["custom"].length){
        this.timeTable[semester]["custom"] = []
        if(!(semester in this.coursesAdded)) this.coursesAdded[semester] = {}
        this.coursesAdded[semester]["custom"] = {
          isLoading: true,
          courseCode: "custom",
          courseName: "Custom Events",
          index: "",
          backgroundColor: "",
        }
        color = this.getColor
      } 
      else{
        color = this.coursesAdded[semester]["custom"].backgroundColor
      }
      // Add event to calendar
      const classInfo = {
        id: createEventId()+name,
        groupId: createEventId()+name,
        courseName: name,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        isCustom: true,
      }
      classInfo.editable = true
      const event = addTimetableProp(classInfo, false, color)
      
      // save event to timetable & coursesAdded
      this.timeTable[semester]["custom"].push(event.id)
      this.coursesAdded[semester]["custom"].isLoading = false
      this.coursesAdded[semester]["custom"].backgroundColor = color
      calendar.addEvent(event)
      
    },
    removeCourse(courseCode){
      const semester = this.semester
      const calendar = this.calenderApi.getApi().view.calendar
      if(!(semester in this.timeTable) || !(courseCode in this.timeTable[semester])){
        Notify.create("Unable to remove course")
        return
      }
      // remove from calendar
      if(courseCode != "custom"){
        if('lecture' in this.timeTable[semester][courseCode]){
          for(const eventId of this.timeTable[semester][courseCode]['lecture']){
            calendar.getEventById(eventId).remove()
          }
          this.timeTable[semester][courseCode]['lecture'] = {}
        }
        if('lessons' in this.timeTable[semester][courseCode]){
          for(const eventId of this.timeTable[semester][courseCode]['lessons']){
            calendar.getEventById(eventId).remove()
          }
          this.timeTable[semester][courseCode]['lessons'] = {}
        }
      }else{
        for(const eventId of this.timeTable[semester][courseCode]){
          calendar.getEventById(eventId).remove()
        }
        this.timeTable[semester][courseCode] = []
      }
      // remove from preview if preview is the deleted coursecode
      this.resetPreview()

      const colorUsed = this.coursesAdded[semester][courseCode].backgroundColor
      this.returnColor(colorUsed)
      delete this.coursesAdded[semester][courseCode]
    },
    async setPreview(courseCode){
      const scheduleStore = useSchedules()
      const semester = this.semester
      const calendar = this.calenderApi.getApi().view.calendar
      const schedule = await scheduleStore.findCourseSchedule(semester, courseCode)
      const showing = this.coursesAdded[semester][courseCode]
      const preview = []
      this.resetPreview()
      if(schedule){
        for(const [index, indexSchedule] of Object.entries(schedule)){
          if (index == "lecture" || index == "courseName" || indexSchedule[0].index == showing.index) continue
          for(const classInfo of indexSchedule){
            const previewEvent = addTimetableProp(classInfo, true, showing.backgroundColor)
            preview.push(previewEvent)
            calendar.addEvent(previewEvent)
          }
        }
      }
      this.preview[semester] = preview
    },
    resetPreview(){
      const semester = this.semester
      if(!(semester in this.preview)) return
      const calendar = this.calenderApi.getApi().view.calendar
      for(const event of this.preview[semester]){
        calendar.getEventById(event.id).remove()
      }
      this.preview[semester] = []
    },
    swapIndex(courseCode, newIndex){
      const semester = this.semester
      const calendar = this.calenderApi.getApi().view.calendar
      // get event object of newIndex
      const newLessons = this.preview[semester].filter(e => e.index == newIndex)
      // remove preview
      this.resetPreview()
      // reset preview properties
      newLessons.forEach(e => {
        e.isPreview = false
        e.classNames = ['lesson-body']
        e.groupId = null
      })
      // remove oldIndex
      for (const eventId of this.timeTable[semester][courseCode]['lessons']){
        calendar.getEventById(eventId).remove()
      }
      // add back to calendar
      const newEventIds = []
      for (const event of newLessons){
        calendar.addEvent(event)
        newEventIds.push(event.id)
      }
      this.timeTable[semester][courseCode]['lessons'] = newEventIds
      // update added course index
      this.coursesAdded[semester][courseCode].index = newIndex
    },
    setSemester(semesterKey){
      this.semester = semesterKey
    },
    reset(){
      const calenderApi = this.calenderApi
      const events = this.calenderApi.getApi().view.calendar.getEvents()
      for(const event of events){
        event.remove()
      }
      this.$reset()
      this.setCalendarApi(calenderApi)
    },
    resize(){
      if(!this.calenderApi) return
      this.calenderApi.getApi().view.calendar.updateSize()
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

function addTimetableProp(classInfo, isPreview, color){
  return ({
    groupId: isPreview ? classInfo.courseCode+classInfo.index : null,
    editable: false,
    classNames: ['lesson-body'].concat(isPreview?['lighten']:[]),
    isPreview: isPreview,
    backgroundColor: color,
    borderColor: color,
    textColor: 'white',
    ...classInfo
  })
}
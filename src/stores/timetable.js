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
      colors: ['#EF5350', '#29B6F6', '#EC407A', '#AB47BC', '#7E57C2', '#5C6BC0', '#66BB6A', '#FFCA28', '#FF7043', '#8D6E63', '#42A5F5', '#26C6DA', '#26A69A', '#9CCC65', '#FFA726'],
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
    setTimeTable(){
      if(Object.keys(this.timeTable).length == 0) return
      for(const courseCodeObj of Object.values(this.timeTable)){
        for(const groupedTimeTableItems of Object.values(courseCodeObj)){
          for(const timeTableItems of Object.values(groupedTimeTableItems)){
            if(timeTableItems){
              for(const timeTableItem of timeTableItems){
                this.calenderApi.getApi().view.calendar.addEvent(timeTableItem)
              }
            }
          }
        } 
      }
    },
    setCalendarApi(calenderApi){
      this.calenderApi = calenderApi
    },
    async addCourse(code){
      const courseCode = code.toUpperCase()
      const semester = this.semester
      const calendar = this.calenderApi.getApi().view.calendar
      // check if already in timetable
      if(this.coursesAdded?.[semester]?.[courseCode]){
        Notify.create({message: "Course already in timetable!", color: "negative"})
        return
      }
      // instantiate if needed
      // add initial value to coursesAdded
      (this.coursesAdded[semester] ??= {})[courseCode] = {
        isLoading: true,
        courseName: "",
        index: "",
        backgroundColor: "",
        au: "",
        courseCode: courseCode
      }
      // retrieve the course scheudle
      const scheduleStore = useSchedules()
      const courseInfo = await scheduleStore.fetchCourseSchedule(semester, courseCode)
      if(!courseInfo) {
        // course does not exist / there is no courseInfo
        delete this.coursesAdded[semester][courseCode]
        return null
      }

      // get a color for this course
      var backgroundColor = this.colors.pop() || "#5C6BC0";
     
      // store ids in state so its easier to delete later
      // instantiate
      (this.timeTable[semester] ??= {})[courseCode] = {
        "lectures": [],
        "lessons": [],
      }

      // add the lecture slots for this course
      for(var classInfo of courseInfo.lectures){
        classInfo = addTimetableProp(classInfo,false,backgroundColor)
        calendar.addEvent(classInfo)
        this.timeTable[semester][courseCode].lectures.push(classInfo)
      }

      // add the first non-lecture slot for this course
      let addedIndex = ""
      for(const [index, indexSchedule] of Object.entries(courseInfo.lessons)){
        for(var classInfo of indexSchedule){
          classInfo = addTimetableProp(classInfo,false,backgroundColor)
          calendar.addEvent(classInfo)
          this.timeTable[semester][courseCode].lessons.push(classInfo)
        }
        addedIndex = index
        break
      }
      // update courses added state
      this.coursesAdded[semester][courseCode] = {
        isLoading: false,
        courseName: courseInfo.courseName,
        index: addedIndex,
        backgroundColor: backgroundColor,
        courseCode: courseCode,
        au: courseInfo.au,
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
      if(!(this.timeTable?.[semester]?.["custom"]?.["events"])){
        (this.timeTable[semester] ??= {})["custom"] = {
          "events": []
        };
        (this.coursesAdded[semester] ??= {})["custom"] = {
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
      this.timeTable[semester]["custom"]["events"].push(event)
      this.coursesAdded[semester]["custom"].isLoading = false
      this.coursesAdded[semester]["custom"].backgroundColor = color
      calendar.addEvent(event)
      
    },
    updateCustomEvent(event){
      this.timeTable[this.semester]["custom"]["events"].forEach((e) => {
        if(e.id == event.id){
          e.courseName = event.extendedProps.courseName
          e.start = event.startStr
          e.end = event.endStr
        }
      })
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
        if('lectures' in this.timeTable[semester][courseCode]){
          for(const event of this.timeTable[semester][courseCode]['lectures']){
            calendar.getEventById(event.id).remove()
          }
          this.timeTable[semester][courseCode]['lectures'] = []
        }
        if('lessons' in this.timeTable[semester][courseCode]){
          for(const event of this.timeTable[semester][courseCode]['lessons']){
            calendar.getEventById(event.id).remove()
          }
          this.timeTable[semester][courseCode]['lessons'] = []
        }
      }else{
        for(const event of this.timeTable[semester][courseCode]['events']){
          calendar.getEventById(event.id).remove()
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
      const courseInfo = await scheduleStore.fetchCourseSchedule(semester, courseCode)
      const showing = this.coursesAdded[semester][courseCode]
      const preview = []
      this.resetPreview()
      if(courseInfo){
        for(const [index, indexSchedule] of Object.entries(courseInfo.lessons)){
          if (index == showing.index) continue
          for(const classInfo of indexSchedule){
            const previewEvent = addTimetableProp(classInfo, true, showing.backgroundColor)
            preview.push(previewEvent)
            calendar.addEvent(previewEvent)
          }
        }
      }
      if(!preview.length){
        Notify.create({message: "There are no other indexes for this module.", type: "negative"})
      }
      this.preview[semester] = preview
    },
    resetPreview(){
      const semester = this.semester
      if(!(semester in this.preview)) return
      const calendar = this.calenderApi.getApi().view.calendar
      for(const event of this.preview[semester]){
        calendar.getEventById(event.id)?.remove()
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
      for (const event of this.timeTable[semester][courseCode]['lessons']){
        calendar.getEventById(event.id).remove()
      }
      // add back to calendar
      const newEvents = []
      for (const event of newLessons){
        calendar.addEvent(event)
        newEvents.push(event)
      }
      this.timeTable[semester][courseCode]['lessons'] = newEvents
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
  },
  persist:
  {
    afterRestore: (ctx) => {
      // console.log('about to restore,' , ctx.store.$reset()) // to reset persisted state (dev used only)
      ctx.store.preview = {}
    }
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
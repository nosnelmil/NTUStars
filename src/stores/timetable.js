import { defineStore } from 'pinia'
import { useSchedules } from './schedules'
import { Notify } from 'quasar';
import { createEventId } from '../composables/event-utils';

const MAX_SHOWING_INDEX = 25

export const useTimetableStore = defineStore('timetable', {
  state: () => {
    return {
      // Full calendar api
      calenderApi: null,
      // Courses that has been added: Used by right sidebar
      coursesAdded: {},
      // Preview that are currently showing
      showingPreview: {},
      previewCourseCode: null,
      // Constant to set the maximum index that can be previewed
      maxShowingIndex: MAX_SHOWING_INDEX,
      // Total number of Indexes showing as preview for a selected course code
      showingPreviewIndexCount: 1,
      // Total number of availble indexes for the course selected for preview
      totalIndexCount: 0,
      // Indexes for preview. Can be set to true(showing on the timetable) or false(hidden)
      previewIndexes: {},
      // Indexes that users saved
      savedPreviewIndexes: {},
      // All Events objects that are shown on the timetable
      timeTable: {},
      // All possible event colors left
      colors: ['#0D47A1', '#E65100', '#FF6F00', '#F57F17', '#827717', '#33691E', '#1B5E20', '#B71C1C', '#880E4F', '#4A148C', '#311B92', '#1A237E', '#01579B', '#006064', '#004D40', '#BF360C', '#3E2723'],
      isLoading: false,
      // The overall selected semester
      semester: null,
    }
  },
  
  getters: {
    getTimeTable: (state) => {
      return state.timeTable[state.semester]
    },
    getCourseCodeShowingPreview: (state) => {
      if(state.semester in state.showingPreview){
        return state.showingPreview[state.semester].length > 0
          ? state.showingPreview[state.semester][0].courseCode
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
    },
    getTotalAus: (state) => {
      if(state.semester && state.semester in state.coursesAdded){
        return Object.keys(state.coursesAdded[state.semester])
                      .reduce((prev, key) => 
                        prev + parseInt(state.coursesAdded[state.semester][key].au)
                        , 0)
      }else {
        return 0
      }
    },
    getShowingIndex: (state) => {
      return (courseCode) => courseCode ? state.coursesAdded[state.semester][courseCode].index : null
    },
    getPreviewCourseCode: (state) => {
      // if(state.semester in state.showingPreview && state.showingPreview[state.semester].length > 0){
      //   return state.showingPreview[state.semester][0].courseCode
      // }
      return state.previewCourseCode
    },
    getPreviewIndexes: (state) => {
      return Object.entries(state.previewIndexes)
    },
    getSavedPreviewIndexes: (state) => 
      state.savedPreviewIndexes[state.semester]?.[state.previewCourseCode]
        ? Object.entries(state.savedPreviewIndexes[state.semester][state.previewCourseCode])
        : [],
    
    isIndexPreviewSaved: (state) => {
      return (index) => state.savedPreviewIndexes[state.semester]?.[state.previewCourseCode]?.[index]
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
      };
      // retrieve the course scheudle
      const scheduleStore = useSchedules()
      const courseInfo = await scheduleStore.fetchCourseSchedule(semester, courseCode)
      if(!courseInfo) {
        // course does not exist / there is no courseInfo
        delete this.coursesAdded[semester][courseCode]
        return null
      }

      // get a color for this course
      var backgroundColor = this.getRandomColor() || "#E65100";
     
      // store ids in state so its easier to delete later
      // instantiate
      (this.timeTable[semester] ??= {})[courseCode] = {
        "lectures": [],
        "lessons": [],
      };

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
          au: 0,
          index: "",
          backgroundColor: "",
        }
        color = this.getRandomColor()
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
        if(semester in this.showingPreview && this.showingPreview[semester].length > 0){
          // remove from showingPreview if showingPreview is the deleted coursecode
          if(courseCode == this.showingPreview[semester][0].courseCode){
            this.resetPreview()
            // reset all indexes
            this.previewIndexes = {} 
          }
        }
      }else{
        for(const event of this.timeTable[semester][courseCode]['events']){
          calendar.getEventById(event.id).remove()
        }
        this.timeTable[semester][courseCode] = []
      }
     


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
      const showingPreview = []
      this.resetPreview()
      if(courseInfo){
        // track number of added preview events
        this.previewCourseCode = courseCode
        this.totalIndexCount = 0
        this.previewIndexes[showing.index] = true;
        (this.savedPreviewIndexes[semester] ??= {})[courseCode] ??= {};
        for(const [index, indexSchedule] of Object.entries(courseInfo.lessons)){
          this.totalIndexCount += 1
          if (index == showing.index) {
            continue
          }
          if (this.showingPreviewIndexCount >= MAX_SHOWING_INDEX && !this.isIndexPreviewSaved(index)){
            // skip adding index
            this.previewIndexes[index] = false
            continue
          }
          for(const classInfo of indexSchedule){
            const previewEvent = addTimetableProp(classInfo, true, showing.backgroundColor)
            showingPreview.push(previewEvent)
            calendar.addEvent(previewEvent)
          }
          this.showingPreviewIndexCount += 1
          this.previewIndexes[index] = true
        }
        Notify.create({message: `Showing ${this.showingPreviewIndexCount} / ${this.totalIndexCount} available indexes`, type: "primary"})
      }
      if(!showingPreview.length){
        Notify.create({message: "There are no other indexes for this module.", type: "negative"})
      }
      this.showingPreview[semester] = showingPreview
    },

    // Temp previews are maintain with the help of paginations
    async addTempPreviews(indexesToAdd){
      // if(this.showingPreviewIndexCount >= MAX_SHOWING_INDEX){
      //   Notify.create({message: "Previewing maximum number of indexes. Please remove other indexes from preview first!", type: "negative"})
      //   return
      // }
      const courseCode = this.getPreviewCourseCode
      const scheduleStore = useSchedules()
      const semester = this.semester
      const calendar = this.calenderApi.getApi().view.calendar
      const courseInfo = await scheduleStore.fetchCourseSchedule(semester, courseCode)
      const showing = this.coursesAdded[semester][courseCode]
      if(courseInfo){
        for(const indexToAdd of indexesToAdd){
          for(const classInfo of courseInfo.lessons[indexToAdd]){
            const previewEvent = addTimetableProp(classInfo, true, showing.backgroundColor)
            this.showingPreview[semester].push(previewEvent)
            calendar.addEvent(previewEvent)
          }
          this.previewIndexes[indexToAdd] = true
          this.showingPreviewIndexCount += 1
        }
      }
    },
    // remove previews excluding saved ones from the timetable (used during the change in pages in preview list)
    removeTempPreviews(indexesToRemove){
      const semester = this.semester
      if(!(semester in this.showingPreview)) return
      const calendar = this.calenderApi.getApi().view.calendar
      const indexesToRemoveSet = new Set(indexesToRemove)
        for(var i=this.showingPreview[semester].length-1; i>=0; i--){
          const event = this.showingPreview[semester][i]
          // if the event is saved or showing
          if(!indexesToRemoveSet.has(event.index)) continue
          calendar.getEventById(event.id)?.remove()
          this.showingPreview[semester].splice(i, 1)
          this.showingPreviewIndexCount -= 1
          this.previewIndexes[event.index] = false
        }
    },
    // Saved preview are previews that are selected by users
    async addToSavePreview(indexToAdd, addToCalendar=false){
      if(addToCalendar) this.addTempPreviews([indexToAdd]);
      ((this.savedPreviewIndexes[this.semester] ??= {})[this.previewCourseCode] ??= {})[indexToAdd] = true;
    },
    async removeFromSavePreview(indexToAdd, removeFromCalendar=false){
      if(removeFromCalendar) this.removeTempPreviews([indexToAdd]);
      if(!!this.savedPreviewIndexes[this.semester]?.[this.previewCourseCode]?.[indexToAdd]){
        delete this.savedPreviewIndexes[this.semester][this.previewCourseCode][indexToAdd]
      }
    },
    // Remove all previews included saved ones
    resetPreview(){
      const semester = this.semester
      if(!(semester in this.showingPreview)) return
      const calendar = this.calenderApi.getApi().view.calendar
      for(const event of this.showingPreview[semester]){
        calendar.getEventById(event.id)?.remove()
      }
      this.showingPreview[semester] = []
      this.previewIndexes = {}
      this.showingPreviewIndexCount = 1
      this.totalIndexCount = 0
      this.previewCourseCode = null
    },
    // swap two given indexes
    swapIndex(courseCode, newIndex){
      const semester = this.semester
      const calendar = this.calenderApi.getApi().view.calendar
      // get event object of newIndex
      const newLessons = this.showingPreview[semester].filter(e => e.index == newIndex)
      // remove showingPreview
      this.resetPreview()
      
      // reset showingPreview properties
      newLessons.forEach(e => {
        e.isPreview = false
        e.classNames = ['lesson-body']
        e.groupId = null
      })
      // remove oldIndex
      var oldIndex = ""
      for (const event of this.timeTable[semester][courseCode]['lessons']){
        calendar.getEventById(event.id).remove()
        oldIndex = event.index
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
    // set the value of semester
    setSemester(semesterKey){
      this.semester = semesterKey
    },
    // reset the calendar
    reset(){
      const calenderApi = this.calenderApi
      const savedPreviewIndexes = this.savedPreviewIndexes
      const events = this.calenderApi.getApi().view.calendar.getEvents()
      for(const event of events){
        event.remove()
      }
      this.$reset()
      this.savedPreviewIndexes = savedPreviewIndexes
      this.setCalendarApi(calenderApi)
    },
    // resize the calendar
    resize(){
      if(!this.calenderApi) return
      this.calenderApi.getApi().view.calendar.updateSize()
    },
    // Return back a color to the state
    returnColor(color){
      this.colors.push(color)
    },
    // Get a random color from the state (placed here so it wont be called during store initiation?)
    getRandomColor(){
      if(this.colors.length == 0) return null
      const randomIndex = Math.floor(Math.random()*this.colors.length)
      const color = this.colors.at(randomIndex)
      this.colors.splice(randomIndex, 1)
      return color
    }     
  },
  persist: 
  {
    afterRestore: (ctx) => {
      // console.log('about to restore,' , ctx.store.$reset()) // to reset persisted state (dev used only)
      ctx.store.showingPreview = {}
      ctx.store.previewIndexes = {}
      ctx.store.showingPreviewIndexCount = 1
      ctx.store.totalIndexCount = 0
      ctx.store.maxShowingIndex = MAX_SHOWING_INDEX
      ctx.store.previewCourseCode = null
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
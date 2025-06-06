/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { defineStore } from 'pinia'
import { useSchedules } from './schedules'
import { createEventId } from '../composables/event-utils';
import type FullCalendar from '@fullcalendar/vue3'
import type { ParsedLesson } from '~/models/parsedLesson';
import type { DateSelectArg } from '@fullcalendar/core/index.js';
import type { EventImpl } from '@fullcalendar/core/internal';
import { Notify } from 'quasar';

const MAX_SHOWING_INDEX = 25

interface TimetableState {
  calenderApi: typeof FullCalendar | null;
  coursesAdded: CoursesAdded;
  showingPreview: ShowingPreview;
  previewCourseCode: string | null;
  maxShowingIndex: number;
  showingPreviewIndexCount: number;
  totalIndexCount: number;
  previewIndexes: { [index: string]: boolean };
  savedPreviewIndexes: { [semester: string]: { [courseCode: string]: { [index: string]: boolean } } };
  timeTable: Timetable;
  colors: string[];
  isLoading: boolean;
  semester: string | null;
  plan: number;
}

interface CoursesAdded {
  [plan: string]: {
    [courseCode: string]: CourseDisplay
  }
}

interface ShowingPreview {
  [plan: string]: CourseDisplay[]
}

interface CourseDisplay extends ParsedLesson {
  editable: boolean;
  classNames: string[];
  isPreview: boolean;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  isLoading?: boolean;
  isCustom?: boolean; // for custom events
}

interface Timetable {
  [plan: number]: {
    [courseCode: string]: {
      lectures: CourseDisplay[];
      lessons: CourseDisplay[];
    };
  } & {
    custom?: {
      events: CourseDisplay[];
    };
  };
}
export const useTimetableStore = defineStore('timetable', {
  state: (): TimetableState => {
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
      // The plan number of the timetable
      plan: 0,
    }
  },

  getters: {
    getTimeTable: (state) => {
      return state.timeTable[state.plan]
    },
    getCourseCodeShowingPreview: (state) => {
      if (state.plan in state.showingPreview) {
        return state.showingPreview[state.plan].length > 0
          ? state.showingPreview[state.plan][0].courseCode
          : null
      }
    },
    getCoursesAdded: (state) => {
      return { ...state.coursesAdded[state.plan] }
    },
    getSemester: (state) => {
      return state.semester
    },
    getSemesterProperName: (state) => {
      if (state.semester) {
        if (state.semester.at(-1) == "S") {
          return state.semester.replace(";S", " Special Sem ")
        } else {
          return state.semester.replace(";", " Semester ")
        }
      } else {
        return "Select Semester"
      }
    },
    getTotalAus: (state) => {
      if (state.plan in state.coursesAdded) {
        return Object.keys(state.coursesAdded[state.plan])
          .reduce((prev, key) =>
            prev + parseInt(state.coursesAdded[state.plan][key].au)
            , 0)
      } else {
        return 0
      }
    },
    getShowingIndex: (state) => {
      return (courseCode: string) => courseCode ? state.coursesAdded[state.plan][courseCode].index : null
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
      state.savedPreviewIndexes[state.plan]?.[state.plan]
        ? Object.entries(state.savedPreviewIndexes[state.plan][state.previewCourseCode || ""])
        : [],

    isIndexPreviewSaved: (state) => {
      return (index: string) => state.previewCourseCode && state.savedPreviewIndexes[state.plan]?.[state.previewCourseCode]?.[index]
    }
  },

  actions: {
    setTimeTable() {
      if (Object.keys(this.timeTable).length == 0) return
      for (const courseCodeObj of Object.values(this.getTimeTable)) {
        for (const timeTableItems of Object.values(courseCodeObj)) {
          if (timeTableItems) {
            for (const timeTableItem of timeTableItems) {
              this.calenderApi?.getApi().view.calendar.addEvent(timeTableItem)
            }
          }
        }
      }
    },
    setCalendarApi(calenderApi: typeof FullCalendar) {
      this.calenderApi = calenderApi
    },
    async addCourse(code: string) {
      if (this.calenderApi == null) {
        Notify.create({ message: "Calendar not ready!", color: "negative" })
        return
      }
      const courseCode = code.toUpperCase()
      const plan = this.plan

      const calendar = this.calenderApi?.getApi().view.calendar
      // check if already in timetable
      if (this.coursesAdded?.[plan]?.[courseCode]) {
        Notify.create({ message: "Course already in timetable!", color: "negative" })
        return
      }
      // instantiate if needed
      // add initial value to coursesAdded (this is so that the right sidebar can show the course)
      (this.coursesAdded[plan] ??= {})[courseCode] = {
        id: "",
        groupId: null,
        editable: false,
        classNames: [],
        isPreview: false,
        isLoading: true,
        courseName: "",
        index: "",
        backgroundColor: "",
        au: "",
        courseCode: courseCode,
        start: "",
        end: "",
        textColor: "white",
        borderColor: "",
        type: "",
        group: "",
        venue: "",
        date: "",
        weeks: "",
        frequency: "",
      };
      // retrieve the course scheudle
      const scheduleStore = useSchedules()
      const courseInfo = this.semester ? await scheduleStore.fetchCourseSchedule(this.semester, courseCode) : null
      if (!courseInfo) {
        // course does not exist / there is no courseInfo
        delete this.coursesAdded[plan][courseCode]
        return null
      }

      // get a color for this course
      const backgroundColor = this.getRandomColor() || "#E65100";

      // store ids in state so its easier to delete later
      // instantiate
      (this.timeTable[this.plan] ??= {})[courseCode] = {
        "lectures": [],
        "lessons": [],
      };

      // add the lecture slots for this course
      for (const classInfo of courseInfo.lectures) {
        const updateClassInfo = addTimetableProp(classInfo, false, backgroundColor)
        updateClassInfo.borderColor = "white"
        console.log("Adding lecture", updateClassInfo)

        calendar.addEvent(updateClassInfo)
        this.timeTable[plan][courseCode].lectures.push(updateClassInfo)
      }

      // add the first non-lecture slot for this course
      let addedIndex = ""
      for (const [index, indexSchedule] of Object.entries(courseInfo.lessons)) {
        for (const classInfo of indexSchedule) {
          const updateClassInfo = addTimetableProp(classInfo, false, backgroundColor)
          console.log("Adding lesson", updateClassInfo)
          calendar.addEvent(updateClassInfo)
          this.timeTable[plan][courseCode].lessons.push(updateClassInfo)
        }
        addedIndex = index
        break
      }
      // update courses added state
      this.coursesAdded[plan][courseCode] = {
        ...this.coursesAdded[plan][courseCode],
        isLoading: false,
        courseName: courseInfo.courseName,
        index: addedIndex,
        backgroundColor: backgroundColor,
        courseCode: courseCode,
        au: courseInfo.au,
      }
    },
    addCustomEvent(selectInfo: DateSelectArg, name: string) {
      const plan = this.plan
      const calendar = this.calenderApi?.getApi().view.calendar
      // Add to custom events if needed
      let color = ""
      if (!(plan in this.timeTable)) {
        this.timeTable[plan] = {}
      }
      if (!(this.timeTable?.[plan]?.["custom"]?.["events"])) {
        (this.timeTable[plan] ??= {})["custom"] = {
          "events": []
        };
        color = this.getRandomColor()
      }
      else {
        color = this.coursesAdded[plan].custom.backgroundColor
      }
      // Add event to calendar
      const classInfo: ParsedLesson = {
        id: createEventId() + name,
        groupId: createEventId() + name,
        courseName: name,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        courseCode: "custom",
        index: "",
        au: "0",
        type: "",
        group: "",
        venue: "",
        date: "",
        weeks: "",
        frequency: "",
      }
      const event = addTimetableProp(classInfo, false, color)
      event.isCustom = true // mark as custom event
      event.editable = true // allow editing

      // save event to timetable & coursesAdded
      this.timeTable[plan].custom.events.push(event);
      (this.coursesAdded[plan] ??= {})["custom"] = event;
      calendar.addEvent(event)

    },
    updateCustomEvent(event: EventImpl) {
      this.timeTable[this.plan].custom?.events.forEach((e) => {
        if (e.id == event.id) {
          e.courseName = event.extendedProps.courseName
          e.start = event.startStr
          e.end = event.endStr
        }
      })
    },
    removeCourse(courseCode: string) {
      const plan = this.plan
      const calendar = this.calenderApi?.getApi().view.calendar
      if (!(plan in this.timeTable) || !(courseCode in this.timeTable[plan])) {
        // Notify.create("Unable to remove course")
        useToast().add({ title: "Unable to remove course", description: "Please check your timetable.", color: "error", });
        return
      }
      // remove from calendar
      if (courseCode != "custom") {
        if ('lectures' in this.timeTable[plan][courseCode]) {
          for (const event of this.timeTable[plan][courseCode]['lectures']) {
            calendar.getEventById(event.id).remove()
          }
          this.timeTable[plan][courseCode]['lectures'] = []
        }
        if ('lessons' in this.timeTable[plan][courseCode]) {
          for (const event of this.timeTable[plan][courseCode]['lessons']) {
            calendar.getEventById(event.id).remove()
          }
          this.timeTable[plan][courseCode]['lessons'] = []
        }
        if (plan in this.showingPreview && this.showingPreview[plan].length > 0) {
          // remove from showingPreview if showingPreview is the deleted coursecode
          if (courseCode == this.showingPreview[plan][0].courseCode) {
            this.resetPreview()
            // reset all indexes
            this.previewIndexes = {}
          }
        }
      } else {
        if (this.timeTable[plan].custom?.events) {
          for (const event of this.timeTable[plan].custom.events) {
            calendar.getEventById(event.id)?.remove()
          }
        }
        delete this.timeTable[plan][courseCode];
      }

      const colorUsed = this.coursesAdded[plan][courseCode].backgroundColor
      this.returnColor(colorUsed)
      delete this.coursesAdded[plan][courseCode]
    },

    async setPreview(courseCode: string) {
      if (!this.semester || !courseCode) {
        useToast().add({ title: "Please select a semester and course code", description: "Cannot set preview.", color: "error", });
        return
      }
      const scheduleStore = useSchedules()
      const plan = this.plan
      const calendar = this.calenderApi?.getApi().view.calendar
      const courseInfo = await scheduleStore.fetchCourseSchedule(this.semester, courseCode)
      const showing = this.coursesAdded[plan][courseCode]
      const showingPreview = []

      this.resetPreview()

      if (courseInfo) {
        // track number of added preview events
        this.previewCourseCode = courseCode
        this.totalIndexCount = 0
        this.previewIndexes[showing.index] = true;
        (this.savedPreviewIndexes[plan] ??= {})[courseCode] ??= {};
        for (const [index, indexSchedule] of Object.entries(courseInfo.lessons)) {
          this.totalIndexCount += 1
          if (index == showing.index) {
            continue
          }
          if (this.showingPreviewIndexCount >= MAX_SHOWING_INDEX && !this.isIndexPreviewSaved(index)) {
            // skip adding index
            this.previewIndexes[index] = false
            continue
          }
          for (const classInfo of indexSchedule) {
            const previewEvent = addTimetableProp(classInfo, true, showing.backgroundColor)
            showingPreview.push(previewEvent)
            calendar.addEvent(previewEvent)
          }
          this.showingPreviewIndexCount += 1
          this.previewIndexes[index] = true
        }
        useToast().add({ title: `Showing ${this.showingPreviewIndexCount} / ${this.totalIndexCount} available indexes`, color: "primary", });
      }
      if (!showingPreview.length) {
        // Notify.create({ message: "There are no other indexes for this module.", type: "negative" })
        useToast().add({ title: "There are no other indexes for this module.", description: "Please check the course code.", color: "error", });
      }
      this.showingPreview[plan] = showingPreview
    },

    // Temp previews are maintain with the help of paginations
    async addTempPreviews(indexesToAdd: string[]) {
      const courseCode = this.getPreviewCourseCode
      const scheduleStore = useSchedules()
      const plan = this.plan
      const calendar = this.calenderApi?.getApi().view.calendar

      if (!this.semester || !this.previewCourseCode) {
        useToast().add({ title: "Please select a semester and course code", description: "Cannot add preview.", color: "error", });
        return
      }
      if (!courseCode) {
        useToast().add({ title: "No course code selected", description: "Cannot add preview.", color: "error", });
        return
      }
      const courseInfo = await scheduleStore.fetchCourseSchedule(this.semester, courseCode)
      const showing = this.coursesAdded[plan][courseCode]

      if (courseInfo) {
        for (const indexToAdd of indexesToAdd) {
          for (const classInfo of courseInfo.lessons[indexToAdd]) {
            const previewEvent = addTimetableProp(classInfo, true, showing.backgroundColor)
            this.showingPreview[plan].push(previewEvent)
            calendar.addEvent(previewEvent)
          }
          this.previewIndexes[indexToAdd] = true
          this.showingPreviewIndexCount += 1
        }
      }
    },

    // remove previews excluding saved ones from the timetable (used during the change in pages in preview list)
    removeTempPreviews(indexesToRemove: string[]) {
      const plan = this.plan
      if (!(plan in this.showingPreview)) return
      const calendar = this.calenderApi?.getApi().view.calendar
      const indexesToRemoveSet = new Set(indexesToRemove)
      for (let i = this.showingPreview[plan].length - 1; i >= 0; i--) {
        const event = this.showingPreview[plan][i]
        // if the event is saved or showing
        if (!indexesToRemoveSet.has(event.index)) continue
        calendar.getEventById(event.id)?.remove()
        this.showingPreview[plan].splice(i, 1)
        this.showingPreviewIndexCount -= 1
        this.previewIndexes[event.index] = false
      }
    },

    // Saved preview are previews that are selected by users
    async addToSavePreview(indexToAdd: string, addToCalendar = false) {
      if (addToCalendar) this.addTempPreviews([indexToAdd]);
      if (!this.previewCourseCode) {
        useToast().add({ title: "No course code selected", description: "Cannot save preview.", color: "error", });
        return
      }
      ((this.savedPreviewIndexes[this.plan] ??= {})[this.previewCourseCode] ??= {})[indexToAdd] = true;
    },
    async removeFromSavePreview(indexToAdd: string, removeFromCalendar = false) {
      if (removeFromCalendar) this.removeTempPreviews([indexToAdd]);
      if (!this.previewCourseCode) {
        useToast().add({ title: "No course code selected", description: "Cannot remove saved preview.", color: "error", });
        return
      }
      if (this.savedPreviewIndexes[this.plan]?.[this.previewCourseCode]?.[indexToAdd]) {
        delete this.savedPreviewIndexes[this.plan][this.previewCourseCode][indexToAdd]
      }
    },
    // Remove all previews included saved ones
    resetPreview() {
      const plan = this.plan
      if (!(plan in this.showingPreview)) return
      const calendar = this.calenderApi?.getApi().view.calendar
      for (const event of this.showingPreview[plan]) {
        calendar.getEventById(event.id)?.remove()
      }
      this.showingPreview[plan] = []
      this.previewIndexes = {}
      this.showingPreviewIndexCount = 1
      this.totalIndexCount = 0
      this.previewCourseCode = null
    },
    // swap two given indexes
    swapIndex(courseCode: string, newIndex: string) {
      const plan = this.plan
      const calendar = this.calenderApi?.getApi().view.calendar
      // get event object of newIndex
      const newLessons = this.showingPreview[plan].filter(e => e.index == newIndex)
      // remove showingPreview
      this.resetPreview()

      // reset showingPreview properties
      newLessons.forEach(e => {
        e.isPreview = false
        e.classNames = ['lesson-body']
        e.groupId = null
      })
      // remove oldIndex
      for (const event of this.timeTable[plan][courseCode]['lessons']) {
        calendar.getEventById(event.id).remove()
      }
      // add back to calendar
      const newEvents = []
      for (const event of newLessons) {
        calendar.addEvent(event)
        newEvents.push(event)
      }
      this.timeTable[plan][courseCode]['lessons'] = newEvents
      // update added course index
      this.coursesAdded[plan][courseCode].index = newIndex
    },
    // set the value of semester
    setSemester(semesterKey: string) {
      this.semester = semesterKey
    },
    // reset the calendar
    reset() {
      const calenderApi = this.calenderApi
      const savedPreviewIndexes = this.savedPreviewIndexes
      const events = this.calenderApi?.getApi().view.calendar.getEvents()
      for (const event of events) {
        event.remove()
      }
      this.$reset()
      this.savedPreviewIndexes = savedPreviewIndexes
      if (calenderApi) {
        this.setCalendarApi(calenderApi)
      }
    },
    // resize the calendar
    resize() {
      if (!this.calenderApi) return
      this.calenderApi.getApi().view.calendar.updateSize()
    },
    // Return back a color to the state
    returnColor(color: string) {
      this.colors.push(color)
    },
    // Get a random color from the state (placed here so it wont be called during store initiation?)
    getRandomColor(): string {
      const randomIndex = Math.floor(Math.random() * this.colors.length)
      const color = this.colors.at(randomIndex)
      this.colors.splice(randomIndex, 1)
      return color || "#E65100" // fallback color
    }
  },
  // persist: true,
  // {
  //   afterRestore: (ctx) => {
  //     // console.log('about to restore,' , ctx.store.$reset()) // to reset persisted state (dev used only)
  //     ctx.store.showingPreview = {}
  //     ctx.store.previewIndexes = {}
  //     ctx.store.showingPreviewIndexCount = 1
  //     ctx.store.totalIndexCount = 0
  //     ctx.store.maxShowingIndex = MAX_SHOWING_INDEX
  //     ctx.store.previewCourseCode = null
  //   },
  // }
})

function addTimetableProp(classInfo: ParsedLesson, isPreview: boolean, color: string): CourseDisplay {
  return ({
    ...classInfo,
    groupId: isPreview ? classInfo.courseCode + classInfo.index : null,
    editable: false,
    classNames: ['lesson-body'].concat(isPreview ? ['lighten'] : []),
    isPreview: isPreview,
    backgroundColor: color,
    borderColor: color,
    textColor: 'white',
  })
}
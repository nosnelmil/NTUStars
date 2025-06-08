/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { defineStore } from 'pinia'
import { useSchedules } from './schedules'
import { createEventId } from '../composables/event-utils';
import type FullCalendar from '@fullcalendar/vue3'
import type { ParsedLesson } from '~/models/parsedLesson';
import type { DateSelectArg } from '@fullcalendar/core/index.js';
import type { EventImpl } from '@fullcalendar/core/internal';
import { Notify } from 'quasar';
import { COLORS, DEFAULT_PLAN_NUMBER } from '~/constants/timetable';
import type { CourseDisplay } from '~/models/courseDisplay';

interface TimetableState {
  calenderApi: typeof FullCalendar | null;
  coursesAdded: CoursesAdded;
  showingPreview: ShowingPreview;
  previewCourseCode: string | null;
  showingPreviewIndexCount: number;
  totalIndexCount: number;
  previewIndexes: { [index: string]: boolean };
  savedPreviewIndexes: { [plan: string]: { [courseCode: string]: { [index: string]: boolean } } };
  timeTable: Timetable;
  colors: { [plan: number]: string[] };
  isLoading: boolean;
  semester: string | null;
  currentPlan: number;
  plans: { [plan: number]: string }; // Plan number: Plan name mapping
}

interface CoursesAdded {
  [plan: number]: {
    [courseCode: string]: CourseDisplay
  }
}

interface ShowingPreview {
  [plan: number]: CourseDisplay[]
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
      colors: { 0: [...COLORS[0]] },
      isLoading: false,
      // The overall selected semester
      semester: "2025;1", // Default semester, can be changed later
      // The plan number of the timetable
      currentPlan: 0,
      // Plans that are created
      plans: { [DEFAULT_PLAN_NUMBER]: "Default Plan" },
    }
  },

  getters: {
    getTimeTable: (state) => {
      return state.timeTable[state.currentPlan]
    },
    getCourseCodeShowingPreview: (state) => {
      if (state.currentPlan in state.showingPreview) {
        return state.showingPreview[state.currentPlan].length > 0
          ? state.showingPreview[state.currentPlan][0].courseCode
          : null
      }
    },
    getCoursesAdded: (state) => {
      return { ...state.coursesAdded[state.currentPlan] }
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
      if (state.currentPlan in state.coursesAdded) {
        return Object.keys(state.coursesAdded[state.currentPlan])
          .reduce((prev, key) =>
            prev + parseInt(state.coursesAdded[state.currentPlan][key].au)
            , 0)
      } else {
        return 0
      }
    },
    getShowingIndex: (state) => {
      return (courseCode: string) => courseCode ? state.coursesAdded[state.currentPlan][courseCode].index : null
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
      state.savedPreviewIndexes[state.currentPlan]?.[state.currentPlan]
        ? Object.entries(state.savedPreviewIndexes[state.currentPlan][state.previewCourseCode || ""])
        : [],

    isIndexPreviewSaved: (state) => {
      return (index: string) => state.previewCourseCode && state.savedPreviewIndexes[state.currentPlan]?.[state.previewCourseCode]?.[index]
    },
    getPlans: (state) => {
      return Object.entries(state.plans).map(([planNumber, planName]) => ({
        planNumber: parseInt(planNumber),
        planName: planName
      }))
    },
    getCurrentPlan: (state) => {
      return {
        planNumber: state.currentPlan,
        planName: state.plans[state.currentPlan] || "Unnamed Plan"
      }
    },
  },

  actions: {
    setTimeTable() {
      if (!this.timeTable || !this.timeTable[this.currentPlan] || Object.keys(this.timeTable).length === 0) return;

      for (const courseCodeObj of Object.values(this.getTimeTable)) {
        if (!courseCodeObj) continue
        for (const timeTableItems of Object.values(courseCodeObj)) {
          if (timeTableItems) {
            for (const timeTableItem of timeTableItems) {
              if (!timeTableItem) continue
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
      if (!code || code.length !== 6) {
        return
      }
      if (this.calenderApi == null) {
        Notify.create({ message: "Calendar not ready!", color: "negative" })
        return
      }
      const courseCode = code.toUpperCase()
      const currentPlan = this.currentPlan

      const calendar = this.calenderApi?.getApi().view.calendar
      // check if already in timetable
      if (this.coursesAdded?.[currentPlan]?.[courseCode]) {
        Notify.create({ message: "Course already in timetable!", color: "negative" })
        return
      }
      // instantiate if needed
      // add initial value to coursesAdded (this is so that the right sidebar can show the course)
      (this.coursesAdded[currentPlan] ??= {})[courseCode] = {
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
        delete this.coursesAdded[currentPlan][courseCode]
        return null
      }

      // get a color for this course
      const backgroundColor = this.getRandomColor() || "#E65100";

      // store ids in state so its easier to delete later
      // instantiate
      (this.timeTable[this.currentPlan] ??= {})[courseCode] = {
        "lectures": [],
        "lessons": [],
      };

      // add the lecture slots for this course
      for (const classInfo of courseInfo.lectures) {
        const updateClassInfo = addTimetableProp(classInfo, false, backgroundColor)
        // updateClassInfo.borderColor = "white"
        console.log("Adding lecture", updateClassInfo)

        calendar.addEvent(updateClassInfo)
        this.timeTable[currentPlan][courseCode].lectures.push(updateClassInfo)
      }

      // add the first non-lecture slot for this course
      let addedIndex = ""
      for (const [index, indexSchedule] of Object.entries(courseInfo.lessons)) {
        for (const classInfo of indexSchedule) {
          const updateClassInfo = addTimetableProp(classInfo, false, backgroundColor)
          console.log("Adding lesson", updateClassInfo)
          calendar.addEvent(updateClassInfo)
          this.timeTable[currentPlan][courseCode].lessons.push(updateClassInfo)
        }
        addedIndex = index
        break
      }
      // update courses added state
      this.coursesAdded[currentPlan][courseCode] = {
        ...this.coursesAdded[currentPlan][courseCode],
        isLoading: false,
        courseName: courseInfo.courseName,
        index: addedIndex,
        backgroundColor: backgroundColor,
        courseCode: courseCode,
        au: courseInfo.au,
      }
    },
    addCustomEvent(selectInfo: DateSelectArg, name: string) {
      const currentPlan = this.currentPlan
      const calendar = this.calenderApi?.getApi().view.calendar
      // Add to custom events if needed
      let color = ""
      if (!(currentPlan in this.timeTable)) {
        this.timeTable[currentPlan] = {}
      }
      if (!(this.timeTable?.[currentPlan]?.["custom"]?.["events"])) {
        (this.timeTable[currentPlan] ??= {})["custom"] = {
          "events": []
        };
        color = this.getRandomColor()
      }
      else {
        color = this.coursesAdded[currentPlan].custom.backgroundColor
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
      this.timeTable[currentPlan].custom.events.push(event);
      (this.coursesAdded[currentPlan] ??= {})["custom"] = event;
      calendar.addEvent(event)

    },
    updateCustomEvent(event: EventImpl) {
      this.timeTable[this.currentPlan].custom?.events.forEach((e) => {
        if (e.id == event.id) {
          e.courseName = event.extendedProps.courseName
          e.start = event.startStr
          e.end = event.endStr
        }
      })
    },
    removeCourse(courseCode: string) {
      const currentPlan = this.currentPlan
      const calendar = this.calenderApi?.getApi().view.calendar
      if (!(currentPlan in this.timeTable) || !(courseCode in this.timeTable[currentPlan])) {
        // Notify.create("Unable to remove course")
        useToast().add({ title: "Unable to remove course", description: "Please check your timetable.", color: "error", });
        return
      }
      // remove from calendar
      if (courseCode != "custom") {
        if ('lectures' in this.timeTable[currentPlan][courseCode]) {
          for (const event of this.timeTable[currentPlan][courseCode]['lectures']) {
            calendar.getEventById(event.id).remove()
          }
          this.timeTable[currentPlan][courseCode]['lectures'] = []
        }
        if ('lessons' in this.timeTable[currentPlan][courseCode]) {
          for (const event of this.timeTable[currentPlan][courseCode]['lessons']) {
            calendar.getEventById(event.id).remove()
          }
          this.timeTable[currentPlan][courseCode]['lessons'] = []
        }
        if (currentPlan in this.showingPreview && this.showingPreview[currentPlan].length > 0) {
          // remove from showingPreview if showingPreview is the deleted coursecode
          if (courseCode == this.showingPreview[currentPlan][0].courseCode) {
            this.resetPreview()
            // reset all indexes
            this.previewIndexes = {}
          }
        }
      } else {
        if (this.timeTable[currentPlan].custom?.events) {
          for (const event of this.timeTable[currentPlan].custom.events) {
            calendar.getEventById(event.id)?.remove()
          }
        }
        delete this.timeTable[currentPlan][courseCode];
      }

      const colorUsed = this.coursesAdded[currentPlan][courseCode].backgroundColor
      this.returnColor(colorUsed)
      delete this.coursesAdded[currentPlan][courseCode]
    },

    async setPreview(courseCode: string) {
      if (!this.semester || !courseCode) {
        useToast().add({ title: "Please select a semester and course code", description: "Cannot set preview.", color: "error", });
        return
      }
      const scheduleStore = useSchedules()
      const currentPlan = this.currentPlan
      const calendar = this.calenderApi?.getApi().view.calendar
      const courseInfo = await scheduleStore.fetchCourseSchedule(this.semester, courseCode)
      const showing = this.coursesAdded[currentPlan][courseCode]
      const showingPreview = []

      this.resetPreview()

      if (courseInfo) {
        // track number of added preview events
        this.previewCourseCode = courseCode
        this.totalIndexCount = 0
        this.previewIndexes[showing.index] = true;
        (this.savedPreviewIndexes[currentPlan] ??= {})[courseCode] ??= {};
        for (const [index, indexSchedule] of Object.entries(courseInfo.lessons)) {
          this.totalIndexCount += 1
          if (index == showing.index) {
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
      this.showingPreview[currentPlan] = showingPreview
    },

    // Temp previews are maintain with the help of paginations
    async addTempPreviews(indexesToAdd: string[]) {
      const courseCode = this.getPreviewCourseCode
      const scheduleStore = useSchedules()
      const currentPlan = this.currentPlan
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
      const showing = this.coursesAdded[currentPlan][courseCode]

      if (courseInfo) {
        for (const indexToAdd of indexesToAdd) {
          for (const classInfo of courseInfo.lessons[indexToAdd]) {
            const previewEvent = addTimetableProp(classInfo, true, showing.backgroundColor)
            this.showingPreview[currentPlan].push(previewEvent)
            calendar.addEvent(previewEvent)
          }
          this.previewIndexes[indexToAdd] = true
          this.showingPreviewIndexCount += 1
        }
      }
    },

    // remove previews excluding saved ones from the timetable (used during the change in pages in preview list)
    removeTempPreviews(indexesToRemove: string[]) {
      const currentPlan = this.currentPlan
      if (!(currentPlan in this.showingPreview)) return
      const calendar = this.calenderApi?.getApi().view.calendar
      const indexesToRemoveSet = new Set(indexesToRemove)
      for (let i = this.showingPreview[currentPlan].length - 1; i >= 0; i--) {
        const event = this.showingPreview[currentPlan][i]
        // if the event is saved or showing
        if (!indexesToRemoveSet.has(event.index)) continue
        calendar.getEventById(event.id)?.remove()
        this.showingPreview[currentPlan].splice(i, 1)
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
      ((this.savedPreviewIndexes[this.currentPlan] ??= {})[this.previewCourseCode] ??= {})[indexToAdd] = true;
    },
    async removeFromSavePreview(indexToAdd: string, removeFromCalendar = false) {
      if (removeFromCalendar) this.removeTempPreviews([indexToAdd]);
      if (!this.previewCourseCode) {
        useToast().add({ title: "No course code selected", description: "Cannot remove saved preview.", color: "error", });
        return
      }
      if (this.savedPreviewIndexes[this.currentPlan]?.[this.previewCourseCode]?.[indexToAdd]) {
        delete this.savedPreviewIndexes[this.currentPlan][this.previewCourseCode][indexToAdd]
      }
    },
    // Remove all previews included saved ones
    resetPreview() {
      const currentPlan = this.currentPlan
      if (!(currentPlan in this.showingPreview)) return
      const calendar = this.calenderApi?.getApi().view.calendar
      for (const event of this.showingPreview[currentPlan]) {
        calendar.getEventById(event.id)?.remove()
      }
      this.showingPreview[currentPlan] = []
      this.previewIndexes = {}
      this.showingPreviewIndexCount = 1
      this.totalIndexCount = 0
      this.previewCourseCode = null
    },
    // swap two given indexes
    swapIndex(courseCode: string, newIndex: string) {
      if (!this.semester || !courseCode || !newIndex) {
        useToast().add({ title: "Please select a semester and course code", description: "Cannot swap index.", color: "error", });
        return
      }
      const currentPlan = this.currentPlan
      const calendar = this.calenderApi?.getApi().view.calendar
      // get event object of newIndex
      let newLessons: CourseDisplay[] = []
      console.log("Swapping index", courseCode, newIndex, "in plan", currentPlan)
      // get from schedule store and create the display object
      const scheduleStore = useSchedules()
      const parsedLessons = scheduleStore.getParsedCourseInfo(this.semester, courseCode, newIndex)
      console.log("Parsed lessons", parsedLessons)
      if (!parsedLessons) {
        Notify.create({ message: "Unable to swap index", color: "negative" })
        return
      }
      newLessons = parsedLessons.map(e => addTimetableProp(e, false, this.coursesAdded[currentPlan][courseCode].backgroundColor))
      console.log("New lessons", newLessons)
      // remove showingPreview
      this.resetPreview()

      // reset showingPreview properties
      newLessons.forEach(e => {
        e.isPreview = false
        e.classNames = ['lesson-body']
        e.groupId = null
      })
      // remove oldIndex
      for (const event of this.timeTable[currentPlan][courseCode]['lessons']) {
        calendar.getEventById(event.id).remove()
      }
      // add back to calendar
      const newEvents = []
      for (const event of newLessons) {
        calendar.addEvent(event)
        newEvents.push(event)
      }
      this.timeTable[currentPlan][courseCode]['lessons'] = newEvents
      // update added course index
      this.coursesAdded[currentPlan][courseCode].index = newIndex
    },
    // set the value of semester
    setSemester(semesterKey: string) {
      this.semester = semesterKey
    },
    // reset the calendar
    reset() {
      const calenderApi = this.calenderApi
      const savedPreviewIndexes = this.savedPreviewIndexes
      this.removeAllEvents()
      this.$reset()
      this.savedPreviewIndexes = savedPreviewIndexes
      if (calenderApi) {
        this.setCalendarApi(calenderApi)
      }
    },
    removeAllEvents() {
      const events = this.calenderApi?.getApi().view.calendar.getEvents()
      for (const event of events) {
        event.remove()
      }
    },
    // resize the calendar
    resize() {
      if (!this.calenderApi) return
      this.calenderApi.getApi().view.calendar.updateSize()
    },
    // Return back a color to the state
    returnColor(color: string) {
      this.colors[this.currentPlan].push(color)
    },
    // Get a random color from the state (placed here so it wont be called during store initiation?)
    getRandomColor(): string {
      const colorOptions = this.colors[this.currentPlan]
      const randomIndex = Math.floor(Math.random() * colorOptions.length)
      const color = colorOptions.at(randomIndex)
      colorOptions.splice(randomIndex, 1)
      return color || "#E65100" // fallback color
    },
    createNewPlan(planName: string) {
      let newPlanNumber = 0;
      for (let i = 0; i < 10; i++) {
        // Generate a random plan number
        newPlanNumber = Math.floor(Math.random() * 10000000)
        // Check if the plan number already exists
        if (newPlanNumber in this.plans) {
          continue
        }
      }
      if (newPlanNumber in this.plans) {
        useToast().add({ title: `Wow you are crazy lucky and you caught me. This will only occur with a ~10^-68% chance. Should have bought the lottery instead :(`, description: "Please try again.", color: "error", });
        return
      }
      // Initialise the new plan
      this.plans[newPlanNumber] = planName
      this.timeTable[newPlanNumber] = {}
      this.coursesAdded[newPlanNumber] = {}
      this.showingPreview[newPlanNumber] = []
      this.savedPreviewIndexes[newPlanNumber] = {}
      this.colors[newPlanNumber] = [...COLORS[0]]
      // Switch to the new plan
      this.switchPlans(newPlanNumber)
      useToast().add({ title: `New plan created: ${planName}`, description: "You can now add courses to this plan.", color: "primary", });
    },
    switchPlans(planNumber: number) {
      if (!(planNumber in this.plans)) {
        useToast().add({ title: "Plan does not exist", description: "Try again.", color: "error", });
        return
      }
      this.currentPlan = planNumber
      this.resetPreview()
      console.log("Removing all events from calendar")
      this.removeAllEvents()
      console.log("Setting timetable")
      this.setTimeTable()
    },
    deletePlan(planNumber: number) {
      if (!(planNumber in this.plans)) {
        return
      }
      if (planNumber === this.currentPlan) {
        useToast().add({ title: "Cannot delete current plan", description: "Please switch to another plan first.", color: "error", });
        return
      }
      // Remove the plan from all states
      const planName = this.plans[planNumber]

      delete this.plans[planNumber]
      delete this.timeTable[planNumber]
      delete this.coursesAdded[planNumber]
      delete this.showingPreview[planNumber]
      delete this.savedPreviewIndexes[planNumber]
      delete this.colors[planNumber]
      if (planNumber in this.previewIndexes) {
        this.resetPreview()
        this.switchPlans(DEFAULT_PLAN_NUMBER)
      }
      useToast().add({ title: `Plan ${planName} deleted`, description: "", color: "primary", });
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
    borderColor: '',
    textColor: 'white',
  })
}
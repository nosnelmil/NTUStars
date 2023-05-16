import { defineStore } from 'pinia'
import { useSchedules } from './schedules'

export const useTimetableStore = defineStore('timetable', {
  state: () => {
    return {
      preview: [],
      timeTable: [], // the one thats showing on the screen
      colors: ['red', 'pink', 'green', 'teal', 'blue', 'light-blue', 'cyan', 'deep-purple', 'orange'],
      isLoading: false
    }
  },
  
  getters: {
    getColor: (state) =>  {
      return state.colors.pop()
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
      const scheduleStore = useSchedules()
      const schedule = await scheduleStore.findCourseSchedule(semester, courseCode)
      if(!schedule) return null
      const color = this.getColor()
      for(const classInfo of schedule["Lecture"]){
        this.timeTable.push({
          isTemp: false,
          bgcolor: color,
          ...classInfo
        })
      }
      for(const [index, indexSchedule] of schedule){
        if(index == "Lecture") continue
        for(const classInfo of indexSchedule){
          this.timeTable.push({
            isTemp: false,
            bgcolor: color,
            ...classInfo
          })
        }
        break
      }
      console.log("Added Course Schedule")

    },
    returnColor(color){
      this.state.push(color)
    }
  }
})

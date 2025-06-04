import type { DBCourse } from "~/models/dbCourse"
import { getCurrentDay } from "./helper"
import type { ParsedCourse } from "~/models/parsedCourse"
import { TimeDict } from "~/constants/timeDict"
import { DayDict } from "~/constants/dayDict"
import type { DBLesson } from "~/models/dbLesson"
import type { ParsedLesson } from "~/models/parsedLesson"


export function parseCourseInfoFromDB(data: DBCourse) {
  const { schedule, courseName, courseCode, au } = data
  // instantiate result object
  const result: ParsedCourse = {
    lectures: [],
    lessons: {},
    courseName: courseName,
    courseCode: courseCode,
    au: au
  }
  // Prevent duplicate lectures from being added
  // check if lectures across indexes are the same or unique
  // idea is that lectures are designed to be the same across all indexes in NTU
  // if they are not, then we will treat them as unique lectures
  let lectureAdded = false
  let isUniqueLectures = false
  const lectureMap = new Map()
  for (const indexSchedule of Object.values(schedule)) {
    // Check if is a valid index object
    if (typeof indexSchedule !== "object" || indexSchedule.length === 0) continue;
    // cast indexSchedule as DBIndex 
    const castedIndexSchedule = indexSchedule as DBLesson[];

    for (const classData of castedIndexSchedule) {
      if (classData.type == "LEC/STUDIO") {
        const start = getCurrentDay(DayDict[classData.day]) + parseStartTime(classData.time)
        const end = getCurrentDay(DayDict[classData.day]) + parseEndTime(classData.time)
        if (!lectureAdded) {
          lectureMap.set(start, end)
        } else if (lectureMap.get(start) != end) {
          isUniqueLectures = true
          break
        }
      }
    }
    lectureAdded = true
    if (isUniqueLectures == true) {
      break
    }
  }
  lectureAdded = false
  for (const [index, indexSchedule] of Object.entries(schedule)) {
    for (let i = 0; i < indexSchedule.length; i++) {
      const classData = indexSchedule[i] as DBLesson
      // skip if have already added lecture classes
      if (lectureAdded && classData.type == "LEC/STUDIO" && !isUniqueLectures) continue;
      // create class info object (A class in an index)
      const classInfo: ParsedLesson = {
        id: `${courseCode} ${index} ${i}`,
        groupid: courseCode + index,
        courseName: courseName,
        courseCode: courseCode,
        index: index,
        type: classData.type,
        group: classData.group,
        venue: classData.venue,
        date: getCurrentDay(DayDict[classData.day]),
        weeks: classData.weeks.toString(),
        frequency: parseWeeks(classData.weeks),
        start: getCurrentDay(DayDict[classData.day]) + parseStartTime(classData.time),
        end: getCurrentDay(DayDict[classData.day]) + parseEndTime(classData.time),
      }
      // if its a lecture, remove unnecessary info
      if (classData.type == "LEC/STUDIO" && !isUniqueLectures) {
        classInfo.groupid = null
        classInfo.index = ""
        classInfo.group = ""
        result["lectures"].push(classInfo)
      } else {
        (result["lessons"][index] ??= []).push(classInfo)
      }
    }
    lectureAdded = true
  }
  return result
}

export function parseWeeks(weekArray: number[]) {
  // convert week array to meaningful text
  if (weekArray.length > 4) {
    if (weekArray.length > 8) {
      return "Every Week"
    } else {
      if (weekArray[0] % 2 == 0) {
        return "Even Week"
      } else {
        return "Odd Week"
      }
    }
  }
  return "Week " + weekArray.toString()
}

export function parseStartTime(timeArray: number[]) {
  // convert time array to required format
  return TimeDict[timeArray[0]]
}
export function parseEndTime(timeArray: number[]) {
  return TimeDict[timeArray[timeArray.length - 1] + 1]
}
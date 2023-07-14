import { getCurrentDay } from "./helper"

export function parseCourseInfoFromDB(data){
  const {schedule, courseName, courseCode, au} = data
  var result = {
    lectures: [],
    lessons: {},
    courseName: courseName,
    courseCode: courseCode,
    au: au
  }
  var lectureAdded = false
  for(const [index, indexSchedule] of Object.entries(schedule)){
    result[index] = []
    for(var i=0; i<indexSchedule.length; i++){
      const classData = indexSchedule[i]
      if(lectureAdded && classData.type == "LEC/STUDIO") continue;
      let classInfo = {
        id:  `${courseCode} ${index} ${i}`,
        groupid: courseCode+index,
        courseName: courseName,
        courseCode: courseCode,
        index: index,
        type: classData.type,
        group: classData.group,
        venue: classData.venue,
        date: getCurrentDay(Day[classData.day]),
        weeks: classData.weeks.toString(),
        frequency: parseWeeks(classData.weeks),
        start: getCurrentDay(Day[classData.day]) + parseStartTime(classData.time),
        end: getCurrentDay(Day[classData.day]) + parseEndTime(classData.time),
      }
      if(classData.type == "LEC/STUDIO"){
        classInfo.groupid = null
        classInfo.index = ""
        classInfo.group = ""
        result["lectures"].push(classInfo)
      }else{
        (result["lessons"][index] ??= []).push(classInfo)
      }
    }
    lectureAdded = true
  }
  return result
}

export function parseWeeks(weekArray){
  // convert week array to meaningful text
  if(weekArray.length > 4){
    if(weekArray.length > 8){
      return "Every Week"
    }else{
      if(parseInt(weekArray[0]) % 2 == 0){
        return "Even Week"
      }else{
        return "Odd Week"
      }
    }
  }
  return "Week " + weekArray.toString()
}

export function parseStartTime(timeArray){
  // convert time array to required format
  return timeDict[timeArray[0]]
}
export function parseEndTime(timeArray){
  return timeDict[timeArray[timeArray.length-1]+1]
}

const Day = {
	"MON": "1",
	"TUE": "2",
	"WED": "3",
	"THU": "4",
  "FRI": "5",
  "SAT": "6",
}
const timeDict = {
   0 : "T08:00:00",
   1 : "T08:30:00",
   2 : "T09:00:00",
   3 : "T09:30:00",
   4 : "T10:00:00",
   5 : "T10:30:00",
   6 : "T11:00:00",
   7 : "T11:30:00",
   8 : "T12:00:00",
   9 : "T12:30:00",
   10 : "T13:00:00",
   11 : "T13:30:00",
   12 : "T14:00:00",
   13 : "T14:30:00",
   14 : "T15:00:00",
   15 : "T15:30:00",
   16 : "T16:00:00",
   17 : "T16:30:00",
   18 : "T17:00:00",
   19 : "T17:30:00",
   20 : "T18:00:00",
   21 : "T18:30:00",
   22 : "T19:00:00",
   23 : "T19:30:00",
   24 : "T20:00:00",
   25 : "T20:30:00",
   26 : "T21:00:00",
   27 : "T21:30:00",
   28 : "T22:00:00",
   29 : "T22:30:00",
   30 : "T23:00:00",
   31 : "T23:30:00",
};
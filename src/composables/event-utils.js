let eventGuid = 0
let todayStr = "2023-05-01" // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    groupId: "group1",
    editable: false,
    courseName: 'Software engineering',
    courseCode: "SC2006",
    index: "10523",
    type: "TUT",
    group: "A21",
    venue: "venue",
    date: "2023-05-02",
    weeks: "1,2,3,4,566,4,6,4",
    frequency: "Every Week",
    isTemp: true,
    start: "2023-05-02" + 'T12:00:00',
    end: "2023-05-02" + 'T14:00:00',
    backgroundColor: 'red',
    borderColor: 'red',
    textColor: 'white',
    isHovered: false
  },
  {
    id: createEventId(),
    groupId: "group1",
    editable: false,
    courseName: 'Software engineering',
    courseCode: "SC2006",
    index: "10523",
    type: "TUT",
    group: "A21",
    venue: "venue",
    date: "2023-05-03",
    weeks: "1,2,3,4,566,4,6,4",
    frequency: "Every Week",
    isTemp: true,
    start: "2023-05-03" + 'T14:00:00',
    end: "2023-05-03" + 'T16:00:00',
    backgroundColor: 'red',
    borderColor: 'red',
    textColor: 'white',
    isHovered: false
  },
]

export function createEventId() {
  return String(eventGuid++)
}

// id:  `${courseCode} ${index} ${i}`,
// name: name,
// courseCode: courseCode,
// index: index,
// type: classData.type,
// group: classData.group,
// venue: classData.venue,
// date: this.getCurrentDay(Day[classData.day]),
// weeks: classData.weeks.toString(),
// frequency: this.parseWeeks(classData.weeks),
// time: this.parseTime(classData.time),
// duration: this.parseDuration(classData.time),
// // isTemp: false
// // TODO: add this in lesson store
// // bgcolor: 'red',
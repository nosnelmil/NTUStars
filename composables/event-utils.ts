let eventGuid = 0
// Event Model
// const INITIAL_EVENTS = [
//   {
//     id: createEventId(),
//     groupId: "group2",
//     editable: false,
//     courseName: 'Software engineering',
//     courseCode: "SC2006",
//     index: "10523",
//     type: "TUT",
//     group: "A21",
//     venue: "venue",
//     date: "2023-05-02",
//     weeks: "1,2,3,4,566,4,6,4",
//     frequency: "Every Week",
//     start: "2023-05-02" + 'T12:00:00',
//     end: "2023-05-02" + 'T14:00:00',
//     backgroundColor: '#5C6BC0',
//     borderColor: 'red',
//     textColor: 'white',
//     isPreview: false,
//     classNames: []
//   }
// ]

export function createEventId(): string {
  return String(eventGuid++)
}

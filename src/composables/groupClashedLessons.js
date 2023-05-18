import {
  addToDate,
  parsed,
  parseTime
} from '@quasar/quasar-ui-qcalendar/src/QCalendarDay.js'

export function groupClashedLessons(lessons) {
  // add start and end time
  addStartandEndTime(lessons)

  // Sort the lessons by start time
  const sortedlessons = [...lessons].sort((a, b) => a.startTime - b.startTime);

  // Create a graph where each node represents a booking
  // and an edge connects two nodes if the lessons clash
  const graph = sortedlessons.map((booking, i) => {
    const clashes = [];
    for (let j = i + 1; j < sortedlessons.length; j++) {
      if (booking.endTime >= sortedlessons[j].startTime) {
        clashes.push(j);
      } else {
        break;
      }
    }
    return clashes;
  });

  // Apply DFS to identify connected components
  const visited = new Set();
  const groups = [];
  for (let i = 0; i < sortedlessons.length; i++) {
    if (!visited.has(i)) {
      const group = [];
      const stack = [i];
      while (stack.length > 0) {
        const node = stack.pop();
        if (!visited.has(node)) {
          visited.add(node);
          group.push(node);
          stack.push(...graph[node]);
        }
      }
      groups.push(group);
    }
  }

  // Group lessons in each connected component together
  const clashedGroups = groups.map((group) => {
    return group.map((i) => sortedlessons[i]);
  });

  return clashedGroups;
}

function addStartandEndTime(lessons){
  for(var i=0; i<lessons.length; i++){
    const lesson = lessons[i]
    lesson.startTime = parseInt(lesson.time)
    lesson.endTime = parseInt(lesson.time) + lesson.duration
  }
}
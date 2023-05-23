<template>
  <div class="subcontent">
    <div class="row justify-center">
      <div class="col-12 col-md-10 q-pa-md bg-secondary" style="max-height: 90vh;overflow-y: scroll;">
        <FullCalendar ref="calendar" :options="calendarOptions"> 
          <template v-slot:eventContent='{event: {extendedProps}}' class="lighten">
            <div class="text-left q-pa-xs" style="height: 100%;">
                <div class="text-bold ellipsis">
                  {{ extendedProps.courseCode }} <span >{{ extendedProps.courseName }}</span>
                </div>
                <div class="calendar-body-text"> {{ extendedProps.index }}</div>
                <div class="calendar-body-text">{{ extendedProps.type }} | {{ extendedProps.frequency }}</div>
              <q-tooltip v-if="!extendedProps.isPreview">
                <div>{{ extendedProps.courseCode }}</div>
                <div>{{ extendedProps.courseName }}</div>
                <div>Type: {{ extendedProps.type }}</div>
                <div v-if="extendedProps.index">Index: {{ extendedProps.index }}</div>
                <div v-if="extendedProps.group">Group: {{ extendedProps.group }}</div>
                <div>Venue: {{ extendedProps.venue }}</div>
                <div> Weeks: {{ extendedProps.weeks }}</div>
              </q-tooltip>
            </div>
          </template>
        </FullCalendar>
      </div>
    </div>
  </div>
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from '@/composables/event-utils'
import { onMounted, ref } from 'vue'
import { useTimetableStore } from '../stores/timetable'
const timetableStore = useTimetableStore()
const calendar = ref(null);

const calendarOptions = ref({
  plugins: [
    timeGridPlugin,
    interactionPlugin // needed for dateClick
  ],
  headerToolbar: false,
  views: {
    timeGridSixDay: {
      type: 'timeGrid',
      duration: { days:6 }
    }
  },
  height: 1000,
  expandRows: true,
  dayHeaderFormat: { weekday: 'short' },
  initialDate: new Date("2023-05-01"),
  initialView: 'timeGridSixDay',
  initialEvents: [], // alternatively, use the `events` setting to fetch from a feed
  slotMinTime: "08:00:00",
  slotMaxTime: "23:30:00",
  allDaySlot: false,
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  select: handleDateSelect,
  eventsSet: handleEvents,
  eventMouseEnter: handleMouseEnter,
  eventMouseLeave: handleMouseLeave,
  eventClick: handleEventClick,
})

const currentEvents = ref(null)

onMounted(() => {
  timetableStore.setCalendarApi(calendar)
})

function handleDateSelect(selectInfo) {
  let title = prompt('Please enter a new title for your event')
  let calendarApi = selectInfo.view.calendar

  calendarApi.unselect() // clear date selection

  if (title) {
    calendarApi.addEvent({
      id: createEventId(),
      groupId: "group2",
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
      backgroundColor: '#5C6BC0',
      borderColor: 'red',
      textColor: 'white',
      isPreview: false,
      classNames: [],
      start: selectInfo.startStr,
      end: selectInfo.endStr,
    })
  }
}

function handleEventClick(clickInfo) {
  const event = clickInfo.event
  const courseCode = event.extendedProps.courseCode

  if(event.extendedProps.isPreview){
    // swap index
    const index = event.extendedProps.index
    timetableStore.swapIndex(courseCode, index)
    return
  }
    
  if(timetableStore.getCourseCodeShowingPreview == courseCode){
    timetableStore.resetPreview()
  }else{
    timetableStore.setPreview(courseCode)
  }
  
}
function handleEvents(events) {
  currentEvents.value = events
}
function handleMouseEnter(mouseEnterInfo){
  let event = mouseEnterInfo.event
  if(event.extendedProps.isPreview){
    event.setProp( "classNames", ['lesson-body','no-lighten'])
  }
}
function handleMouseLeave(mouseLeaveInfo){
  let event = mouseLeaveInfo.event
  if(event.extendedProps.isPreview){
    event.setProp( "classNames", ['lesson-body','lighten'] )
  }
}
</script>


<style scoped>
.calendar-body-text{
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 10px;
}
</style>

<style>
.lighten{
  filter: brightness(0.7);
  transition: filter .1s linear;
}
.no-lighten{
  filter: brightness(1);
  transition: filter .1s linear;
}
.lesson-body{
  cursor: pointer;
  transition: all 0.2s ease-out;
  box-shadow: 0px;
  top: 0px;
}
.lesson-body:hover{
  box-shadow: 0px 4px 8px rgba(38, 38, 38, 0.2);
  top: -4px;
  border: 1px solid #cccccc;
}
</style>
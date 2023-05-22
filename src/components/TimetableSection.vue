<template>
  <div class="subcontent">
    <div class="row justify-center">
      <div class="col-12 col-md-10">
        <FullCalendar ref="calendar" :options="calendarOptions"> 
          <template v-slot:eventContent='{event: {extendedProps}}' class="lighten">
            <div class="text-left q-pa-xs" style="height: 100%;">
                <div class="text-bold ellipsis">
                  {{ extendedProps.courseCode }} <span >{{ extendedProps.courseName }}</span>
                </div>
                <div class="calendar-body-text"> {{ extendedProps.index }}</div>
                <div class="calendar-body-text">{{ extendedProps.type }} | {{ extendedProps.frequency }}</div>
              <q-tooltip>
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
  dayHeaderFormat: { weekday: 'short' },
  initialDate: new Date("2023-05-01"),
  initialView: 'timeGridSixDay',
  initialEvents: [], // alternatively, use the `events` setting to fetch from a feed
  slotMinTime: "08:30:00",
  slotMaxTime: "23:00:00",
  allDaySlot: false,
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  select: handleDateSelect,
  eventsSet: handleEvents,
  eventMouseEnter: handleMouseEnter,
  eventMouseLeave: handleMouseLeave,
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
      title,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay
    })
  }
}
function test(){
  console.log("fired")
}
function handleEventClick(clickInfo) {
  console.log("clicked", clickInfo)
  // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
  //   clickInfo.event.remove()
  // }
}
function handleEvents(events) {
  currentEvents.value = events
}
function handleMouseEnter(mouseEnterInfo){
  let event = mouseEnterInfo.event
  if(event.extendedProps.isTemp){
    event.setProp( "classNames", ['no-lighten'])
  }
}
function handleMouseLeave(mouseLeaveInfo){
  let event = mouseLeaveInfo.event
  if(event.extendedProps.isTemp){
    event.setProp( "classNames", ['lighten'] )
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
</style>
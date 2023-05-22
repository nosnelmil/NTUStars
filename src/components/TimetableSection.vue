<template>
  <div class="subcontent">
    <div class="row justify-center">
      <div class="col-12 col-md-10">
        <FullCalendar :options="calendarOptions"> 
          <template v-slot:eventContent='arg'>
          <!-- <b>{{ arg.timeText }}</b> -->
          <!-- <i>{{ arg.event.title }}</i> -->
          <div
            :class="[{'lighten': arg.event.extendedProps.isTemp && !arg.event.extendedProps.isHovered}]"
            :style="`text-white bg-${ arg.event.extendedProps.bgcolor }`"
            @mouseover="hoveredIndex = arg.event.extendedProps.index"
          >
          {{ arg.event.extendedProps.extendedProps }}
            <div class="text-left q-pa-xs">
                <div class="text-bold ellipsis">
                  {{ arg.event.extendedProps.courseCode }} <span >{{ arg.event.extendedProps.name }}</span>
                </div>
                <div class="calendar-body-text"> {{ arg.event.extendedProps.index }}</div>
                <div class="calendar-body-text">{{ arg.event.extendedProps.type }} | {{ arg.event.extendedProps.frequency }}</div>
              <q-tooltip v-if="!arg.event.extendedProps.isTemp">
                <div>Type: {{ arg.event.extendedProps.type }}</div>
                <div v-if="arg.event.extendedProps.index">Index: {{ arg.event.extendedProps.index }}</div>
                <div v-if="arg.event.extendedProps.group">Group: {{ arg.event.extendedProps.group }}</div>
                <div>Venue: {{ arg.event.extendedProps.venue }}</div>
                <div> Weeks: {{ arg.event.extendedProps.weeks }}</div>
              </q-tooltip>
            </div>
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
import { ref } from 'vue'

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
  initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
  slotMinTime: "08:30:00",
  slotMaxTime: "23:00:00",
  allDaySlot: false,
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventsSet: handleEvents,
  eventMouseEnter: handleMouseEnter,
  eventMouseLeave: handleMouseLeave,
})

const currentEvents = ref(null)

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
  let calendarApi = mouseEnterInfo.view.calendar

  const groupEvents = calendarApi.getEvents().filter((e) => e.groupId == mouseEnterInfo.event.groupId)
  for(const event of groupEvents){
    event.setProp( "className", [] )
  }
}
function handleMouseLeave(mouseLeaveInfo){
  let calendarApi = mouseLeaveInfo.view.calendar

  const groupEvents = calendarApi.getEvents().filter((e) => e.groupId == mouseLeaveInfo.event.groupId)
  for(const event of groupEvents){
    event.setProp( "className", ['lighten'] )
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

.lighten{
  filter: brightness(0.7);
}

.lighten:hover{
  filter: brightness(1)
}

</style>
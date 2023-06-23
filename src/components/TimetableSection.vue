<template>
  <div class="subcontent">
    <div class="row justify-center">
      <div class="col-12 col-md-10 q-pa-md bg-body">
        <FullCalendar ref="calendar" :options="calendarOptions"> 
          <template v-slot:eventContent='{event: {extendedProps}}' class="lighten">
            <div class="text-left q-pa-xs" style="height: 100%;">
                <div class="text-bold ellipsis">
                  {{ extendedProps.courseCode }} <span >{{ extendedProps.courseName }}</span>
                </div>
                <div class="calendar-body-text"> {{ extendedProps.index }}</div>
                <div v-if="extendedProps.type" class="calendar-body-text">{{ extendedProps.type }} | {{ extendedProps.frequency }}</div>
              <q-tooltip v-if="!(Object.keys(extendedProps).length == 0)">
                <div>{{ extendedProps.courseCode }}</div>
                <div>{{ extendedProps.courseName }}</div>
                <div v-if="extendedProps.type"> Type: {{ extendedProps.type }}</div>
                <div v-if="extendedProps.index"> Index: {{ extendedProps.index }}</div>
                <div v-if="extendedProps.group"> Group: {{ extendedProps.group }}</div>
                <div v-if="extendedProps.venue">Venue: {{ extendedProps.venue }}</div>
                <div v-if="extendedProps.weeks"> Weeks: {{ extendedProps.weeks }}</div>
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
import { onMounted, ref, watch } from 'vue'
import { useTimetableStore } from '../stores/timetable'
import { useQuasar } from 'quasar'
import EventFormDialog from './EventFormDialog.vue'
const timetableStore = useTimetableStore()
const calendar = ref(null)
const $q = useQuasar()

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
  eventDrop: (e) => timetableStore.updateCustomEvent(e.event),
  eventResize: (e) => timetableStore.updateCustomEvent(e.event),
})

const currentEvents = ref(null)

onMounted(() => {
  timetableStore.setCalendarApi(calendar)
  timetableStore.setTimeTable()
})

function handleDateSelect(selectInfo) {
  let calendarApi = selectInfo.view.calendar
  if(!timetableStore.getSemester){
    calendarApi.unselect() 
    $q.notify({
      type: "negative",
      message: 'Please select a semester!'
    })
    return
  }
  $q.dialog({
    component: EventFormDialog,
    componentProps:{},
    persistent: true
  }).onOk(data => {
  
    calendarApi.unselect() // clear date selection
  
    timetableStore.addCustomEvent(selectInfo, data.name)
  })
}

function handleEventClick(clickInfo) {
  const event = clickInfo.event
  const courseCode = event.extendedProps.courseCode
  if(event.extendedProps.isCustom){
    $q.dialog({
      title: 'Edit Event Name',
      message: 'Edit Name',
      prompt: {
        model: event.extendedProps.courseName,
        type: 'text' // optional
      },
      cancel: true,
      persistent: true
    }).onOk(data => {
      event.setExtendedProp("courseName", data)
      timetableStore.updateCustomEvent(event)
    }).onCancel(() => {
      // console.log('>>>> Cancel')
    }).onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    })
  }

  if(event.extendedProps.isPreview){
    // swap index
    const index = event.extendedProps.index
    timetableStore.swapIndex(courseCode, index)
    return
  }
    
  if(timetableStore.getCourseCodeShowingPreview == courseCode){
    timetableStore.resetPreview()
    // remove floating animation

  }else{
    timetableStore.setPreview(courseCode)
    // add floating animation
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
.floating { 
    animation-name: floating;
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
}
 
@keyframes floating {
    0% { transform: translate(0,  0px); }
    50%  { transform: translate(0, -5px); }
    100%   { transform: translate(0, 0px); }   
}
</style>
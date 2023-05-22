<template>
  <FullCalendar :options="calendarOptions" />
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data() {
    return {
      calendarOptions: {
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
        weekends: true,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents
      } 
    }
  }
}
</script>

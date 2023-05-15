<template>
  <div class="row justify-center">
    <div class="col-12 col-md-10">
      <q-calendar-day
        ref="calendar"
        v-model="selectedDate"
        view="week"
        :weekdays="[1,2,3,4,5,6]"
        animated
        bordered
        transition-next="slide-left"
        transition-prev="slide-right"
        @change="onChange"
        @moved="onMoved"
        @click-date="onClickDate"
        @click-time="onClickTime"
        @click-interval="onClickInterval"
        @click-head-intervals="onClickHeadIntervals"
        @click-head-day="onClickHeadDay"
      />
    </div>
  </div>
</template> 

<script setup>
import { QCalendarDay, today } from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarDay.sass'

import { ref } from 'vue'

const calendar = ref(null)
const selectedDate = today()
function onMoved(data){
  console.log('onMoved', data)
}
function onClickDate(data){
  console.log('onClickDate', data)
}
function onClickTime(data){
  console.log('onClickTime', data)
}
function onClickInterval(data){
  console.log('onClickInterval', data)
}
function onClickHeadIntervals(data){
  console.log('onClickHeadIntervals', data)
}
function onClickHeadDay(data){
  console.log('onClickHeadDay', data)
}


// methods: {
//   onToday () {
//     this.$refs.calendar.moveToToday()
//   },
//   onPrev () {
//     this.$refs.calendar.prev()
//   },
//   onNext () {
//     this.$refs.calendar.next()
//   },
//   onMoved (data) {
//     console.log('onMoved', data)
//   },
//   onChange (data) {
//     console.log('onChange', data)
//   },
//   onClickDate (data) {
//     console.log('onClickDate', data)
//   },
//   onClickTime (data) {
//     console.log('onClickTime', data)
//   },
//   onClickInterval (data) {
//     console.log('onClickInterval', data)
//   },
//   onClickHeadIntervals (data) {
//     console.log('onClickHeadIntervals', data)
//   },
//   onClickHeadDay (data) {
//     console.log('onClickHeadDay', data)
//   }
// }
</script>
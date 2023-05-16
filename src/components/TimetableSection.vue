<template>
  <div class="subcontent">
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
          no-active-date
          :interval-minutes="30"
          :interval-start="16"
          :interval-count="32"
          :interval-height="40"
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-time="onClickTime"
          @click-interval="onClickInterval"
          @click-head-intervals="onClickHeadIntervals"
          @click-head-day="onClickHeadDay"
        >
        <!-- TODO: make interval-count dynamic -->
          <template #head-day-event="{ scope: { timestamp } }">
            <div style="display: flex; justify-content: center; flex-wrap: wrap; padding: 2px;">
              <template 
                v-for="lesson in lessonsMap[timestamp.date]" 
                :key="lesson.id">
                <q-badge
                    v-if="!temp"
                    :class="badgeClasses(lesson, 'header')"
                    :style="badgeStyles(lesson, 'header')"
                    style="width: 10px; cursor: pointer; height: 12px; font-size: 10px; margin: 1px;"
                  >
                    <q-tooltip>{{ lesson.time + ' - ' + lesson.details }}</q-tooltip>
                  </q-badge>
              </template>
            </div>
          </template>

          <template #day-body="{ scope: { timestamp, timeStartPos, timeDurationHeight } }">
            <template
              v-for="lesson in getEvents(timestamp.date)"
              :key="lesson.id"
            >
              <div
                v-if="lesson.time !== undefined"
                class="my-lesson"
                :class="[{'lighten': lesson.isTemp}, lesson.class]"
                :style="Object.assign({}, badgeStyles(lesson, 'body', timeStartPos, timeDurationHeight), lesson.style)"
              >
                <div class="text-left q-pa-xs">
                    <div class="text-bold ellipsis">
                      {{ lesson.courseCode }} <span >{{ lesson.name }}</span>
                    </div>
                    <div class="calendar-body-text"> {{ lesson.index }}</div>
                    <div class="calendar-body-text">{{ lesson.type }}</div>
                    <div class="calendar-body-text">{{ lesson.frequency }}</div>
                  <q-tooltip v-if="!lesson.isTemp">
                    <div>Type: {{ lesson.type }}</div>
                    <div>Index: {{ lesson.index }}</div>
                    <div>Group: {{ lesson.group }}</div>
                    <div>Venue: {{ lesson.venue }}</div>
                    <div>Weeks: {{ lesson.weeks }}</div>
                  </q-tooltip>
                </div>
              </div>
            </template>
          </template>
        </q-calendar-day>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  QCalendarDay,
  addToDate,
  parseTimestamp,
  parseDate,
} from '@quasar/quasar-ui-qcalendar/src/QCalendarDay.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarDay.sass'

import { computed, ref } from 'vue'

// The function below is used to set up our demo data
const CURRENT_DAY = new Date("2023-05-01")
function getCurrentDay (day) {
  const newDay = new Date(CURRENT_DAY)
  newDay.setDate(day)
  const tm = parseDate(newDay)
  return tm.date
}

const calendar = ref(null)
const selectedDate = "2023-05-01"
const lessons = [
  {
    id: 'SC2006' + '10686' + '0',
    name: "Software Engineering",
    courseCode: 'SC2006',
    index: '10686',
    type: "LEC/STUDIO",
    group: "L1",
    venue: "LT2A",
    date: getCurrentDay(2),
    weeks: [1,2,3,4,5,6,7,8],
    frequency:"Every Week",
    time: '10:00',
    duration: 59,
    bgcolor: 'red',
    isTemp: false
  },
  {
    id: 'SC2006' + '10686' + '10',
    name: "Software Engineering",
    courseCode: 'SC2006',
    index: '10686',
    type: "LEC/STUDIO",
    group: "L1",
    venue: "LT2A",
    date: getCurrentDay(2),
    weeks: "1,2,3,4,5,6,7,8",
    frequency:"Every Week",
    time: '10:00',
    duration: 59,
    bgcolor: 'red',
    isTemp: false
  },
  {
    id: 'SC2006' + '10686' + '1',
    name: "Software Engineering",
    courseCode: 'SC2006',
    index: '10686',
    type: "LEC/STUDIO",
    group: "L1",
    venue: "LT2A",
    date: getCurrentDay(4),
    weeks: "1,2,3,4,5,6,7,8",
    frequency:"Every Week",
    time: '10:00',
    duration: 59,
    bgcolor: 'red',
    isTemp: false
  },
  {
    id: 'SC2006' + '10686' + '2',
    name: "Software Engineering",
    courseCode: 'SC2006',
    index: '10686',
    type: "TUT",
    group: "L1",
    venue: "TR+9",
    date: getCurrentDay(1),
    weeks: "1,2,3,4,5,6,7,8",
    frequency:"Every Week",
    time: '08:30',
    duration: 59,
    bgcolor: 'red',
    isTemp: true
  },
]

// convert the lessons into a map of lists keyed by date
const lessonsMap = computed(() => {
  const map = {}
  // this.lessons.forEach(lesson => (map[ lesson.date ] = map[ lesson.date ] || []).push(lesson))
  lessons.forEach(lesson => {
    if (!map[ lesson.date ]) {
      map[ lesson.date ] = []
    }
    map[ lesson.date ].push(lesson)
    if (lesson.days) {
      let timestamp = parseTimestamp(lesson.date)
      let days = lesson.days
      do {
        timestamp = addToDate(timestamp, { day: 1 })
        if (!map[ timestamp.date ]) {
          map[ timestamp.date ] = []
        }
        map[ timestamp.date ].push(lesson)
      } while (--days > 0)
    }
  })
  return map
})

function badgeClasses (lesson, type) {
  const isHeader = type === 'header'
  return {
    [ `text-white bg-${ lesson.bgcolor }` ]: true,
    'full-width': !isHeader && (!lesson.side || lesson.side === 'full'),
    'left-side': !isHeader && lesson.side === 'left',
    'right-side': !isHeader && lesson.side === 'right',
    'rounded-border': true
  }
}
function badgeStyles (lesson, type, timeStartPos = undefined, timeDurationHeight = undefined) {
  const s = {}
  if (timeStartPos && timeDurationHeight) {
    s.top = timeStartPos(lesson.time) + 'px'
    s.height = timeDurationHeight(lesson.duration) + 'px'
  }
  s[ 'align-items' ] = 'flex-start'
  return s
}
function getEvents (dt) {
  // get all lessons for the specified date
  const lessons = lessonsMap.value[ dt ] || []
  let eventLen = lessons.length
  for(var i =0; i<eventLen; i++){
    const lesson = lessons[i]
    lesson.class = {
      [ `text-white bg-${ lesson.bgcolor }`]: true, 
      'rounded-border': true
    }
    lesson.style = {
      'left': `${100/eventLen*i}%`,
      'width': `${(100-eventLen)/eventLen}%`,
    }
  }
  return lessons
}
function onMoved (data) {
  console.log('onMoved', data)
}
function onChange (data) {
  console.log('onChange', data)
}
function onClickDate (data) {
  console.log('onClickDate', data)
}
function onClickTime (data) {
  console.log('onClickTime', data)
}
function onClickInterval (data) {
  console.log('onClickInterval', data)
}
function onClickHeadIntervals (data) {
  console.log('onClickHeadIntervals', data)
}
function onClickHeadDay (data) {
  console.log('onClickHeadDay', data)
}
</script>

<style lang="sass" scoped>
.my-lesson
  position: absolute
  font-size: 12px
  justify-content: center
  margin: 0 1px
  text-overflow: ellipsis
  overflow: hidden
  cursor: pointer

.title
  position: relative
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  height: 100%

.calendar-body-text
  text-overflow: ellipsis
  overflow: hidden
  white-space: nowrap
  font-size: 10px

.lighten
  filter: brightness(0.7)

.lighten:hover
  filter: brightness(1)

</style>
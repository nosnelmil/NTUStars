<template>
  <div class="subcontent">
    <div class="row justify-center">
      <div style="display: flex; width: 1200px; height:600px; ">
        <q-calendar-day
          v-model="selectedDate"
          view="week"
          :weekdays="[1,2,3,4,5,6]"
          bordered
          no-active-date
          :interval-minutes="30"
          :interval-start="16"
          :interval-count="32"
          :interval-height="30"
        >
        <!-- TODO: make interval-count dynamic -->
          <template #head-day-event="{ scope: { timestamp } }">
            <div style="display: flex; justify-content: center; flex-wrap: wrap; padding: 2px;">
              <template 
                v-for="lesson in lessonsMap[timestamp.date]" 
                :key="lesson.id">
                <q-badge
                    v-if="!lesson.isTemp"
                    :class="badgeClasses(lesson, 'header')"
                    :style="badgeStyles(lesson, 'header')"
                    style="width: 10px; cursor: pointer; height: 12px; font-size: 10px; margin: 1px;"
                  >
                    <q-tooltip>{{ lesson.time + ' - ' + lesson.type }}</q-tooltip>
                  </q-badge>
              </template>
            </div> 
          </template> 
          

          <template #day-body="{ scope: {timestamp, timeStartPos, timeDurationHeight }}">
              <template
                v-for="lesson in getEvents(timestamp.date)"
                :key="lesson.id"
              >
                <div
                  v-if="lesson.time !== undefined"
                  class="my-lesson"
                  :class="[{'lighten': lesson.isTemp}, lesson.class]"
                  :style="Object.assign({}, badgeStyles(lesson, 'body', timeStartPos, timeDurationHeight), lesson.style)"
                  @click="handleLessonClick(lesson, lesson.isTemp)"
                  @mouseover="hoveredIndex = lesson.index" @mouseleave="hoveredIndex = null"
                >
                  <div class="text-left q-pa-xs">
                      <div class="text-bold ellipsis">
                        {{ lesson.courseCode }} <span >{{ lesson.name }}</span>
                      </div>
                      <div class="calendar-body-text"> {{ lesson.index }}</div>
                      <div class="calendar-body-text">{{ lesson.type }} | {{ lesson.frequency }}</div>
                    <q-tooltip v-if="!lesson.isTemp">
                      <div>Type: {{ lesson.type }}</div>
                      <div v-if="lesson.index">Index: {{ lesson.index }}</div>
                      <div v-if="lesson.group">Group: {{ lesson.group }}</div>
                      <div>Venue: {{ lesson.venue }}</div>
                      <div> Weeks: {{ lesson.weeks }}</div>
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

} from '@quasar/quasar-ui-qcalendar/src/QCalendarDay.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarDay.sass'

import { computed, ref } from 'vue'
import { useTimetableStore } from '../stores/timetable'
import { watch } from 'vue'
import { groupClashedLessons } from '@/composables/groupClashedLessons.js'
const dates = ["2023-05-01","2023-05-02","2023-05-03","2023-05-04","2023-05-05","2023-05-06"]
const timetableStore = useTimetableStore()
const calendar = ref(null)
const selectedDate = "2023-05-01"
const lessonsMap = ref({})
const lessons = timetableStore.getLessons
const showingPreview = ref(null)
const hoveredIndex = ref(null)

function handleLessonClick(lesson, isTemp){
  // if temp, swap showing index
  if(showingPreview.value == lesson.courseCode){
    timetableStore.resetPreview()
    showingPreview.value = null 
  }else{
    timetableStore.setPreview(lesson.courseCode, lesson.index)
    showingPreview.value = lesson.courseCode
  }
}

// convert the lessons into a map of lists keyed by date 
watch(() => timetableStore.getLessons, (newLessons,) => {
  console.log("called")
  const clone = newLessons.map(a=> {return {...a}})
  const map = {}
  // this.lessons.forEach(lesson => (map[ lesson.date ] = map[ lesson.date ] || []).push(lesson))
  clone.forEach(lesson => {
    if (!map[ lesson.date ]) {
      map[ lesson.date ] = []
    }
    map[ lesson.date ].push(lesson)
  })
  lessonsMap.value = map
},{ deep: true , immediate: true})

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
  console.log("getevent called")
  // get all lessons for the specified date
  const lessons = lessonsMap.value[ dt ] || []
  const groups = groupClashedLessons(lessons)
  for(const group of groups){
    const groupLen = group.length
    for(var i=0; i<groupLen; i++){
      const lesson = group[i]
      lesson.class = {
        [ `text-white bg-${ lesson.bgcolor }`]: true, 
        'rounded-border': true
      }
      lesson.style = {
        'left': `${100/groupLen*i}%`,
        'width': `${(100-groupLen)/groupLen}%`,
      }
    }
  }
  return lessons
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
<template>
  <q-list class="rounded-borders" style="width: 100%;">
    <q-item-label header>Courses</q-item-label>
      <template 
        v-if="Object.keys(timetableStore.getCoursesAdded).length > 0"
        v-for="course in Object.values(timetableStore.getCoursesAdded)"
        :key="course.courseCode"
      >
        <SelectedListItem :course="course" @handle-remove="(e) => handleRemove(course)"/>
        <q-separator spaced />
      </template>
      <template v-else>
        <q-item clickable>
          <q-item-section>
            <q-item-label class="row item-center" lines="1">
              <span class="text-weight-medium">No Course Selected</span>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced />
      </template>
  </q-list>
</template>

<script setup>
import { useTimetableStore } from '../stores/timetable';
import SelectedListItem from './SelectedListItem.vue';

const timetableStore = useTimetableStore()
function handleRemove(course){
  timetableStore.removeCourse(course.courseCode)  
}

</script>
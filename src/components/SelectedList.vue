<template>
  <q-list class="rounded-borders" style="width: 100%;">
    <q-item-label header>Courses</q-item-label>
      <template 
        v-for="course in Object.values(timetableStore.getCoursesAdded)"
        :key="course.courseCode"
      >
        <SelectedListItem :course="course" @handle-remove="handleRemove"/>
        <q-separator spaced />
      </template>
    

  </q-list>
</template>

<script setup>
import { useTimetableStore } from '../stores/timetable';
import SelectedListItem from './SelectedListItem.vue';

const timetableStore = useTimetableStore()
function handleRemove(course){
  console.log("remove course: ", course)
}

</script>
<template>
  <q-list class="rounded-borders" style="width: 100%;">
    <div class="row justify-between items-center q-my-sm">
      <q-item-label header>Courses</q-item-label>
      <SelectPlanBar />
    </div>
    <template v-if="Object.keys(timetableStore.getCoursesAdded).length > 0">
      <template 
      v-for="course in Object.values(timetableStore.getCoursesAdded)"
        :key="course.courseCode"
      >
        <SelectedListItem 
          :course="course"
          @handle-swap-index="({index}) => timetableStore.swapIndex(course.courseCode, index)"
          @handle-remove="() => handleRemove(course)" />
        <q-separator spaced />
      </template>
      <q-item-label header>
        Total AU: 
        <span v-if="timetableStore.getTotalAus">
          {{ timetableStore.getTotalAus}}
        </span>
        <span v-else class="text-grey-8 q-gutter-xs">
          <q-spinner color="primary" size="1em" :thickness="1" />
        </span>
      </q-item-label>
    </template>
      <template v-else>
        <q-item>
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
import { useTimetableStore } from '~/stores/timetable';
import SelectedListItem from './SelectedListItem.vue';
import SelectPlanBar from './SelectPlanBar.vue';

const timetableStore = useTimetableStore()

function handleRemove(course){
  timetableStore.removeCourse(course.courseCode)  
}


</script>
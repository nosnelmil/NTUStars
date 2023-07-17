<template>
  <div class="col-12 col-md-10 q-pa-md" v-if="timetableStore.previewIndexes && timetableStore.totalIndexCount > 0">
    <div class="text-h6">Indexes:</div>
    <div class="text-overline"> 
      Total Indexes: {{ timetableStore.totalIndexCount }} | 
      Showing {{ timetableStore.showingPreviewIndexCount }} / 
      {{ timetableStore.maxShowingIndex > timetableStore.totalIndexCount ? timetableStore.totalIndexCount : timetableStore.maxShowingIndex }}</div>
    <div class="flex flex-center">
      <div class="q-gutter-xs">
        <q-chip 
          v-for="[index, value] of Object.entries(showingPreviewIndexes)"
          :disable="timetableStore.getShowingIndex(timetableStore.getPreviewCourseCode) == index"
          @update:selected="(nextState) => onChipClicked(nextState, index)"
          :selected="value"
          :key="index"
          color="primary" 
          text-color="white">
          {{index}}
        </q-chip>
      </div>
      <q-pagination
        v-model="currentPage"
        :max="numberOfPages"
        :max-pages="6"
        boundary-numbers
        direction-links
      />
    </div>
  </div>
</template>

<script setup>
import { useTimetableStore } from '@/stores/timetable.js'
import { computed, ref } from 'vue'

const timetableStore = useTimetableStore()
const MAX_PER_PAGE = 20
const numberOfPages = computed(() => Object.keys(timetableStore.previewIndexes).length / MAX_PER_PAGE)
const currentPage = ref(1)
const showingPreviewIndexes = computed(() => 
  splice(
    timetableStore.previewIndexes, 
    (currentPage.value-1) * MAX_PER_PAGE,
    currentPage.value * MAX_PER_PAGE))

function onChipClicked(nextState, index){
  if(nextState){
    // add preview
    timetableStore.addPreview(index)
  }else{
    // remove preview
    timetableStore.removePreview(index)
  }
}

function splice(object, lowerLimit, upperLimit) {
  var newObj = {};

  if (!upperLimit) { upperLimit = 1 }
  Object.entries(object).forEach(function([key, item], index) {

    if (index >= lowerLimit && index < upperLimit) {
      newObj[key] = item
    }
  })
  return newObj;
}
</script>

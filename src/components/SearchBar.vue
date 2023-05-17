<template>
  <div class="q-gutter-md row items-start">
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <q-input
        v-model="search"
        label="Course Code"
        debounce="500"
        filled
        :loading="isLoading"
        placeholder="Search"
        hint="Try searching SC1006"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-btn label="Add Course" type="submit" color="primary"/>
    </q-form>
  </div>
  <!-- <q-btn @click="timetableStore.testAddCourse()">
    test add
  </q-btn> -->
</template>

<script setup>
import { ref } from 'vue';
import { useTimetableStore } from '../stores/timetable.js'

const isLoading = ref(false)
const timetableStore = useTimetableStore()
const search = ref(null)
async function onSubmit(){
  if(!search.value) return
 
  isLoading.value = true;
  await timetableStore.addCourse("2022;2", search.value) 
  isLoading.value = false
}
</script>
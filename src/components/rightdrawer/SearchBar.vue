<template>
  <div class="row items-start">
    <q-form
      ref="form"
      @submit="onSubmit"
      @reset="onReset"
    >
      <q-input
        v-model="search"
        label="Enter Course Code"
        debounce="500"
        filled
        :loading="isLoading"
        placeholder="Search"
        :hint="isLoading ? 'Searching for a new course code might take awhile' : 'Try searching SC1005'"
        lazy-rules
        :rules="[ val => validateCourseCode(val) || 'Please enter a valid course code']"
      >
        <template v-slot:append>
          <!-- <q-icon name="search" /> -->
          <q-btn flat icon="search" @click="form.submit()" />
        </template>
      </q-input>
    </q-form>
  </div>
  <!-- <q-btn @click="timetableStore.testAddCourse()">
    test add
  </q-btn> -->
</template>

<script setup>
import { ref } from 'vue';
import { useTimetableStore } from '@/stores/timetable.js'
import { validateCourseCode } from '@/composables/validator.js'

const form = ref(null)
const isLoading = ref(false)
const timetableStore = useTimetableStore()
const search = ref(null)
async function onSubmit(){
  if(!search.value) return
  isLoading.value = true;
  const searchVal = search.value.trim()
  await timetableStore.addCourse(searchVal) 
  isLoading.value = false
  search.value = null
  form.value.reset()
}
</script>
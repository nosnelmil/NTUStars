<template>
  <div class="row items-start">
    <q-form ref="form" class="full-width" @submit="onSubmit">
      <q-input v-model="search" label="Enter Course Code" debounce="500" filled clearable dense
        :color="settingsStore.darkMode ? 'white' : 'primary'" :loading="isLoading" placeholder="Search"
        :hint="isLoading ? 'Searching for a new course code might take awhile' : 'Try searching SC1005'" lazy-rules
        :rules="[val => validateCourseCode(val) || 'Please enter a valid course code']">
        <template #append>
          <q-btn flat icon="search" @click="form.submit()" />
        </template>
      </q-input>
    </q-form>
  </div>
</template>

<script setup>
import { useTimetableStore } from '@/stores/timetable.js'
import { useSettingsStore } from '@/stores/settings.js'
import { validateCourseCode } from '@/composables/validator.js'

const form = ref(null)
const isLoading = ref(false)
const timetableStore = useTimetableStore()
const settingsStore = useSettingsStore()
const search = ref(null)
async function onSubmit() {
  if (!search.value) return
  isLoading.value = true;
  const searchVal = search.value.trim()
  await timetableStore.addCourse(searchVal)
  isLoading.value = false
  search.value = null
  form.value.reset()
}
</script>
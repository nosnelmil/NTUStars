<template>
  <div class="row items-start full-width q-px-sm full-width">
    <q-select
      ref="select"
      v-model="search"
      name="courseSearch"
      dense
      filled
      clearable
      dropdown-icon="none"
      input-debounce="0"
      use-input
      fill-input
      hide-selected
      :options="options"
      hide-bottom-space
      autocomplete="off"
      hint="Course Code"
      class="full-width"
      new-value-mode="add-unique"
      @new-value="(val) => onSubmit(val)"
      @filter="(val, done, abort) => handleSearchChange(val, done, abort)"
      @update:model-value="(val) => {
        if (val) {
          console.log('Enter pressed, submitting search:', val)
          onSubmit()
        }
      }"
    >
      <template #no-option>
        <q-item>
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script setup lang="ts">
import { useTimetableStore } from '~/stores/timetable.js'
import {Charset, Index, type SearchOptions} from "flexsearch"
import { QSelect, type QForm } from 'quasar'

const form = ref<QForm | null>(null)
const select = ref<QSelect | null>(null)
const isLoading = ref(false)
const timetableStore = useTimetableStore()
const search = ref<string | null>(null)
const options = ref<string[]>([])

const searchOptions: SearchOptions = {
  limit: 10,
  suggest: true,
}

const index = new Index({
  tokenize: "tolerant",
  context: true,
  encoder: Charset.Default
})

onMounted(async () => {
  // Initialize the index with some course codes
  isLoading.value = true
  const courseNames = await useSchedules().fetchSearchableCourses()
  if (!courseNames || courseNames.length === 0) {
    isLoading.value = false
    return
  }
  for (const course of courseNames) {
    const [courseCode, ] = course.split(' ', 1)
    index.add(course, courseCode)
  }
  isLoading.value = false
})

function handleSearchChange(value: string, done: (callbackFn: () => void, afterFn?: ((ref: QSelect) => void) | undefined) => void, abort: () => void) {
  console.log('Search input changed:', value)
  isLoading.value = true
  const searchValue = String(value).trim().toUpperCase()
  try {
    const result = index.search(searchValue, searchOptions)
    const newOptions = result.map((item) => {
      return item.toString()
    })
    done(() => {
      options.value = newOptions
    });

  } catch (error) {
    console.error('Error searching for course:', error)
    abort()
  } finally {
    isLoading.value = false
  } 
}


async function onSubmit(val: string | null = null) {
  console.log('onSubmit called with value:', val)
  if ((!search.value || search.value == "") && !val ) return
  isLoading.value = true;

  let searchVal = ""
  if (val) {
    searchVal = val
  }else if (search.value) {
    searchVal = search.value.trim()
  } else {
    console.warn('No search value provided')
    isLoading.value = false
    return
  }
  if (searchVal.length > 6) {
    searchVal = searchVal.slice(0, 6).toUpperCase()
  } else {
    searchVal = searchVal.toUpperCase()
  }
  console.log('Submitting search:', searchVal)
  await timetableStore.addCourse(searchVal)
  isLoading.value = false
  select.value?.hidePopup()
  search.value = null
  if (form.value){
    form.value.reset()
  }
}
</script>
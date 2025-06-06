<template>
 <q-select 
    v-model="model" 
    label="Semesters"
    filled 
    :color="settingsStore.darkMode ? 'white' : 'primary'"
    :options="options" 
    :hint="isLoadingSems ? 'Retrieving available semesters from NTU...' : 'Available semesters are from NTU'"
    @filter="filterFn"
    @update:model-value="handleSemSelect"
  >
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey">
          No results
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import { useSchedules } from '@/stores/schedules';
import { useTimetableStore } from '@/stores/timetable';
import { useSettingsStore } from '@/stores/settings';

const schedulesStore = useSchedules()
const settingsStore = useSettingsStore()
const isLoadingSems = ref(false)
const model = ref(null)
const options = ref(null)

async function filterFn(_, update,){
  console.info("Retrieving semesters...")
  if(options.value !== null){
    update()
    return
  }
  isLoadingSems.value = true
  await schedulesStore.fetchSemesters()

  update(() => {
    options.value = schedulesStore.getSemesters
    isLoadingSems.value = false
  })
}

function handleSemSelect(){
  useTimetableStore().setSemester(model.value.value)
}
</script>
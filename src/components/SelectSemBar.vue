<template>
 <q-select 
    v-model="model" 
    label="Semesters"
    filled 
    :options="options" 
    @filter="filterFn"
    @update:model-value="handleSemSelect"
    :error="isError"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          No results
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import { ref, onMounted} from 'vue'
import { useSchedules } from '../stores/schedules';
import { useTimetableStore } from '../stores/timetable';

const props = defineProps(["isError"])
const schedulesStore = useSchedules()
const isLoadingSems = ref(false)
const model = ref(null)
const options = ref(null)

async function filterFn(val, update, abort){
  if(options.value !== null){
    update()
    return
  }
  await schedulesStore.findSemesters()
  update(() => {
    options.value = schedulesStore.getSemesters
  })
}

function handleSemSelect(){
  useTimetableStore().setSemester(model.value.value)
}
</script>
<template>
  <div class="q-pa-md">
    <q-stepper
      v-model="step"
      ref="stepper"
      color="primary"
      animated
      flat
    >
      <q-step
        :name="1"
        title="Select Semester"
        :done="step > 1"
      >
        <q-select v-model="model" :options="schedulesStore.getSemesters" filled label="Semesters" />
      </q-step>

      <q-step
        :name="2"
        title=""
        :done="step > 2"
      >
        <div class="row justify-center q-mb-md">
          <SearchBar/>
        </div>
        <q-separator spaced />
        <SelectedList />
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn v-if="step == 1" @click="$refs.stepper.next()" color="primary" label="Continue" />
          <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<script setup>
import { ref, onMounted} from 'vue'
import SearchBar from './SearchBar.vue';
import SelectedList from './SelectedList.vue';
import { useSchedules } from '../stores/schedules';

const schedulesStore = useSchedules()
const step = ref(1)
const model = ref(null)
const options = schedulesStore.getSemesters
const isLoadingSems = ref(true)
onMounted(async () => {
  isLoadingSems.value = true
  schedulesStore.findSemesters()
  isLoadingSems.value = false
})
</script>
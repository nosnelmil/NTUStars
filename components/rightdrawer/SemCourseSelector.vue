<template>
  <div class="q-mx-md">
    <div class="q-pa-sm">
      <q-toolbar class="rounded-borders">
        <q-toolbar-title class="text-center text-weight-bold">
          {{ title }}
        </q-toolbar-title>
      </q-toolbar>
    </div>
    <div class="row justify-center q-mb-md full-width">
      <SearchBar />
    </div>
   
    <q-separator spaced />
    <SelectedList />
    <q-btn flat icon="refresh" class="q-ml-auto text-capitalize q-mb-md" label="reset" @click="handleReset" />
  </div>
</template>

<script setup lang="ts">
import { Dialog } from 'quasar';
import SearchBar from './SearchBar.vue';
import SelectedList from './SelectedList.vue';
import { useTimetableStore } from '~/stores/timetable';

const timetableStore = useTimetableStore()
const title = computed(() => timetableStore.getSemesterProperName)

function handleReset() {
  Dialog.create({
    title: 'Reset Timetable',
    message: 'This will reset your current timetable and remove all selected courses. Are you sure you want to proceed?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    timetableStore.reset()
  })
}
</script>
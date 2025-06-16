<template>
<div class="subcontent">
  <div class="row justify-center">
    <TimetableSection />
  </div>
  <div class="row justify-center q-mt-sm">
    <q-btn 
      v-if="!!useTimetableStore().getCourseCodeShowingPreview"
      class="text-capitalize"
      label="View Other Indexes"
      @click="useSettingsStore().leftDrawerOpen = true"
      />
  </div>
</div>
</template>

<script setup>
import TimetableSection from "@/components/TimetableSection.vue"
import { useSettingsStore } from "../stores/settings";
import { useTimetableStore } from "../stores/timetable";

</script>
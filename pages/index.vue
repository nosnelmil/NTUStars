
<template>
<div class="">
  <div class="row justify-center">
    <TimetableSection />
  </div>
    <UButton
      v-if="!!useTimetableStore().getCourseCodeShowingPreview"
      class="text-capitalize"
      label="View Other Indexes"
      @click="useSettingsStore().leftDrawerOpen = true"
      />
  </div>
</template>

<script setup lang="ts">
import { UButton } from "#components";
import { useSettingsStore } from "../stores/settings";
import { useTimetableStore } from "../stores/timetable";

</script>
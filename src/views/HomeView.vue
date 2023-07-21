<template>
<div class="subcontent">
  <div class="row justify-center">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5236923194604774"
        crossorigin="anonymous"></script>
    <!-- Banner -->
    <ins class="adsbygoogle"
        style="display:block"
        data-ad-client="ca-pub-5236923194604774"
        data-ad-slot="4766952076"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    <script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
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
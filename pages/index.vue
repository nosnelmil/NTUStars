<template>
  <div class="subcontent">
    <div class="row justify-center" >
      <TimetableSection v-if="semester != null" />
      <div v-else class="flex flex-center items-center q-pt-xl" style="width: 100%; height:calc(100vh - 110px);">
        <div class="q-pa-md">
          <div class="row justify-center">
            <q-avatar class="welcome-logo" size="120px">
              <img src="~/assets/NTUStars-logo.png">
            </q-avatar>
          </div>
          <h3 class="text-h4 text-center brand-font q-mb-md">Welcome to NTU Stars!</h3>
          <p class="text-body1 text-center text-grey-8 rounded-borders q-mb-lg">
            Please select a semester to get started with planning your timetable
          </p>
          <div class="welcome-selector">
            <RightdrawerSelectSemBar />
          </div>
        </div>
        <!-- Supporters -->
         <div class="q-mt-auto full-width q-mb-lg" >
           <SupportersSection class="q-mx-auto" style="max-width: 70%;"/>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTimetableStore } from "../stores/timetable";

const semester = computed(() => useTimetableStore().getSemester)



</script>


<style scoped>
.welcome-logo {
  transition: transform 0.3s ease;
}

.welcome-logo:hover {
  transform: translateY(-5px);
}

.welcome-selector {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}
</style>
<template>
  <q-layout view="hHh LpR fff">
    <HeaderSection 
      @toggle-right-drawer="rightDrawerOpen = !rightDrawerOpen"
      @toggle-help-modal="helpDialogOpen = !helpDialogOpen"
    />

    <q-drawer 
      show-if-above 
      v-model="rightDrawerOpen" 
      side="right" 
      bordered 
      class="col items-start" 
      @show="useTimetableStore().resize()"
      @hide="useTimetableStore().resize()"> 
      <DrawerStepper />
    </q-drawer>

    <q-dialog v-model="helpDialogOpen">
      <HelpStepper @handle-finish="helpDialogOpen = false"/>
    </q-dialog>

    <q-page-container>
      <RouterView />
    </q-page-container>

    <FooterSection />

  </q-layout>
</template>

<script setup>
import { ref} from 'vue'
import { RouterView } from 'vue-router'
import { useTimetableStore } from './stores/timetable';
import HeaderSection from './components/layout/HeaderSection.vue';
import FooterSection from './components/layout/FooterSection.vue';
import HelpStepper from './components/HelpStepper.vue';
import DrawerStepper from './components/DrawerStepper.vue';

const rightDrawerOpen = ref(false)
const helpDialogOpen = ref(true)

</script>

<style scoped>
.title{
  cursor: pointer;
}
</style>
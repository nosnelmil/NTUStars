<template>
  <q-layout view="hhh LpR fff">
    <q-header class="bg-primary text-white">
      <HeaderSection 
        @toggle-right-drawer="rightDrawerOpen = !rightDrawerOpen"
        @toggle-help-modal="helpDialogOpen = !helpDialogOpen"
      />
    </q-header>

    <q-drawer 
      show-if-above
      v-model="leftDrawerOpen" 
      side="left" 
      bordered 
      @show="useTimetableStore().resize()"
      @hide="useTimetableStore().resize()"> 
      <ChangeLogList />
    </q-drawer>

    <q-drawer 
      show-if-above
      v-model="rightDrawerOpen" 
      side="right" 
      bordered 
      @show="useTimetableStore().resize()"
      @hide="useTimetableStore().resize()"> 
      <DrawerStepper />
    </q-drawer>



    <q-dialog v-model="helpDialogOpen">
      <HelpStepper @handle-finish="helpDialogOpen = !helpDialogOpen"/>
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
import { useSettingsStore } from './stores/settings';
import HeaderSection from './components/layout/HeaderSection.vue';
import FooterSection from './components/layout/FooterSection.vue';
import HelpStepper from './components/HelpStepper.vue';
import DrawerStepper from './components/DrawerStepper.vue';
import ChangeLogList from './components/changelogs/ChangeLogList.vue';


const rightDrawerOpen = ref(false)
const leftDrawerOpen = ref(true)
const helpDialogOpen = ref(useSettingsStore().getInitalHelpModalState)

</script>

<style scoped>
.title{
  cursor: pointer;
}
</style>
<template>
  <q-layout view="hhh LpR fFf">

    <q-header class="bg-primary text-white">
      <q-toolbar>
        <!-- <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" /> -->

        <q-toolbar-title class="brand-font">
          <q-avatar class="q-mb-xs">
            <img :src="NTUStarsIcon">
          </q-avatar>
            NTU Stars
        </q-toolbar-title>

        <!-- <q-toggle
          v-model="leftDrawerOpen"
          checked-icon="cresent"
          color="dark"
          unchecked-icon="dark"
          @update:model-value="toggleDarkMode"
        /> -->
        <q-btn dense flat label="Help" @click="leftDrawerOpen = !leftDrawerOpen"/>
        <q-btn dense flat round icon="menu" @click="toggleRightDrawer"  class="q-ml-xs"/>
      </q-toolbar>
    </q-header>

    <q-drawer 
      show-if-above 
      v-model="leftDrawerOpen" 
      side="left" 
      bordered
      @show="useTimetableStore().resize()"
      @hide="useTimetableStore().resize()"
    >
      <HelpStepper @handle-finish="leftDrawerOpen = false"/>
      <div v-if="leftDrawerOpen" class="absolute" style="top: 15px; right: -17px">
        <q-btn
          dense
          round
          unelevated
          color="primary"
          icon="chevron_left"
          @click="leftDrawerOpen = false"
        />
      </div>
    </q-drawer>

    <q-drawer 
      show-if-above 
      v-model="rightDrawerOpen" 
      side="right" 
      bordered 
      class="col items-start" 
      @show="useTimetableStore().resize()"
      @hide="useTimetableStore().resize()"> 
      <DrawerStepper />
      
      <!-- <div class="row justify-center q-mt-lg q-mb-md">
        <SearchBar/>
      </div>
      <q-separator spaced />
      <SelectedList /> -->
    </q-drawer>

    <q-page-container>
      <RouterView />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, nextTick} from 'vue'
import { RouterView } from 'vue-router'
import SearchBar from './components/SearchBar.vue'
import SelectedList from './components/SelectedList.vue';
import { useTimetableStore } from './stores/timetable';
import DrawerStepper from './components/DrawerStepper.vue';
import { useQuasar } from 'quasar'
import NTUStarsIcon from '@/assets/NTUStars-icon.png'
import HelpStepper from './components/HelpStepper.vue';

const rightDrawerOpen = ref(false)
const leftDrawerOpen = ref(false)
const $q = useQuasar()
const darkMode = ref($q.dark.isActive)
function toggleRightDrawer () {
  rightDrawerOpen.value = !rightDrawerOpen.value
}
function toggleDarkMode(){
  $q.dark.toggle()
}

</script>

<style>
/* .body--light {
  background-color: #edf2f4;
} */
</style>
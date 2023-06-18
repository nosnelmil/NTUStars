<template>
  <q-layout view="hhh LpR fFf">

    <q-header class="bg-primary text-white">
      <q-toolbar>
        <!-- <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" /> -->

        <q-toolbar-title class="brand-font">
          <span class="title" @click="leftDrawerOpen = !leftDrawerOpen">
            <q-avatar class="q-mb-xs">
              <img :src="NTUStarsIcon">
            </q-avatar>
              NTU Stars
          </span>
        </q-toolbar-title>
        <q-btn flat dense class="q-mr-xs text-capitalize" label="Courses" :to="'/courses'"/>
        <q-separator color="white" inset spaced dark/>
        <!-- <q-toggle
          v-model="leftDrawerOpen"
          checked-icon="cresent"
          color="dark"
          unchecked-icon="dark"
          @update:model-value="toggleDarkMode"
        /> -->
        <q-btn dense flat label="Help" @click="helpDialog = !helpDialog" class="text-capitalize"/>
        <q-btn dense flat round icon="menu" @click="toggleRightDrawer"  class="q-ml-xs"/>
      </q-toolbar>
    </q-header>

    <!-- <q-drawer 
      show-if-above 
      v-model="leftDrawerOpen" 
      side="left" 
      bordered
      @show="useTimetableStore().resize()"
      @hide="useTimetableStore().resize()"
    >
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
    </q-drawer> -->

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

    <q-dialog v-model="helpDialog">
      <HelpStepper @handle-finish="helpDialog = false"/>
    </q-dialog>

    <q-page-container>
      <RouterView />
    </q-page-container>

    <q-footer>
      <q-toolbar class="align-center">
        <q-toolbar-title shrink class="text-subtitle2">
          Developed by Lenson
        </q-toolbar-title>
        <q-btn stretch color="primary" class="text-capitalize" icon="article" href='https://forms.gle/4CV1ZiXkRS87P8cT9' target="_blank" label=""/>
        <q-space/>
        <q-btn stretch color="primary" class="text-capitalize" icon="article" href='https://forms.gle/4CV1ZiXkRS87P8cT9' target="_blank" label="Feedback"/>
        <q-btn color="primary" class="text-capitalize" icon="bug_report" href='https://forms.gle/4jCSpWpvMUuWLBzh7' target="_blank" label="Bug Report"/>
      
        <!-- <q-btn dense flat label="Help" @click="leftDrawerOpen = !leftDrawerOpen" class="text-capitalize"/> -->
        <!-- <q-btn dense flat round icon="menu" @click="toggleRightDrawer"  class="q-ml-xs"/> -->
      </q-toolbar>
    </q-footer>

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
const helpDialog = ref(true)
function toggleRightDrawer () {
  rightDrawerOpen.value = !rightDrawerOpen.value
}
function toggleDarkMode(){
  $q.dark.toggle()
}

</script>

<style scoped>
.title{
  cursor: pointer;
}
/* .body--light {
  background-color: #edf2f4;
} */
</style>
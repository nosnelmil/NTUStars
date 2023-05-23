<template>
  <q-layout view="hhh LpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <!-- <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" /> -->

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          Title
        </q-toolbar-title>

        <q-toggle
          v-model="darkMode"
          checked-icon="cresent"
          color="dark"
          unchecked-icon="dark"
          @update:model-value="toggleDarkMode"
        />
        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <!-- <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered mini>
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

const rightDrawerOpen = ref(false)
const $q = useQuasar()
const darkMode = ref($q.dark.isActive)
function toggleRightDrawer () {
  rightDrawerOpen.value = !rightDrawerOpen.value
}
function toggleDarkMode(){
  $q.dark.toggle()
}

</script>
<template>
  <q-toolbar>
    <q-toolbar-title class="brand-font">
      <q-btn flat class="title" :to="'/'">
        <q-avatar class="q-mb-xs q-mr-xs">
          <q-img :src="NTUStarsIcon" height="30px" fit="contain"/>
        </q-avatar>
          NTU Stars
      </q-btn >
    </q-toolbar-title>
    <!-- <q-btn stretch dense flat class="q-px-md text-capitalize" label="Courses" @click="$q.notify({message:'Page under construction!'})"/> -->
    <q-btn stretch dense flat label="changes" @click="toggleChangesModal" class="text-capitalize q-px-md"/>
    <q-btn stretch dense flat label="Help" @click="toggleHelpModal" class="text-capitalize q-px-md"/>
    <DetailsSearchBar class="q-mr-md"/>
    <q-btn 
      dense
      flat 
      round
      class="text-capitalize gt-xs" 
      icon="svguse:icons.svg#github" 
      href='https://github.com/Lebarnon/NTUStars' 
      target="_blank" />
    <q-toggle
        v-model="darkMode"
        color="black"
        checked-icon="dark_mode"
        unchecked-icon="brightness_5"
        @update:model-value="onDarkModeToggle"
    />
    <q-btn v-if="showRightDrawer" stretch dense flat icon="menu" @click="toggleRightDrawer"  class="q-px-md"/>
  </q-toolbar>
</template>

<script setup>
import NTUStarsIcon from '@/assets/NTUStars-icon.png'
import DetailsSearchBar from './DetailsSearchBar.vue';
import { useSettingsStore } from '../../stores/settings';
import { ref } from 'vue'
const settingsStore = useSettingsStore()
const props = defineProps(['showRightDrawer'])
const emits = defineEmits(['toggleHelpModal', 'toggelRightDrawer', 'toggleChangesModal'])

const darkMode = ref(settingsStore.darkMode)

function onDarkModeToggle(){
  darkMode.value.val = settingsStore.toggelDarkMode()
}

function toggleHelpModal(){
  emits("toggleHelpModal")
}
function toggleRightDrawer(){
  emits("toggleRightDrawer")
}
function toggleChangesModal(){
  emits("toggleChangesModal")
}
</script>
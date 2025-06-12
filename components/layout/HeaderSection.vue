<template>
  <q-toolbar>
    <q-toolbar-title class="brand-font">
      <q-btn flat class="title" :to="'/'">
        <q-avatar class="q-mb-xs q-mr-xs">
          <q-img :src="NTUStarsIcon" height="30px" fit="contain" />
        </q-avatar>
        NTU Stars
      </q-btn>
    </q-toolbar-title>
    <DetailsSearchBar v-if="timetableStore.getSemester != null" class="q-mr-md" />
    <q-btn class="text-capitalize q-px-md" stretch dense flat label="changes" @click="toggleChangesModal" />
    <q-btn class="text-capitalize q-px-md" stretch dense flat label="Help" @click="toggleHelpModal" />
    <q-toggle
      v-model="darkMode" color="black" checked-icon="dark_mode" unchecked-icon="brightness_5"
      @update:model-value="onDarkModeToggle" />
    <q-btn v-if="showRightDrawer" class="q-px-md" stretch dense flat icon="menu" @click="toggleRightDrawer" />
  </q-toolbar>
</template>

<script setup>
import NTUStarsIcon from '@/assets/NTUStars-icon.png'
import DetailsSearchBar from './DetailsSearchBar.vue';
import { useSettingsStore } from '../../stores/settings';
const settingsStore = useSettingsStore()
const timetableStore = useTimetableStore()
const emits = defineEmits(['toggleHelpModal', 'toggleRightDrawer', 'toggleChangesModal'])

defineProps({
  showRightDrawer: {
    type: Boolean,
    default: false
  }
})

const darkMode = ref(settingsStore.darkMode)

function onDarkModeToggle() {
  darkMode.value = settingsStore.toggelDarkMode()
}

function toggleHelpModal() {
  emits("toggleHelpModal")
}
function toggleRightDrawer() {
  emits("toggleRightDrawer")
}
function toggleChangesModal() {
  emits("toggleChangesModal")
}


</script>
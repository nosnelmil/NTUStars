<template>
  <q-toolbar>
    <q-toolbar-title class="brand-font">
      <q-btn flat class="title" :to="'/'">
        <q-avatar class="q-mb-xs">
          <img :src="NTUStarsIcon">
        </q-avatar>
          NTU Stars
      </q-btn >
    </q-toolbar-title>
    <!-- <q-btn stretch dense flat class="q-px-md text-capitalize" label="Courses" @click="$q.notify({message:'Page under construction!'})"/> -->
    <q-btn stretch dense flat label="Changes" @click="toggleLeftDrawer" class="text-capitalize q-px-md"/>
    <q-btn stretch dense flat label="Help" @click="toggleHelpModal" class="text-capitalize q-px-md"/>
    <DetailsSearchBar class="q-mr-md"/>
    <q-btn v-if="showRightDrawer" stretch dense flat icon="menu" @click="toggleRightDrawer"  class="q-px-md"/>
  </q-toolbar>
</template>

<script setup>
import NTUStarsIcon from '@/assets/NTUStars-icon.png'
import DetailsSearchBar from './DetailsSearchBar.vue';

const props = defineProps(['showRightDrawer'])
const emits = defineEmits(['toggleHelpModal', 'toggelRightDrawer', 'toggleLeftDrawer'])

function toggleHelpModal(){
  emits("toggleHelpModal")
}
function toggleRightDrawer(){
  emits("toggleRightDrawer")
}
function toggleLeftDrawer(){
  emits("toggleLeftDrawer")
}
</script>
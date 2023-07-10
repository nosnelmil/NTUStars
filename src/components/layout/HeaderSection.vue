<template>
  <q-toolbar>
    <!-- <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" /> -->

    <q-toolbar-title class="brand-font">
      <span class="title">
        <q-avatar class="q-mb-xs">
          <img :src="NTUStarsIcon">
        </q-avatar>
          NTU Stars
      </span>
    </q-toolbar-title>
    <!-- <q-btn stretch dense flat class="q-px-md text-capitalize" label="Courses" :to="'/courses'"/> -->
    <q-btn stretch dense flat class="q-px-md text-capitalize" label="Courses" @click="$q.notify({message:'Page under construction!'})"/>
    <q-btn stretch dense flat label="Help" @click="toggleHelpModal" class="text-capitalize q-px-md"/>
    <q-btn stretch dense flat icon="menu" @click="toggleRightDrawer"  class="q-px-md"/>
  </q-toolbar>
</template>

<script setup>
import NTUStarsIcon from '@/assets/NTUStars-icon.png'

const emits = defineEmits(['toggleHelpModal', 'toggelRightDrawer'])

function toggleHelpModal(){
  emits("toggleHelpModal")
}
function toggleRightDrawer(){
  emits("toggleRightDrawer")
}
</script>
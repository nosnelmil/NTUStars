<template>
  <q-layout view="hHh LpR fff">
    <q-header class="bg-primary text-white">
      <HeaderSection 
        @toggle-right-drawer="rightDrawerOpen = !rightDrawerOpen"
        @toggle-help-modal="helpDialogOpen = !helpDialogOpen"
        @toggle-left-drawer="toggleLeftDrawer"
        :show-right-drawer="showRightDrawer"
      />
    </q-header>

    <q-drawer 
      v-model="settingsStore.leftDrawerOpen" 
      side="left" 
      bordered 
      @show="useTimetableStore().resize()"
      @hide="useTimetableStore().resize()"
      > 
      <!-- <ChangeLogList /> -->
      <PreviewListSection />
      <div class="q-mini-drawer-hide absolute" style="top: 15px; right: -17px">
        <q-btn
          dense
          round
          unelevated
          color="accent"
          icon="chevron_left"
          @click="toggleLeftDrawer"
        />
      </div>
    </q-drawer>

    <q-drawer 
      show-if-above
      v-model="rightDrawerOpen" 
      side="right" 
      bordered 
      @show="useTimetableStore().resize()"
      @hide="useTimetableStore().resize()"> 
      <SemCourseSelector />
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
import { RouterView, useRoute } from 'vue-router'
import { useTimetableStore } from './stores/timetable';
import { useSettingsStore } from './stores/settings';
import HeaderSection from './components/layout/HeaderSection.vue';
import FooterSection from './components/layout/FooterSection.vue';
import HelpStepper from './components/HelpStepper.vue';
import SemCourseSelector from './components/rightdrawer/SemCourseSelector.vue';
import ChangeLogList from './components/changelogs/ChangeLogList.vue';
import { watch } from 'vue';
import { onMounted } from 'vue';
import PreviewListSection from './components/preview/PreviewListSection.vue';

const settingsStore = useSettingsStore()
const rightDrawerOpen = ref(false)
const helpDialogOpen = ref(useSettingsStore().getInitalHelpModalState)
const showRightDrawer = ref(true)
const route = useRoute()

onMounted(() => {
  settingsStore.setSettings()
})

watch(() => route.fullPath, () => {
  if(route.fullPath == '/'){
    showRightDrawer.value = true
  }else{
    rightDrawerOpen.value = false
    showRightDrawer.value = false
  }
},{immediate:true})

function toggleLeftDrawer(){
  settingsStore.toggleLeftDrawer()
}
</script>

<style scoped>
.title{
  cursor: pointer;
}
</style>
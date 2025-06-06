<template>
  <UApp>
    <q-layout view="hHh LpR fff">
      <q-header bordered>
        <HeaderSection :show-right-drawer="showRightDrawer"
          @toggle-right-drawer="settingsStore.setRightDrawerValue(!settingsStore.rightDrawerOpen)"
          @toggle-help-modal="helpDialogOpen = !helpDialogOpen"
          @toggle-changes-modal="changesDialogOpen = !changesDialogOpen" />
      </q-header>

      <q-drawer v-model="settingsStore.leftDrawerOpen" side="left" bordered @show="useTimetableStore().resize()"
        @hide="useTimetableStore().resize()">
        <!-- <ChangeLogList /> -->
        <PreviewListSection />
        <div class="q-mini-drawer-hide absolute" style="top: 15px; right: -17px">
          <q-btn dense round unelevated color="accent" icon="chevron_left" @click="toggleLeftDrawer" />
        </div>
      </q-drawer>

      <q-drawer v-model="settingsStore.rightDrawerOpen" side="right" bordered @show="useTimetableStore().resize()"
        @hide="useTimetableStore().resize()">
        <SemCourseSelector />
      </q-drawer>

      <q-dialog v-model="changesDialogOpen">
        <ChangeLogList />
      </q-dialog>

      <q-dialog v-model="helpDialogOpen">
        <HelpStepper @handle-finish="helpDialogOpen = !helpDialogOpen" />
      </q-dialog>

      <q-page-container>
        <q-page>
          <NuxtPage />
        </q-page>
      </q-page-container>

      <FooterSection />

    </q-layout>
  </UApp>
</template>

<script setup>
import { useTimetableStore } from './stores/timetable';
import { useSettingsStore } from './stores/settings';
import HeaderSection from './components/layout/HeaderSection.vue';
import FooterSection from './components/layout/FooterSection.vue';
import HelpStepper from './components/HelpStepper.vue';
import SemCourseSelector from './components/rightdrawer/SemCourseSelector.vue';
import ChangeLogList from './components/changelogs/ChangeLogList.vue';
import PreviewListSection from './components/preview/PreviewListSection.vue';

const settingsStore = useSettingsStore()
const timetableStore = useTimetableStore()
const helpDialogOpen = ref(useSettingsStore().getInitalHelpModalState)
const changesDialogOpen = ref(useSettingsStore().getInitalChangesModalState)
const showRightDrawer = ref(false)
const route = useRoute()

onMounted(() => {
  settingsStore.setSettings()
})

watch(() => [route.fullPath, timetableStore.getSemester], () => {
  console.info("Route changed to: ", route.fullPath, route.fullPath == '/' && timetableStore.getSemester != null)
  if (route.fullPath == '/' && timetableStore.getSemester != null) {
    showRightDrawer.value = true
    settingsStore.setRightDrawerValue(true)
  } else {
    settingsStore.setRightDrawerValue(false)
    showRightDrawer.value = false
    settingsStore.leftDrawerOpen = false
  }
}, { immediate: true })

function toggleLeftDrawer() {
  settingsStore.toggleLeftDrawer()
}
</script>

<style scoped>
.title {
  cursor: pointer;
}
</style>
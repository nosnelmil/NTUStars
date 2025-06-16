<template>
  <q-stepper
    v-model="step"
    vertical
    flat
    header-nav
    :color="settingsStore.darkMode ? 'white': 'primary'"
    animated
    style="width: 800px; margin: auto;"
  >
    <q-step
      :name="1"
      title="Welcome!"
      :done="step > 1"
      done-icon='none'
      active-icon='none'
      :color="settingsStore.darkMode ? 'white': 'primary'"
    >
      Welcome to NTU Stars! <br>
      This website hopes to alleviate the pain of planning your timetable.
      <br>
      <br>
      All data shown here comes directly from 
      <a href="https://wish.wis.ntu.edu.sg/webexe/owa/aus_schedule.main" target="_blank">NTU Class Schedule Site</a>,
      so some content might take some time to load.
      <br>
      <br>
      Start by selecting a semester on the right <q-icon name="east"/>
      <q-stepper-navigation>
        <q-btn :color="'primary'" label="Continue" @click="step = 2" />
      </q-stepper-navigation>
    </q-step>

    <q-step
      :name="2"
      title="Add Courses"
      :done="step > 2"
      done-icon='none'
      active-icon='none'
      :color="settingsStore.darkMode ? 'white': 'primary'"
    >
      Start adding NTU courses by searching their course codes. 
      <br>
      <br>
      If the course exists it would appear in the timetable.
      <br>
      <br>
      <!-- <span class="text-red text-bold">Warning<br></span>
      Avoid adding CC mods as they might lag the site. Instead, try adding custom events to represent represent them. <br> 
      <span class="text-caption text-subtitle2 text-grey-7">*working on a fix</span> -->
      
      <q-stepper-navigation>
        <q-btn flat :color="settingsStore.darkMode ? 'white': 'primary'" label="Back" @click="step = 1" />
        <q-btn color="primary" label="Continue" class="q-ml-sm" @click="step = 3" />
      </q-stepper-navigation>
    </q-step>

    <q-step
      :name="3"
      title="Swap indexes"
      :done="step > 3"
      done-icon='none'
      active-icon='none'
      :color="settingsStore.darkMode ? 'white': 'primary'"
    >
      One of the key features is having the ability to view all possible indexes and see how they fit into your timetable. 
      <br>
      <br>
      You can do this by clicking on an event and choosing a different index to swap to.
      <q-img :src="demo1" class="q-my-md"/>
      <q-stepper-navigation>
        <q-btn flat :color="settingsStore.darkMode ? 'white': 'primary'" label="Back" @click="step = 2" />
        <q-btn color="primary" label="Continue" class="q-ml-sm" @click="step = 4" />
      </q-stepper-navigation>
    </q-step>

    <q-step
      :name="4"
      title="Add your own event"
      :done="step > 4"
      done-icon='none'
      active-icon='none'
      :color="settingsStore.darkMode ? 'white': 'primary'"
    >
      You can also add custom events by selecting the timeslots where your event will occur.
      <br>
      <q-img :src="demo2" class="q-my-md"/>
      <q-stepper-navigation>
        <q-btn flat :color="settingsStore.darkMode ? 'white': 'primary'" label="Back" @click="step = 3" />
        <q-btn color="primary" label="Continue" class="q-ml-sm" @click="step = 5" />
      </q-stepper-navigation>
    </q-step>

    <q-step
      :name="5"
      title="What's next?"
      done-icon='none'
      active-icon='none'
      :color="settingsStore.darkMode ? 'white': 'primary'"
    >
      That's it for now! 
      <br>
      <br>
      Thank you for using NTU Stars and I hope this helps you plan your timetable more efficiently!
      <br>
      <br>
      More features and improvements are coming and it will be great to hear from you too!
      <br>
      <q-btn outline :color="settingsStore.darkMode ? 'white': 'primary'" class="text-capitalize q-mt-md" icon="article" :href="FEEDBACK_URL" target="_blank" label="Feedback"/>
      <br>
      <q-btn outline :color="settingsStore.darkMode ? 'white': 'primary'" class="text-capitalize q-mt-md" icon="bug_report" :href="BUG_REPORT_URL" target="_blank" label="Bug Report"/>
      <q-stepper-navigation>
        <q-btn flat :color="settingsStore.darkMode ? 'white': 'primary'" label="Back" @click="step = 4"  />
        <q-btn color="primary" label="Finish" class="q-ml-sm" @click="handleFinish"/>
      </q-stepper-navigation>
    </q-step>
  </q-stepper>
</template>


<script setup>
import { useSettingsStore } from '../stores/settings';
import demo1 from '@/assets/demo1.gif'
import demo2 from '@/assets/demo2.gif'
import { BUG_REPORT_URL, FEEDBACK_URL } from '~/constants';

const settingsStore = useSettingsStore()
const emits = defineEmits(["handleFinish"])

function handleFinish(){
  emits("handleFinish")
}

const step = ref(1)
</script>
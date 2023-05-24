<template>
  <q-stepper
    v-model="step"
    vertical
    flat
    header-nav
    color="primary"
    animated
  >
    <q-step
      :name="1"
      title="Welcome!"
      :done="step > 1"
      done-icon='none'
      active-icon='none'
    >
      Welcome to the NTU Stars! <br>
      This website hopes to alleviate the pain of planning your timetable.
      <br>
      <br>
      All data shown here comes directly from 
      <a href="https://wish.wis.ntu.edu.sg/webexe/owa/aus_schedule.main">NTU Class Schedule Site</a>,
      so some content might take some time to load.
      <br>
      <br>
      Start by selecting a semester on the right <q-icon name="east"/>
      <q-stepper-navigation>
        <q-btn @click="step = 2" color="primary" label="Continue" />
      </q-stepper-navigation>
    </q-step>

    <q-step
      :name="2"
      title="Add Courses"
      :done="step > 2"
      done-icon='none'
      active-icon='none'
    >
      Start adding NTU courses by searching their course codes. 
      <br>
      <br>
      If the course exists it would appear in the timetable.
      <br>
      <br>
      <span class="text-red text-bold">Warning<br></span>
      Avoid adding CC mods as they might lag the site. Instead, try adding custom events to represent represent them. <br> 
      
      <span>*working on a fix</span>
      <q-stepper-navigation>
        <q-btn flat @click="step = 1" color="primary" label="Back" />
        <q-btn @click="step = 3" color="primary" label="Continue" class="q-ml-sm" />
      </q-stepper-navigation>
    </q-step>

    <q-step
      :name="3"
      title="Swap indexes"
      :done="step > 3"
      done-icon='none'
      active-icon='none'
    >
      One of the key features is having the ability to view all possible indexes and see how they fit into your timetable. 
      <br>
      <br>
      You can do this by clicking on an event and choosing a different index to swap to.
      <q-img :src="demo1" class="q-my-md"/>
      <q-stepper-navigation>
        <q-btn flat @click="step = 2" color="primary" label="Back" />
        <q-btn @click="step = 4" color="primary" label="Continue" class="q-ml-sm" />
      </q-stepper-navigation>
    </q-step>

    <q-step
      :name="4"
      title="Add your own event"
      :done="step > 4"
      done-icon='none'
      active-icon='none'
    >
      You can also add custom events by selecting the timeslots where your event will occur.
      <br>
      <br>
      It's great for adding CC mods or important events that affect your schedule.
      <q-img :src="demo2" class="q-my-md"/>
      <q-stepper-navigation>
        <q-btn flat @click="step = 3" color="primary" label="Back" />
        <q-btn @click="step = 5" color="primary" label="Continue" class="q-ml-sm" />
      </q-stepper-navigation>
    </q-step>

    <q-step
      :name="5"
      title="Whats next?"
      done-icon='none'
      active-icon='none'
    >
      That's it for now! 
      <br>
      <br>
      Thank you for using NTU Stars and I hope this helps you plan your timetable more efficiently!
      <br>
      <br>
      More features and improvements are coming and it will be great to hear from you too!
      <br>
      <q-btn outline color="primary" class="text-capitalize q-mt-md" icon="article" href='https://forms.gle/4CV1ZiXkRS87P8cT9' target="_blank" label="Feedback"/>
      <br>
      <q-btn outline color="primary" class="text-capitalize q-mt-md" icon="bug_report" href='https://forms.gle/4jCSpWpvMUuWLBzh7' target="_blank" label="Bug Report"/>
      <q-stepper-navigation>
        <q-btn flat @click="step = 4" color="primary" label="Back"  />
        <q-btn color="primary" label="Finish" class="q-ml-sm" @click="handleFinish"/>
      </q-stepper-navigation>
    </q-step>
  </q-stepper>
</template>


<script setup>
import { ref } from 'vue'
import demo1 from '@/assets/demo1.gif'
import demo2 from '@/assets/demo2.gif'

const emits = defineEmits(["handleFinish"])

function handleFinish(){
  emits("handleFinish")
}

const step = ref(1)
</script>
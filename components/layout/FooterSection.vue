<template>
  <q-footer bordered>
    <q-toolbar class="justify-center align-center">
      <!-- <q-toolbar-title shrink class="text-subtitle2">
        Developed by 
      </q-toolbar-title> -->
      <!-- <q-btn stretch color="primary" class="text-capitalize" icon="article" href='https://forms.gle/4CV1ZiXkRS87P8cT9' target="_blank" label=""/> -->
      <q-btn 
        class="text-capitalize text-bold" 
        icon="~/assets/kofi_logo.png" 
        href='https://ko-fi.com/ntustarsplanner' 
        target="_blank" label="Support This Project!" 
        color="white" 
        text-color="primary">
        <q-tooltip class="bg-dark" anchor="top middle" self="bottom middle" :offset="[10, 10]" max-width="500px">
          <div class="q-ma-md">
            <p class="text-h6">Hey NTU Friends!</p>
            <p class="text-body1">
              I hope you're finding NTU Stars helpful for planning your semester timetables! However, running the server for this website comes with a cost, and I'm currently paying for it out of my own pocket. &#128184;<br><br>

              That's why I'm reaching out to ask for your help. By donating to NTU Stars, you'll be supporting the maintenance of the server and ensuring that the site stays up and running smoothly. Plus, your donation will motivate me to keep improving the site and adding new features to make your life even easier.<br><br>

              If you've found NTU Stars to be a valuable resource and want to see it continue to grow and evolve, please consider making a donation today! Every little bit helps, and I'll be so grateful for any support you can give! &#128512;<br><br>
            </p>
          </div>
        </q-tooltip>
      </q-btn>
      <q-btn stretch flat class="text-capitalize gt-xs" icon="article" href='https://forms.gle/4CV1ZiXkRS87P8cT9' target="_blank" label="Feedback"/>
      <q-btn stretch flat class="text-capitalize gt-xs" icon="bug_report" href='https://forms.gle/4jCSpWpvMUuWLBzh7' target="_blank" label="Bug Report"/>
    </q-toolbar>
  </q-footer>
</template>

<script setup>
</script>
<template>
  <q-footer bordered>
    <q-toolbar class="justify-center align-center">
      <!-- <q-toolbar-title shrink class="text-subtitle2">
        Developed by 
      </q-toolbar-title> -->
      <!-- <q-btn stretch color="primary" class="text-capitalize" icon="article" href='https://forms.gle/4CV1ZiXkRS87P8cT9' target="_blank" label=""/> -->
      <q-btn 
        class="text-capitalize text-bold" 
        :href="PATREON_URL"
        target="_blank" 
        color="white" 
        text-color="primary">
        <q-avatar class="q-mr-sm" size="20px">
          <q-img :src="PatreonLogo" fit="contain" />
        </q-avatar>
        <div>Support This Project on Patreon!</div>
        <q-tooltip class="bg-dark" anchor="top middle" self="bottom middle" :offset="[10, 10]" max-width="600px">
          <div class="q-ma-md">
            <p class="text-h6 text-center">I'm Back — And NTU Stars is Getting Better Than Ever!</p>
            <section class="text-body1">
              <p>
                Hi everyone 👋
              </p>
              <p>
                First of all, I want to sincerely apologize for the lack of updates on <strong>NTU Stars</strong> over the past few years.
                Like many of you, I was juggling a full academic workload while also focusing on landing an internship and securing a job —
                and unfortunately, that meant I couldn't give NTU Stars the attention it deserved.
              </p>
              <p>
                But now, I'm happy to share that I'm finally in a more stable place, and I'm ready to recommit to this project that so many
                of you have found useful. 🙌
              </p>

              <p>🗳️ Want to Help Decide What Comes Next?</p>
              <p>
                Got ideas for what NTU Stars should have next? As a member, you'll get to vote in polls and help shape the future of the platform —
                from new features to design improvements, your input matters.
              </p>

              <p><strong>Learn more and become a patron today to be part of building the next chapter of NTU Stars!</strong></p>              
            </section>
          </div>
        </q-tooltip>
      </q-btn>
      <q-btn stretch flat class="text-capitalize gt-xs" icon="article" :href="FEEDBACK_URL" target="_blank" label="Feedback"/>
      <q-btn stretch flat class="text-capitalize gt-xs" icon="bug_report" :href="BUG_REPORT_URL" target="_blank" label="Bug Report"/>
    </q-toolbar>
  </q-footer>
</template>

<script setup>
import PatreonLogo from '~/assets/patreon_logo.png'
import { BUG_REPORT_URL, FEEDBACK_URL, PATREON_URL } from '~/constants';
</script>
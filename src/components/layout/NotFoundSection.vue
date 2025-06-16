<template>
  <div class="row q-py-md justify-center q-pa-sm">
    <q-img :src="NotFoundGif" alt="404 Error" class="q-ma-lg" :height="'300px'" fit="scale-down"/>
    <div class="col-12 col-md-9 justify-center">
      <p class="text-h4 text-center">Oops!</p>
    </div>
    <div class="col-12 col-md-9 justify-center">
      <p class="text-subtitle1 text-center">We couldn't find the page you're looking for.</p>
    </div>
    <div class="col-12 col-md-9 flex justify-center">
      <q-btn color="primary" label="Go Back Home" to="/" class="q-mt-md" />
    </div>
  </div>
</template>

<script setup>
import NotFoundGif from '@/assets/not-found.gif'
</script>
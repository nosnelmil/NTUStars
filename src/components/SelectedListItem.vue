<template>
<q-item>
  <q-item-section top>
    <q-item-label class="row item-center" lines="1">
      <span class="text-weight-medium">{{course.courseCode}}</span><div :class="`q-ml-xs color-cube bg-${course.bgcolor}`"></div>
    </q-item-label>
    <q-item-label caption lines="1">
      {{course.courseName}}
    </q-item-label>
  
  </q-item-section>

  <q-item-section top side>
    <div class="text-grey-8 q-gutter-xs" v-if="course.isLoading">
      <q-spinner
        color="primary"
        size="2em"
        :thickness="2"
      />
    </div>
    <div class="text-grey-8 q-gutter-xs" v-else>
      <q-btn 
        class="gt-xs" 
        size="12px" 
        flat 
        dense 
        round 
        icon="delete" 
        @click="onRemoveClicked"/>
      <!-- <q-btn size="12px" flat dense round icon="more_vert" /> -->
    </div>
  </q-item-section>
</q-item>
</template>

<script setup>
const props = defineProps(["course"])
const emits = defineEmits(["handleRemove"])

function onRemoveClicked(){
  emits("handleRemove", props.course)
}
</script>

<style scoped>
.color-cube{
  width: 11px;
  height: 11px;
  border-radius: 2px;
  align-self: center;
}
</style>
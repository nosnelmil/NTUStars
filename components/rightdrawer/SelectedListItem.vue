<template>
<q-item 
  clickable 
  v-ripple
  @click="onListItemClicked"
  target="_blank"> 
  <q-item-section top>
    <q-item-label class="row item-center" lines="1">
      <span class="text-weight-medium text-uppercase">
        {{course.courseCode}}
      </span>
      <div class="q-ml-xs color-cube" :style="{backgroundColor: course.backgroundColor}"></div>
    </q-item-label>
    <q-item-label caption lines="1">
      {{course.courseName}}
    </q-item-label>
    <q-item-label v-if="course.index" caption lines="1">
      Index: {{course.index}}
    </q-item-label>
    <q-item-label v-if="course.au" caption lines="1">
      AU: {{course.au}}
    </q-item-label>
  
  </q-item-section>

  <q-item-section side>
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
const router = useRouter()
const props = defineProps(["course", "semester"])
const emits = defineEmits(["handleRemove"])
function onRemoveClicked(e){
  e.stopPropagation();
  emits("handleRemove", props.course)
}

function onListItemClicked(){
  const routeData = router.resolve({name: 'coursedetails', params: {details: [props.semester, props.course.courseCode]}});
  window.open(routeData.href, '_blank');
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
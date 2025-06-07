<template>
<q-item>
  <q-item-section top>
    <q-item-label class="row item-center" lines="1">
      <span class="text-weight-medium text-uppercase">
        {{props.course.courseCode}}
      </span>
      <div class="q-ml-xs color-cube" :style="{backgroundColor: props.course.backgroundColor}"/>
    </q-item-label>
    <q-item-label caption lines="1" class="q-mb-xs">
      {{props.course.courseName}} | AU: {{course.au}}
    </q-item-label>
    <q-item-label v-if="props.course.index" caption >
      Index: 
      <q-btn-dropdown :label="props.course.index" dense auto-close >
        <q-list style="max-height: 200px" caption>
          <q-item v-for="index in props.courseIndexes" :key="index" clickable dense @click="onChangeIndex(index)">
            <q-item-section>
              <q-item-label class="ellipsis">{{index}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

    </q-item-label>
  </q-item-section>

  <q-item-section side>
    <div v-if="course.isLoading" class="text-grey-8 q-gutter-xs">
      <q-spinner
        color="primary"
        size="2em"
        :thickness="2"
      />
    </div>
    <div v-else class="text-grey-8 q-gutter-xs">
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

<script setup lang="ts">
import type { CourseDisplay } from '~/models/courseDisplay.ts';

// const router = useRouter()
const props = defineProps({
  course: {
    type: Object as PropType<CourseDisplay>,
    required: true
  },
  courseIndexes: {
    type: Array as PropType<string[]>,
    default: () => []
  }
})
const emits = defineEmits(["handleRemove", "handleSwapIndex"])


function onRemoveClicked(e: Event){
  e.stopPropagation();
  emits("handleRemove", props.course)
}
function onChangeIndex(index: string){
  emits("handleSwapIndex", {index: index})
}
// function onListItemClicked(){
//   const routeData = router.resolve({name: 'coursedetails', params: {details: [props.semester, props.course.courseCode]}});
//   window.open(routeData.href, '_blank');
// }

</script>

<style scoped>
.color-cube{
  width: 11px;
  height: 11px;
  border-radius: 2px;
  align-self: center;
}
</style>
<template>
<q-item>
  <q-item-section top>
    <q-item-label class="row item-center" lines="1">
      <nuxt-link :to="getCourseLink()" target="_blank" class="text-weight-medium text-uppercase text-decoration:none course-link" >
        {{props.course.courseCode}}
      </nuxt-link>
      <div class="q-ml-sm color-cube" :style="{backgroundColor: props.course.backgroundColor}"/>
    </q-item-label>
    <q-item-label caption lines="3" class="q-mb-xs">
      {{props.course.courseName}} | AU: {{course.au}}
    </q-item-label>
    <q-item-label v-if="props.course.index" caption >
      Index: 
      <q-btn-dropdown v-if="semester" flat :label="props.course.index" dense auto-close>
        <q-list style="max-height: 200px" caption>
          <q-item v-for="index in indexes" :key="index" :clickable="index != selectedIndex" dense @click="onChangeIndex(index)">
            <q-item-section>
              <q-item-label :class="{ 'ellipsis': true, 'text-grey': index == selectedIndex }">{{index}}</q-item-label>
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

const timetableStore = useTimetableStore()
const scheduleStore = useSchedules()

// const router = useRouter()
const props = defineProps({
  course: {
    type: Object as PropType<CourseDisplay>,
    required: true
  }
})
const emits = defineEmits(["handleRemove", "handleSwapIndex"])

const semester = computed(() => timetableStore.getSemester)

const selectedIndex = computed(() => timetableStore.getShowingIndex(props.course.courseCode))

const indexes = ref<string[]>([])

// Fetch indexes when semester or course changes
watch(
  [semester, () => props.course.courseCode],
  async ([semesterValue, courseCode]) => {
    if (semesterValue && courseCode) {
      indexes.value = await scheduleStore.fetchCourseIndexes(semesterValue, courseCode)
    }
  },
  { immediate: true }
)

function onRemoveClicked(e: Event){
  e.stopPropagation();
  emits("handleRemove", props.course)
}
function onChangeIndex(index: string){
  emits("handleSwapIndex", {index: index})
}

function getCourseLink(): string {
  const semesterString = timetableStore.getSemester;
  const courseCode = props.course.courseCode;
  if (!semesterString || !courseCode) {
    return '';
  }
  const [year, semester] = semesterString.split(';');
  if (!year || !semester) {
    return '';
  }
  return `/courses/${year}-${semester}-${courseCode}`;
}

</script>

<style scoped>
.color-cube{
  width: 11px;
  height: 11px;
  border-radius: 2px;
  align-self: center;
  margin-bottom: 1px;
}

.course-link {
  text-decoration: none;
  color: inherit;
  display: inline-block;
  transition: all 0.2s ease;
}

.course-link:hover {
  transform: translateY(-2px);
  opacity: 0.8;
}
</style>
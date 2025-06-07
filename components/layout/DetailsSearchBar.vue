<template>
    <q-form
      ref="form"
      @submit="onSubmit"
    >
        <q-input 
          v-model="search" 
          dense
          filled
          placeholder="Course Code" 
          class="q-ml-md">
          <template #append>
            <q-icon v-if="search === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="search = ''" />
          </template>
        </q-input>
    </q-form>
</template>

<script setup>
import { validateCourseCode } from '@/composables/validator.js'
import { useTimetableStore } from '@/stores/timetable.js'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const timetableStore = useTimetableStore()

const router = useRouter()
const form = ref(null)
const search = ref(null)
async function onSubmit(){
  if(!timetableStore.getSemester){
    $q.notify({message:'Please select a semester!',  color:'negative'})
    return
  }
  if(!search.value || !validateCourseCode(search.value)){
    $q.notify({message:'Enter a valid course code!', color:'negative'})
    return
  }

  const routeData = router.resolve(`/courses-${timetableStore.getSemester}/${search.value}`)
  window.open(routeData.href, '_blank');
  search.value = ''
}
</script>
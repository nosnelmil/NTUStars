<template>
    <q-form
      ref="form"
      @submit="onSubmit"
    >
        <q-input 
          dark 
          dense 
          standout 
          v-model="search"
          placeholder="Course Code" 
          :input-class="`text-left ${!!search ? 'text-primary' : 'text-white'}`" 
          class="q-ml-md">
          <template v-slot:append>
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

  const routeData = router.resolve({name: 'coursedetails', params: {details: [timetableStore.getSemester, search.value]}});
  window.open(routeData.href, '_blank');
  search.value = ''
}
</script>
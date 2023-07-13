<template>
    <div class="row q-py-md justify-center q-pa-sm">
        <template v-if="isLoading">
            <CourseViewSkeleton />
        </template>
        <template v-else>
            <template v-if="course">
                <div class="col-12 col-md-9 flex q-my-md">
                    <span class="text-h4">
                       {{ course.courseCode }} {{ course.courseName }}
                    </span>
                    <q-space/>
                    <q-chip class="self-center" color="accent" text-color="white">AU: {{ course.au }}</q-chip>
                </div>
                <div class="col-12 col-md-9 q-mb-md">
                    <q-separator spaced></q-separator>
                </div>
                <!-- Pre-requisites -->
                <div class="col-12 col-md-9 q-mb-sm">
                    <div class=" q-gutter-sm items-center">
                        <span class="text-subtitile1">Pre-requisites:</span>
                        <q-btn flat dense unelevated color="secondary" :label="course.preRequisite == '' ? 'None' : course.preRequisite" class="q-my-none text-weight-bold" />
                    </div>
                </div>
                <!-- Mutually exclusive -->
                <div class="col-12 col-md-9 q-mb-sm">
                    <div class=" q-gutter-sm items-center">
                        <span class="text-subtitile1">Mutually exclusive with:</span>
                        <q-btn v-for="val in course.mutexWith" flat dense unelevated color="secondary" :label="val" class="q-my-none text-weight-bold" />
                    </div>
                </div>
                <!-- Not available to Programme: -->
                <div class="col-12 col-md-9 q-mb-sm">
                    <div class=" q-gutter-sm items-center">
                        <span class="text-subtitile1">Not available to Programme:</span>
                        <q-btn v-for="val in course.notAvailTo" flat dense unelevated color="secondary" :label="val" class="q-my-none text-weight-bold" />
                    </div>
                </div>
                <!-- Not available to all Programme with -->
                <div class="col-12 col-md-9 q-mb-sm">
                    <div class=" q-gutter-sm items-center">
                        <span class="text-subtitile1">Not available to all Programme with:</span>
                        <q-btn flat dense unelevated color="secondary" :label="course.notAvailWith" class="q-my-none text-weight-bold" />
                    </div>
                </div>
                <!-- Remarks -->
                <div class="col-12 col-md-9 q-mb-sm">
                    <span class="text-subtitle1 text-weight-bold">{{ course.remarks }}</span>
                </div>
                <!-- Course description -->
                <div class="col-12 col-md-9">
                    <div class="col-12 q-my-md text-body1">{{course.description}}</div>
                </div>
                <div class="col-12 col-md-9 q-mt-md">
                    <IndexTable :indexes="course.schedule"/>
                </div>
            </template>
            <template v-else>
                not found
            </template>
        </template>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useSchedules } from '@/stores/schedules.js'
import IndexTable from '../components/details/IndexTable.vue';
import CourseViewSkeleton from './CourseViewSkeleton.vue';

const route = useRoute()
const scheduleStore = useSchedules()
const isLoading = ref(true)
const isValid = ref(false)
const course = ref(null)

onMounted(async () => {
    console.log(route.params)
    const sem = route.params.details[0]
    const courseCode = route.params.details[1]
    const courseInfo = await scheduleStore.fecthCourseSpecificDetails(sem, courseCode)
    console.log(courseInfo)
    if(courseInfo){
        // populate data
        course.value = courseInfo
        isValid.value = true
    }else{
        isValid.value = false
    }
    isLoading.value = false
})

</script>
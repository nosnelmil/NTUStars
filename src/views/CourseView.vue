<template>
    <div class="row q-py-md justify-center q-pa-sm">
        <div class="col-12 col-md-9 flex">
            <span class="text-h4 q-mr-sm">
                {{ course.courseName }}
            </span>
            <q-chip class="self-center" color="accent" text-color="white">AU: {{ course.au }}</q-chip>
            <q-space/>
            <q-btn outline color="primary" icon="add" label="Calendar"></q-btn>
        </div>
        <div class="col-12 col-md-9 q-mb-md">
            <q-separator spaced></q-separator>
        </div>
        <!-- Pre-requisites -->
        <div class="col-12 col-md-9 q-mb-sm">
            <div class=" q-gutter-sm items-center">
                <span class="text-subtitile1">Pre-requisites:</span>
                <q-btn v-for="val in course.preRequisites" flat dense unelevated color="secondary" :label="val" class="q-my-none text-weight-bold" />
            </div>
        </div>
        <!-- Mutually exclusive -->
        <div class="col-12 col-md-9 q-mb-sm">
            <div class=" q-gutter-sm items-center">
                <span class="text-subtitile1">Mutually exclusive with:</span>
                <q-btn v-for="val in course.mutex" flat dense unelevated color="secondary" :label="val" class="q-my-none text-weight-bold" />
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
                <q-btn v-for="val in course.notAvailWith" flat dense unelevated color="secondary" :label="val" class="q-my-none text-weight-bold" />
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
            <q-table
            class="my-sticky-header-table"
            flat bordered
            title="Indexes"
            :rows="rows"
            :columns="columns"
            row-key="name"
            />
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useSchedules } from '@/stores/schedules.js'

const route = useRoute()
const scheduleStore = useSchedules()
const isLoading = ref(true)
const isValid = ref(false)

onMounted(async () => {
    console.log(route.params)
    const sem = route.params.details[0]
    const courseCode = route.params.details[1]
    const courseInfo = await scheduleStore.fecthCourseSpecificDetails(sem, courseCode)
    console.log(courseInfo)
    if(courseInfo){
        // populate data
        isValid.value = true
    }else{
        isValid.value = false
    }
    isLoading.value = false
})

const course = ref({
    courseName: "SC2006 Software Engineering",
    au: 3,
    preRequisites: ["SC1005", "SC1003", "SC1007"],
    mutex: ["SC1005", "SC1003", "SC1007"],
    notAvailTo: ["SC1005", "SC1003", "SC1007"],
    notAvailWith: ["(Admyr 2011-2020)"],
    remarks: "Not offered as Unrestricted Elective",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae sunt rerum quis consequuntur provident veniam a iure impedit odio commodi! Fugiat numquam eaque atque totam nisi, culpa labore corrupti repudiandae iste minus, omnis facere voluptatum ratione tempora voluptatibus! Distinctio quibusdam dolorem velit? Sit magnam vitae iure excepturi laudantium voluptatibus. Dolore obcaecati dolorem illum ex nobis voluptatem laudantium esse earum a sunt repellendus aliquam fugit reiciendis harum perferendis, itaque incidunt numquam sit quas, optio officiis soluta temporibus ipsam distinctio. Voluptatibus, cumque debitis ex reprehenderit magni molestias ab ea omnis nostrum repudiandae dignissimos similique ad nemo. Quis consequatur atque numquam animi aperiam."
})

const columns = [
  { name: 'name',
    required: true,
    label: 'Index',
    align: 'left',
    field: row => row.index,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
  { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
  { name: 'protein', label: 'Protein (g)', field: 'protein' },
  { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
  { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
  { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
]
const rows = [
  {
    index: '10423',
    type: "LEC",
    days: "Mon|Tues|Wed",
    carbs: 24,
    protein: 4.0,
    sodium: 87,
    calcium: '14%',
    iron: '1%'
  },
]
</script>
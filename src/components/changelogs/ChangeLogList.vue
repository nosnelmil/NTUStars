<template>
    <div>
        <q-list padding>
            <q-item>
                <q-item-section>
                    <q-item-label overline>CHANGES</q-item-label>
                </q-item-section>
            </q-item>
            <template v-for="changelog in changes">
                <q-separator inset></q-separator>
                <ChangeLogItem
                    class="q-py-md" 
                    :title="changelog.title" 
                    :description="changelog.description" 
                    :date-time="changelog.dateTime"/>
            </template>
            
            <q-separator spaced />

            <q-item>
                <q-item-section>
                    <q-item-label overline>BUG FIXES</q-item-label>
                </q-item-section>
            </q-item>
            <template v-for="changelog in bugfixes">
                <q-separator inset></q-separator>
                <ChangeLogItem
                    class="q-py-md" 
                    :title="changelog.title" 
                    :description="changelog.description" 
                    :date-time="changelog.dateTime"/>
            </template>
        </q-list>
    </div>
</template>

<script setup>
import ChangeLogItem from './ChangeLogItem.vue';

const changes = [
    {
        title: "Course details now available!",
        dateTime: formatDateTime("2023-07-14", "16:15"),
        description: "You can now view course details by clicking on the courses you have added on the right or by using the search bar above." 
    },
    {
        title: "Persisted State & Displaying of Academic Units (AU)",
        dateTime: formatDateTime("2023-07-10", "17:23"),
        description: "Your timetable data will now be saved even when you close or leave the website. Additionally, you will be able to view the number of Academic Units (AU) awarded by different modules and the total number of AU you currently have." 
    },
    {
        title: "Initial Release",
        dateTime: formatDateTime("2023-06-10", "16:04"),
        description: "First stable version of ntu semester timetable planner."
    },

]

const bugfixes = [
    {
        title: "#3 EE2101 error",
        dateTime: formatDateTime("2023-06-28", "16:00"),
        description: "EE2101 is not valid error."
    },
    {
        title: "#2 CY1500 and CY1308 error",
        dateTime: formatDateTime("2023-05-31", "23:24"),
        description: "CY1500 and CY1308 cannot be found."
    },
    {
        title: "#1 E2103L and E2110L error",
        dateTime: formatDateTime("2023-05-31", "23:24"),
        description: "Unable to add Lab modules such as E2103L and E2110L to the planner."
    },
]

function formatDateTime(date, time){
    return `${date}T${time}+08:00`
}
</script>
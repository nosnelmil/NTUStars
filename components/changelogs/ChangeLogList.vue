<template>
    <div :class="settingsStore.darkMode ? 'bg-dark': 'bg-white'">
        <q-list padding>
            <q-item>
                <q-item-section>
                    <q-item-label overline>CHANGES</q-item-label>
                </q-item-section>
            </q-item>
            <template v-for="changelog in changes" :key="changelog.dateTime">
                <q-separator inset/>
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
            <template v-for="changelog in bugfixes" :key="changelog.dateTime">
                <q-separator inset/>
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
import { useSettingsStore } from '../../stores/settings';

const settingsStore = useSettingsStore()
const changes = [
    {
        title: "Index Selection Improvement",
        dateTime: formatDateTime("2023-07-21", "22:30"),
        description: "Users are now able to save specific indexes for easy previewing, the process of previewing other indexes has been streamlined as well." 
    },
    {
        title: "Index Selection",
        dateTime: formatDateTime("2023-07-17", "12:40"),
        description: "Now you can select which index you would like to preview on your calendar. This means that you can now add CC modules to your timetable, although it might take a few seconds to load. Also, please note that your selection choices are not saved. We are working on saving your selection choices." 
    },
    {
        title: "Dark Mode",
        dateTime: formatDateTime("2023-07-14", "16:15"),
        description: "Finally some comfort for your eyes!" 
    },
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
        title: "#4 Get Semester error",
        dateTime: formatDateTime("2023-07-21", "12:20"),
        description: "Insufficient memory was allocated to server running getschedule api call."
    },
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
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

        </q-list>
    </div>
</template>

<script setup>
import ChangeLogItem from './ChangeLogItem.vue';
import { useSettingsStore } from '../../stores/settings';

const settingsStore = useSettingsStore()
const changes = [
    {
        title: "Search Functionality",
        dateTime: formatDateTime("2025-06-16", "15:00"),
        description: "You can now search for courses by their name or code. This will help you find the courses you want to add to your timetable more easily."
    },
    {
        title: "Multiple Timetables",
        dateTime: formatDateTime("2025-06-16", "15:00"),
        description: "You can now create multiple timetables. This is useful if you want to have different timetables for different semesters or if you want to compare different timetables."
    },
    {
        title: "Index Selection",
        dateTime: formatDateTime("2025-06-16", "15:00"),
        description: "You can now select which index you would like to preview on your calendar."
    },
    {
        title: "Major UI Overhaul",
        dateTime: formatDateTime("2025-06-16", "15:00"),
        description: "Major UI overhaul to improve the user experience. The new design is more modern and easier to use."
    },
    {
        title: "Improved Index Selection",
        dateTime: formatDateTime("2023-07-25", "14:20"),
        description: "The index selection process has been improved, making it easier to choose the right index for your courses."
    },
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

function formatDateTime(date, time){
    return `${date}T${time}+08:00`
}
</script>
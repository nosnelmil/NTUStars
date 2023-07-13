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
]

function formatDateTime(date, time){
    return `${date}T${time}+08:00`
}
</script>
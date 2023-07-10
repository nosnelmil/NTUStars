<template>
    <div>
        <q-list padding>
            <q-item>
                <q-item-section>
                    <q-item-label overline>MAJOR CHANGES</q-item-label>
                </q-item-section>
            </q-item>
            <template v-for="changelog in majorChanges">
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
                    <q-item-label overline>MINOR CHANGES</q-item-label>
                </q-item-section>
            </q-item>
            <template v-for="changelog in majorChanges">
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

const majorChanges = [
    {
        title: "Inital Release",
        dateTime: formatDateTime("2023-06-10", "16:04"),
        description: "Release of ntu semester timetable planner"
    },

]

const minorChanges = [
]

function formatDateTime(date, time){
    return `${date}T${time}+08:00`
}
</script>
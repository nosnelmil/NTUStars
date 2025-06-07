<template>
      <q-table
        flat
        :rows="rows"
        :columns="columns"
        row-key="name"
      >
        <template #body="props">
          <q-tr :props="props">
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.value }}
            </q-td>
        </q-tr>
        </template>
  
      </q-table>
  </template>

<script setup>
import { parseStartTime, parseEndTime, parseWeeks } from '../../composables/parsers';

defineProps(['rows'])

const columns = [
  { name: 'name', required: true, label: 'Day', align: 'left', field: 'day', sortable: true },
  { name: 'type', label: 'Type', field: 'type', sortable:true },
  { name: 'group', align: 'center', label: 'Group', field: 'group', sortable: true },
  { name: 'venue', label: 'Venue', field: 'venue' },
  { name: 'time', label: 'Time', field: 'time', sortable: true, format: val => `${parseStartTime(val)} - ${parseEndTime(val)}`},
  { name: 'weeks', label: 'Weeks', field: 'weeks', sortable:true, format: val => parseWeeks(val)},
]


</script>
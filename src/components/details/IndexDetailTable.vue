<template>
    <q-table
      :rows="scheduleRows"
      :columns="columns"
      :pagination="true"
      :rows-per-page-options="[5, 10, 15]"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="(value, key) in props.row" :key="key">
            <q-table
              :rows="value"
              :columns="columns"
              :pagination="false"
              :rows-per-page-options="[5, 10, 15]"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td v-for="(value, key) in props.row" :key="key">
                    {{ value }}
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </template>
  
  <script>
  export default {
    data() {
        return {
            schedule: {
            "10000": [
                { day: "MON", group: "SCL1", time: 1, type: "LEC/STUDIO", venue: "LT19", weeks: 1 },
                { day: "THU", group: "SCL1", time: 1, type: "LEC/STUDIO", venue: "LT2A", weeks: 2 },
                { day: "FRI", group: "FCEA", time: 2, type: "TUT", venue: "TR+31", weeks: 3 },
                { day: "MON", group: "FCEA", time: 3, type: "LAB", venue: "HWLAB3", weeks: 2 }
            ]},
            columns: [
            { name: "day", required: true, label: "Day", align: "left", field: "day", sortable: true },
            { name: "group", required: true, label: "Group", align: "left", field: "group", sortable: true },
            { name: "time", required: true, label: "Time", align: "left", field: "time", sortable: true },
            { name: "type", required: true, label: "Type", align: "left", field: "type", sortable: true },
            { name: "venue", required: true, label: "Venue", align: "left", field: "venue", sortable: true },
            { name: "weeks", required: true, label: "Weeks", align: "left", field: "weeks", sortable: true }
            ],
        }
    },
        computed: {
        scheduleRows() {
            // convert the schedule object to an array of objects with an additional `key` property
            return Object.keys(this.schedule).map(key => ({ key, ...this.schedule[key] }));
        }
        }
  }
  </script>
<template>
    <div class="q-pa-md">
      <q-table
        flat bordered
        title="Indexes"
        :rows="rows"
        :columns="columns"
        row-key="index"
      >
  
        <template #header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
  
        <template #body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn size="sm" color="accent" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
            </q-td>
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.value }}
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%" style="padding: 0;">
                <IndexDetailTable :rows="indexes[props.cols[0].value]"/>
            </q-td>
          </q-tr>
        </template>
  
      </q-table>
    </div>
  </template>

<script setup>
const props = defineProps(["indexes"])

const columns = [
  { name: 'index', required: true, label: 'Index', align: 'left', field: 'index', sortable: true },
]

const rows = computed(() => {
    const indexes = Object.keys(props.indexes)
    const result = []
    indexes.forEach(index => result.push({'index': index}))
    return result
})
</script>
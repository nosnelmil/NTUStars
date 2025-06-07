<template>
    <q-btn-dropdown color="primary" :label="currentPlan.planName" class="text-capitalize">
      <q-list>
        <q-item v-for="plan in plansObject" :key="plan.planNumber" v-close-popup clickable :disable="currentPlan.planNumber === plan.planNumber" @click="onItemClick(plan)">
          <q-item-section>
            <q-item-label class="ellipsis">{{plan.planName}}</q-item-label>
          </q-item-section>
          <q-item-section v-if="plan.planNumber != DEFAULT_PLAN_NUMBER" side>
            <!-- Delete button -->
              <q-btn name="delete" icon="delete" size="sm" round @click.stop="timetableStore.deletePlan(plan.planNumber)" />
          </q-item-section>
        </q-item>
        <!-- item to create plan -->
        <q-item v-close-popup clickable @click="onCreateNewPlan">
          <q-item-section side>
            <q-icon name="add" size="medium"/>
          </q-item-section>
          <q-item-section>
            <q-item-label class="ellipsis">New Plan</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
      </q-list>
    </q-btn-dropdown>
</template>

<script setup lang="ts">
import { DEFAULT_PLAN_NUMBER } from '~/constants/timetable';


const timetableStore = useTimetableStore()
const $q = useQuasar()

const plansObject = computed(() => timetableStore.getPlans)
const currentPlan = computed(() => timetableStore.getCurrentPlan)

function onItemClick(plan: { planNumber: number; planName: string }) {
  console.log("onItemClick", plan)
  timetableStore.switchPlans(plan.planNumber)
}

function onCreateNewPlan() {
  console.log("onCreateNewPlan")
  // timetableStore.createNewPlan()
  $q.dialog({
    title: 'Create New Plan',
    message: 'Please enter a name for the new plan:',
    prompt: {
      model: '',
      type: 'text',
      isValid: (val) => val.length > 0,
      placeholder: 'Plan Name'
    },
    cancel: true,
    persistent: true
  }).onOk((data) => {
    if (data && data.length > 0) {
      timetableStore.createNewPlan(data)
    }
  })
}

</script>

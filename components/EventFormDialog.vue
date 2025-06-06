<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6">Create Event</div>
      </q-card-section>
      <q-card-section>
        <q-form
          @submit="onOKClick"
        >
          <q-input
            filled
            v-model="name"
            label="Event Name *"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />
          <!-- <q-input
            filled
            type="number"
            v-model="age"
            label="Your age *"
            lazy-rules
            :rules="[
              val => val !== null && val !== '' || 'Please type your age',
              val => val > 0 && val < 100 || 'Please type a real age'
            ]"
          /> -->
          <!-- <div>
            <q-btn label="Submit" type="submit" color="primary"/>
            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
          </div> -->
          <q-card-actions align="right">
            <q-btn color="red" label="Cancel" @click="onDialogCancel" />
            <q-btn color="primary" label="Add" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card-section>
      <!-- buttons example -->
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar'
const name = ref(null)

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
// dialogRef      - Vue ref to be applied to QDialog
// onDialogHide   - Function to be used as handler for @hide on QDialog
// onDialogOK     - Function to call to settle dialog with "ok" outcome
//                    example: onDialogOK() - no payload
//                    example: onDialogOK({ /*...*/ }) - with payload
// onDialogCancel - Function to call to settle dialog with "cancel" outcome

// this is part of our example (so not required)
function onOKClick () {
  // on OK, it is REQUIRED to
  // call onDialogOK (with optional payload)
  onDialogOK({name: name.value})
  // or with payload: onDialogOK({ ... })
  // ...and it will also hide the dialog automatically
}
</script>
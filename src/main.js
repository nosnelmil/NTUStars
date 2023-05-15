import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// Import Quasar Calendar
import Plugin from '@quasar/quasar-ui-qcalendar/dist/QCalendarDay.esm.js'
import '@quasar/quasar-ui-qcalendar/dist/QCalendarDay.min.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)


app.use(createPinia())
app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
})
app.use(Plugin)

app.use(router)

app.mount('#app')

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { 
  Quasar,
  Notify,
  Dialog
} from 'quasar'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'
import './css/vars.css'
import './css/app.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(Quasar, {
  plugins: {
    Notify,
    Dialog
  }, // import Quasar plugins and add here
})

app.use(router)

app.mount('#app')

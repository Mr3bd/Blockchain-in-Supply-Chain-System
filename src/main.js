import './assets/main.css'
import { createApp } from "vue";
import Particles from "vue3-particles";
import App from "./App.vue";
import { initWeb3 } from "./web3Service";
await initWeb3();
import router from './router';


// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

createApp(App).use(router).use(Particles).use(vuetify).mount("#app");
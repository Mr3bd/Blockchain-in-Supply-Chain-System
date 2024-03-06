import './assets/main.css'
import { createApp } from "vue";
import Particles from "vue3-particles";
import App from "./App.vue";
import router from './router';


createApp(App).use(router).use(Particles).mount("#app");
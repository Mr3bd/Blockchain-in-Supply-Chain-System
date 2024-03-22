import './assets/main.css'
import { createApp } from "vue";
import Particles from "vue3-particles";
import App from "./App.vue";
import { initWeb3 } from "./web3Service";
await initWeb3();
import router from './router';

createApp(App).use(router).use(Particles).mount("#app");
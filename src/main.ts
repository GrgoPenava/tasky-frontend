import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import router from "./router.ts";
import { createPinia } from "pinia";

const app = createApp(App);
const pinia = createPinia();

app
  .use(PrimeVue, {
    theme: {
      preset: Aura,
    },
  })
  .use(router)
  .use(pinia);
app.mount("#app");

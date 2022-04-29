import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { key, store } from "./store";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "tailwindcss/tailwind.css";

const app = createApp(App);

app.use(store, key).use(router).use(ElementPlus).mount("#app");

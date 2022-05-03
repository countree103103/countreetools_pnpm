import "reflect-metadata";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { key, store } from "./store";
import "tailwindcss/tailwind.css";
import "element-plus/dist/index.css";
// import "vant/lib/index.css";
import "viewerjs/dist/viewer.css";
import VueViewer from "v-viewer";

const app = createApp(App);

app.use(store, key).use(router).use(VueViewer).mount("#app");

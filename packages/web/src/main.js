import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import Video from 'video.js'
import 'video.js/dist/video-js.css'

class myUtils {
  static IdIndex(clientArr, id) {
    for (let i = 0; i < clientArr.length; i++) {
      if (clientArr[i].id === id) {
        return i;
      }
    }
    return -1;
  }
  static getClientById(clientArr, id) {
    for (const client of clientArr) {
      if (client["id"] == id) {
        return client;
      }
    }
    return false;
  }
}

Vue.config.productionTip = false;

Vue.prototype.$myUtils = myUtils;
Vue.prototype.$video = Video //引入Video播放器

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

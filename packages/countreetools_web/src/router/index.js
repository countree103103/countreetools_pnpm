import Vue from "vue";
import VueRouter from "vue-router";
// import Home from '../views/Home.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: "/ssh",
    name: "SSH",
    component: () => import("../views/Ssh.vue"),
  },
  {
    path: "/ip",
    name: "IP",
    component: () => import("../views/Ip.vue"),
  },
  {
    path: "/trojan/clients",
    name: "Clients",
    alias: "/",
    component: () => import("../views/Trojan/Clients.vue"),
    meta: {
      keepAlive: true, //需要被缓存的组件
    },
  },
  {
    path: "/trojan/control/:id",
    name: "Control",
    component: () => import("../views/Trojan/Control.vue"),
    props: true,
  },
  {
    path: "/trojan/stream/:id",
    name: "Stream",
    component: () => import("../views/Trojan/Stream.vue"),
    props: true,
  },
  {
    path: "/trojan/fileexplorer",
    name: "FileExplorer",
    component: () => import("../views/Trojan/FileExplorer.vue"),
    props: true,
  },
];

const router = new VueRouter({
  routes,
});

export default router;

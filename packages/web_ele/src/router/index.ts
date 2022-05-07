import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

// const routes: Array<RouteRecordRaw> = [
//   {
//     path: "/",
//     name: "home",
//     component: HomeView,
//   },
//   {
//     path: "/about",
//     name: "about",
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () =>
//       import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
//   },
// ];

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: "/ssh",
  //   name: "SSH",
  //   component: () => import("../views/Ssh.vue"),
  // },
  // {
  //   path: "/ip",
  //   name: "IP",
  //   component: () => import("../views/Ip.vue"),
  // },
  {
    path: "/trojan/clients",
    name: "ClientsView",
    alias: "/",
    component: () => import("@/views/Trojan/ClientsView.vue"),
    meta: {
      keepAlive: true, //需要被缓存的组件
    },
  },
  {
    path: "/trojan/shell/:id",
    name: "ShellView",
    component: () => import("../views/Trojan/ShellView.vue"),
    props: true,
  },
  {
    path: "/trojan/player/:src",
    name: "PlayerView",
    component: () => import("../views/Trojan/PlayerView.vue"),
    props: true,
  },
  {
    path: "/trojan/fileexplorer/:id",
    name: "FileExplorerView",
    component: () => import("../views/Trojan/FileExplorerView.vue"),
    props: true,
  },
  // {
  //   path: "/trojan/stream/:id",
  //   name: "Stream",
  //   component: () => import("../views/Trojan/Stream.vue"),
  //   props: true,
  // },
  // {
  //   path: "/trojan/fileexplorer",
  //   name: "FileExplorer",
  //   component: () => import("../views/Trojan/FileExplorer.vue"),
  //   props: true,
  // },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

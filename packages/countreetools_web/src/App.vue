<template>
  <v-app>
    <!-- <h1>Countree's tools</h1>
      <a @click="openDev" style="cursor: pointer">开启开发者工具</a>
      <div id="nav">
        <router-link to="/ssh">远程ssh</router-link> |
        <router-link to="/ip">IP</router-link> |
        <router-link to="/trojan/clients">Clients</router-link>
      </div> -->
    <v-app-bar dense fixed class="d-lg-none"
      ><v-app-bar-title class="font-weight-bold"
        >Countree's Tools</v-app-bar-title
      ><v-spacer></v-spacer
      ><v-app-bar-nav-icon @click="show = !show"
        ><v-icon>fa-align-justify</v-icon></v-app-bar-nav-icon
      ></v-app-bar
    >
    <v-navigation-drawer v-model="show" app>
      <v-app-bar-title class="ma-5 font-weight-bold"
        >Countree's Tools</v-app-bar-title
      >
      <v-list>
        <v-list-item-group>
          <v-list-item link href="/#/ip">
            <v-list-item-content
              ><v-list-item-title>IP</v-list-item-title></v-list-item-content
            >
          </v-list-item>
          <v-list-item link href="/#/trojan/clients">
            <v-list-item-content
              ><v-list-item-title
                >Clients</v-list-item-title
              ></v-list-item-content
            >
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main class="pt-12">
      <transition name="ani" mode="out-in">
        <keep-alive include="clients">
          <router-view v-slot="{ Component }">
            <component :is="Component"></component>
          </router-view>
        </keep-alive>
      </transition>
    </v-main>
    <!-- <div id="windowControl">
      <i id="closeButton" @click="minimize">-</i>
      <i id="closeButton" @click="maximize">口</i>
      <i id="closeButton" @click="closeWindow">X</i>
    </div>
    <div id="dragArea"></div> -->
  </v-app>
</template>

<style lang="scss">
@keyframes ani {
  0% {
    transform: translateX(100vw);
  }

  100% {
    transform: translateX(0);
  }
}

.ani-enter-active {
  animation: ani 0.6s;
}

.ani-leave-active {
  animation: ani 0.1s reverse;
}
</style>

<script>
export default {
  name: "app",
  data: function () {
    return {
      isMaximized: false,
      interval: null,
      show: null,
    };
  },
  beforeMount() {
    window.addEventListener("click", () => {
      this.$store.state.contextMenu.show = false;
    });
  },
  methods: {
    closeWindow() {
      window.ipcRenderer.send("clickClose");
    },
    maximize() {
      window.ipcRenderer.send("clickMax", this.isMaximized);
      this.isMaximized = !this.isMaximized;
    },
    minimize() {
      window.ipcRenderer.send("clickMin");
    },
    openDev() {
      window.ipcRenderer.send("openDevTools");
    },
  },
};
</script>

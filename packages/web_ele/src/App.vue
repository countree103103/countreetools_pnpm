<template>
  <div class="h-screen" id="app">
    <nav
      class="shadow-lg flex rounded-b-lg items-center"
      style="height: var(--header-height)"
    >
      <h5 class="font-bold ml-4">tools</h5>
      <el-button class="mr-2 absolute right-0" @click="drawer = true"
        ><el-icon> <icon-ic-baseline-menu /></el-icon
      ></el-button>
    </nav>
    <aside>
      <el-drawer v-model="drawer" direction="ttb" :with-header="false">
        <el-menu>
          <el-menu-item-group>
            <el-menu-item>IP</el-menu-item>
            <el-menu-item>Trojan</el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </el-drawer>
    </aside>
    <main
      style="height: calc(100% - var(--header-height))"
      class="overflow-scroll"
    >
      <router-view v-slot="{ Component }">
        <transition>
          <keep-alive :include="['ClientsView']">
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const drawer = ref(false);

    return {
      drawer,
    };
  },
});
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  --header-height: 7%;
}
</style>

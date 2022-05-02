<template>
  <div>
    <div class="shadow-lg flex justify-between p-2 rounded-b-lg">
      <h5 class="font-bold">tools</h5>
      <el-button class="mr-2" @click="drawer = true"
        ><el-icon> <icon-ic-baseline-menu /></el-icon
      ></el-button>
    </div>
    <el-drawer v-model="drawer">
      <el-menu>
        <el-menu-item-group>
          <el-menu-item>IP</el-menu-item>
          <el-menu-item>Trojan</el-menu-item>
        </el-menu-item-group>
      </el-menu>
    </el-drawer>
    <router-view />
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
}

#header {
  @apply flex;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

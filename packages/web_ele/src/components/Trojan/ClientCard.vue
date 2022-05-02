<template>
  <el-card class="mx-6">
    <template #header>
      <p>{{ client.id }}</p>
    </template>
    <div class="flex items-start flex-col">
      <p>pc</p>
      <p>plat</p>
      <van-button>456</van-button>
    </div>
    <div class="flex justify-end mt-2">
      <el-dropdown>
        <span>操作</span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="getScreenshot"
              >screenshot</el-dropdown-item
            >
            <el-dropdown-item>screenshot</el-dropdown-item>
            <el-dropdown-item>screenshot</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-card>
</template>

<script lang="ts">
import { container } from "@/plugins/inversify";
import { SocketioManager } from "@/plugins/socketio";
import { client } from "@/types/client";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    client: {
      type: Object as PropType<client>,
      required: true,
    },
  },
  setup(props) {
    // const manager = container.get<SocketioManager>(SocketioManager);
    const manager = container.resolve(SocketioManager);
    async function getScreenshot() {
      try {
        console.log(await manager.getScreenshot(props.client.id));
      } catch (error) {
        console.log(error);
      }
    }
    return { getScreenshot };
  },
});
</script>

<style lang="scss" scoped></style>

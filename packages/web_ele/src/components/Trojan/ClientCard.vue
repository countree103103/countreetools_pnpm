<template>
  <el-card class="mx-6" v-loading="cardLoading">
    <template #header>
      <span>ID:</span> <span>{{ client.id }}</span>
    </template>
    <div class="flex items-start flex-col">
      <div>
        <span>主机名: </span><span>{{ client.主机名 }}</span>
      </div>
      <div>
        <span>平台: </span><span>{{ client.系统版本名 }}</span>
      </div>
    </div>
    <div class="flex justify-end mt-2">
      <el-dropdown>
        <span>操作</span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="getScreenshot">截图</el-dropdown-item>
            <el-dropdown-item
              @click="
                $router.push({ name: 'ShellView', params: { id: client.id } })
              "
              >终端</el-dropdown-item
            >
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
import { defineComponent, PropType, ref } from "vue";
import { api as viewer } from "v-viewer";

export default defineComponent({
  props: {
    client: {
      type: Object as PropType<client>,
      required: true,
    },
  },
  setup(props) {
    const manager = container.resolve(SocketioManager);
    const cardLoading = ref(false);
    async function getScreenshot() {
      cardLoading.value = true;
      try {
        let imgBuffer = (await manager.getScreenshot(
          props.client.id
        )) as ArrayBuffer;
        let imgBlob = new Blob([imgBuffer], { type: "image/jpeg" });
        let url = URL.createObjectURL(imgBlob);
        viewer({ options: {}, images: [url] });
        cardLoading.value = false;
      } catch (error) {
        console.log(error);
        cardLoading.value = false;
      }
    }

    async function sendCommand(command: string): Promise<string | false> {
      try {
        const result = await manager.sendCommand(props.client.id, command);
        return result as string;
      } catch (error) {
        console.log(error);
        return false;
      }
    }

    return { getScreenshot, cardLoading };
  },
});
</script>

<style lang="scss" scoped></style>

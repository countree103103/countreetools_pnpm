<template>
  <el-card class="mx-6" v-loading="cardLoading">
    <template #header>
      <span>ID:</span> <span>{{ client.id }}</span>
    </template>
    <div class="flex items-start flex-col">
      <div class="flex justify-start mb-3">
        <el-image
          :src="screenshotPreviewUrl"
          style="height: 100px"
          @click="refreshScreenshotPreview"
          v-loading="screenshotLoading"
        >
          <template #error>
            <div class="image-slot">
              <el-icon><icon-ic-outline-hide-image /></el-icon>
            </div>
          </template>
        </el-image>
      </div>
      <div>
        <span>主机名: </span><span>{{ client.主机名 }}</span>
      </div>
      <div>
        <span>平台: </span><span>{{ client.系统版本名 }}</span>
      </div>
    </div>
    <div class="flex justify-end mt-2">
      <el-dropdown>
        <el-button>操作</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="showClientDetails"
              >详细信息</el-dropdown-item
            >
            <el-dropdown-item @click="showScreenshot">截图</el-dropdown-item>
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
import { defineComponent, getCurrentInstance, PropType, ref } from "vue";
import { api as viewer } from "v-viewer";

import { ElMessage, ElMessageBox } from "element-plus";
import type { Action } from "element-plus";
import { Dialog } from "vant";

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
    const screenshotPreviewUrl = ref("");
    const screenshotLoading = ref(false);
    const proxy = getCurrentInstance()?.proxy;

    setTimeout(() => {
      refreshScreenshotPreview();
    }, 0);

    function showClientDetails() {
      Dialog({ message: JSON.stringify(props.client) });
    }

    async function refreshScreenshotPreview() {
      screenshotLoading.value = true;
      try {
        screenshotPreviewUrl.value = await manager.getScreenshotUrl(
          props.client.id
        );
      } catch (error) {
        console.log(error);
      } finally {
        screenshotLoading.value = false;
      }
    }

    async function showScreenshot() {
      cardLoading.value = true;
      try {
        const url = await manager.getScreenshotUrl(props.client.id);
        viewer({ options: {}, images: [url] });
        cardLoading.value = false;
      } catch (error) {
        console.log(error);
        cardLoading.value = false;
      }
    }

    return {
      showScreenshot,
      cardLoading,
      screenshotPreviewUrl,
      refreshScreenshotPreview,
      screenshotLoading,
      showClientDetails,
    };
  },
});
</script>

<style lang="scss" scoped></style>

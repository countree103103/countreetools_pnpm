<template>
  <div class="mx-3 mt-3">
    <el-row class="mb-3" justify="start">
      <el-col :span="4"
        ><el-button plain @click="$router.back()"
          ><el-icon><icon-ic-baseline-chevron-left /></el-icon>返回</el-button
        ></el-col
      >
      <el-col :span="14"
        ><el-switch
          active-text="开启Powershell"
          v-model="powershellOrCMD"
        ></el-switch
      ></el-col>
    </el-row>
    <el-input
      autofocus
      placeholder="输入命令"
      v-model="input"
      @keypress.enter="input ? sendCommand() : null"
      v-loading="loading"
    ></el-input>
    <textarea
      disabled
      class="border-2 border-solid border-gray-300 mt-2 rounded-sm w-full"
      rows="9"
      ref="textarea"
      v-model="textareaResult"
    ></textarea>
    <el-button @click="textareaResult = ''">清空上方</el-button>
    <el-button @click="loading = false">重置</el-button>
  </div>
</template>

<script lang="ts">
import { container } from "@/plugins/inversify";
import SocketioManager from "@/plugins/socketio";
import { defineComponent, getCurrentInstance, ref } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  setup(props) {
    const route = useRoute();
    const id: string = route.params.id as string;
    const powershellOrCMD = ref(true);
    const input = ref("");
    const manager = container.resolve(SocketioManager);
    const proxy = getCurrentInstance()?.proxy;
    const loading = ref(false);
    const textareaResult = ref("");

    async function sendCommand() {
      try {
        loading.value = true;
        const result = (await manager.sendCommand(
          id,
          input.value,
          powershellOrCMD.value
        )) as string;
        textareaResult.value = textareaResult.value.concat(result);
        proxy?.$nextTick(() => {
          const ele = proxy?.$refs.textarea as HTMLTextAreaElement;
          ele.scrollTo({ top: ele.scrollHeight, left: 0, behavior: "smooth" });
          input.value = "";
          loading.value = false;
        });
      } catch (error) {
        console.log(error);
        loading.value = false;
      }
    }

    return { powershellOrCMD, input, sendCommand, loading, textareaResult };
  },
});
</script>

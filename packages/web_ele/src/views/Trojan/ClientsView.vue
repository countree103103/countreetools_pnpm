<template>
  <div class="py-8 flex flex-col">
    <h1
      class="mb-3"
      :class="manager.getStatus() ? ['text-green-600'] : ['text-red-600']"
    >
      {{
        manager.getStatus()
          ? `已连接, 客户端数：${$store.state.clientArr.length}`
          : "未连接"
      }}
    </h1>
    <div class="flex flex-col">
      <template v-if="$store.state.clientArr?.length">
        <client-card
          v-for="client in $store.state.clientArr"
          :key="client.id"
          :client="client"
          class="mb-4"
        ></client-card>
      </template>
      <template v-else>
        <h1>无在线客户端</h1>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { container } from "@/plugins/inversify";
import { SocketioManager } from "@/plugins/socketio";

export default defineComponent({
  name: "ClientsView",
  setup() {
    const manager = container.resolve(SocketioManager);
    console.log(manager);

    return { manager };
  },
});
</script>

<style lang="scss"></style>

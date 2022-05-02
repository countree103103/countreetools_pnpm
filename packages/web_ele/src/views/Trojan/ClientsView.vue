<template>
  <div class="py-8 flex justify-between flex-col h-screen">
    <div>
      <h1>online</h1>
    </div>
    <div class="h-full flex justify-between flex-col">
      <template v-if="$store.state.clientArr?.length">
        <client-card
          v-for="client in $store.state.clientArr"
          :key="client.id"
          :client="client"
        ></client-card>
      </template>
      <template v-else>
        <h1>Empty</h1>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { container } from "@/plugins/inversify";
import { SocketioManager } from "@/plugins/socketio";

export default defineComponent({
  setup() {
    const manager = container.resolve(SocketioManager);
    console.log(manager);
  },
});
</script>

<style lang="scss"></style>

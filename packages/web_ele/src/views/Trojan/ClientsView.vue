<template>
  <div class="py-8 flex justify-between flex-col h-screen">
    <div>
      <h1>online</h1>
    </div>
    <div class="h-full flex justify-between flex-col">
      <ClientCard></ClientCard>
      <ClientCard></ClientCard>
      <ClientCard></ClientCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ClientCard from "@/components/Trojan/ClientCard.vue";

export default defineComponent({
  setup() {
    null;
  },
  components: { ClientCard },
});
</script>

<style lang="scss"></style>

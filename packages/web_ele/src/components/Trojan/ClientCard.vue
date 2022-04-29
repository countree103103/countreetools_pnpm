<template>
  <el-card class="h-44 mx-6">
    <template #header>
      <p>id</p>
    </template>
    <div class="flex items-start flex-col">
      <p>pc</p>
      <p>plat</p>
    </div>
    <div class="flex justify-end mt-2">
      <el-dropdown>
        <span>操作</span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>screenshot</el-dropdown-item>
            <el-dropdown-item>screenshot</el-dropdown-item>
            <el-dropdown-item>screenshot</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    null;
  },
});
</script>

<style lang="scss" scoped></style>

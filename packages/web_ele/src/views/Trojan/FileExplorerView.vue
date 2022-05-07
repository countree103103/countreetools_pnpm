<template>
  <div class="h-full">
    <div class="" style="height: 10%">
      <el-button @click="gotoDir()">submit</el-button>
      <el-breadcrumb-item>{{ currentDirParsed?.root }}</el-breadcrumb-item>
      <el-breadcrumb separator="\">
        <template v-for="(i, index) in urlArr" :key="index">
          <el-breadcrumb-item @click="clickBread(index)">{{
            i
          }}</el-breadcrumb-item></template
        >
      </el-breadcrumb>
    </div>
    <div style="height: 90%" class="overflow-scroll">
      <el-table :data="fileList" height="100%">
        <el-table-column prop="name" label="文件名" sortable></el-table-column>
        <el-table-column prop="lstat.atime" label="atime">
          <template #default="scope">
            {{ new Date(scope.row.lstat.atime).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="lstat.size" label="size"></el-table-column>
        <el-table-column fixed="right">
          <template #default="scope">
            <el-button v-if="scope.row.isDir" @click="clickGoto(scope.row.name)"
              >打开</el-button
            >
            <el-button>下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { container } from "@/plugins/inversify";
import SocketioManager from "@/plugins/socketio";
import path from "path-browserify";
import { computed, defineComponent, ref } from "vue";

export default defineComponent({
  name: "FileExplorerView",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const manager = container.resolve(SocketioManager);
    const fileList = ref<any[]>([]);
    const currentDirParsed = ref<path.PathObject>();

    const urlArr = computed(() => {
      const arr = currentDirParsed.value?.dir
        .replace(currentDirParsed.value.root, "")
        .split(path.sep);
      return arr;
    });

    async function gotoDir(dir = "C:\\ProgramData\\nssm\\") {
      const listDir = await manager.listDir(props.id, dir);
      fileList.value = listDir.result;
      currentDirParsed.value = path.parse(listDir.url);
    }

    function clickBread(index: number) {
      if (urlArr.value && currentDirParsed.value) {
        currentDirParsed.value.base = urlArr.value[index];
        currentDirParsed.value.name = urlArr.value[index];
      }

      gotoDir(path.format(currentDirParsed.value as path.PathObject));
    }

    function clickGoto(name: string) {
      null;
    }

    gotoDir();

    return {
      gotoDir,
      fileList,
      console,
      currentDirParsed,
      clickBread,
      clickGoto,
      urlArr,
    };
  },
  methods: {
    asd() {
      null;
    },
  },
});
</script>

<style lang="sass" scoped></style>

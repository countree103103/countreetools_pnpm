<template>
  <v-container>
    <v-container class="d-flex justify-space-between pt-0 pb-0">
      <v-btn small fab @click="$router.go(-1)" class="mb-6 mr-5"
        ><v-icon>fa-angle-left</v-icon></v-btn
      >
      <h4>客户端ID: {{ id }}</h4>
      <p>设置</p>
    </v-container>
    <v-container class="d-flex justify-center align-center pt-0 pb-0">
      <v-text-field
        @keypress.enter="submit"
        v-model="sshInput"
        name="name"
        label="输入终端命令"
        type="text"
        :loading="sshStatus == '等待回调...' ? true : false"
        ><template v-slot:append
          ><v-btn @click="submit" outlined>提交</v-btn></template
        ></v-text-field
      >
    </v-container>
    <v-container class="d-flex pt-0 pb-0 justify-start align-center">
      <v-switch
        v-model="powershell"
        label="powershell"
        class="mr-10"
      ></v-switch>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on"
            >更多<v-icon class="ml-1">fa-angle-down</v-icon></v-btn
          >
        </template>
        <v-btn-toggle
          dense
          class="d-flex justify-start align-center"
          background-color="transparent"
        >
          <v-btn @click="sshOutput = ''"> 清空下方(ctrl+L) </v-btn>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on"
                >快捷操作<v-icon class="ml-1">fa-angle-down</v-icon></v-btn
              >
            </template>
            <v-list>
              <v-list-item @click="addQuickCmd">
                <v-list-item-content>
                  <v-list-item-title>添加操作</v-list-item-title>
                </v-list-item-content>
                <v-list-item-icon
                  ><v-icon small>fa-plus</v-icon></v-list-item-icon
                >
              </v-list-item>
              <v-divider></v-divider>
              <template v-for="(i, index) in quickCmd">
                <v-list-item
                  :key="index"
                  @click="
                    sshInput = i.cmd;
                    submit();
                  "
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ i.name }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-icon @click="delQuickCmd(index)"
                    ><v-icon small>fa-close</v-icon></v-list-item-icon
                  >
                </v-list-item>
              </template>
            </v-list>
          </v-menu>
        </v-btn-toggle>
      </v-menu>
    </v-container>

    <v-container>
      <v-textarea
        label="终端回调结果"
        v-model="sshOutput"
        rows="9"
        ref="sshOutput"
        readonly
        id="outputTextarea"
      ></v-textarea>
    </v-container>
  </v-container>
</template>

<script>
import { io } from "../../plugins/socketio";

export default {
  name: "control",
  props: ["id"],
  data: function () {
    return {
      quickCmd: [],
      clientArr: window.clientArr,
      sshInput: "",
      sshOutput: "",
      sshStatus: "",
      interval: null,
      powershell: true,
      shortcut: {
        clearInput: null,
      },
    };
  },
  watch: {},
  beforeMount() {
    //注册快捷键事件
    this.shortcut.clearInput = document.documentElement.addEventListener(
      "keydown",
      (event) => {
        event = event || window.event;
        //清空输出结果
        if (event.key == "l" && event.ctrlKey) {
          event.preventDefault();
          this.sshOutput = "";
        }
      }
    );
    this.clientArr = window.clientArr;
    this.interval = setInterval(() => {
      if (window.cmdResult.changed) {
        this.sshStatus = "";
        if (window.cmdResult.data == "") {
          this.sshOutput = this.sshOutput.concat("\n当前命令返回了空的回调\n");
        } else {
          this.sshOutput = this.sshOutput.concat(window.cmdResult.data);
        }
        setTimeout(() => {
          let dom = document.querySelector("#outputTextarea");
          dom.scrollTop = dom.scrollHeight;
        }, 100);
        window.cmdResult.changed = false;
      }

      //快捷操作：localStorage
      if (window.localStorage.quickCmd) {
        this.quickCmd = JSON.parse(window.localStorage.quickCmd);
      }

      if (this.$myUtils.IdIndex(window.clientArr, this.id) == -1) {
        clearInterval(this.interval);
        // alert("此客户端已离线");
        this.$router.push("/trojan/clients");
      }
    }, 200);
  },
  beforeRouteLeave(to, from, next) {
    window.cmdResult.changed = false;
    clearInterval(this.interval);

    //清除快捷键注册
    for (const key in this.shortcut) {
      if (Object.hasOwnProperty.call(this.shortcut, key)) {
        if (this.shortcut[key]) {
          removeEventListener(this.shortcut[key]);
        }
      }
    }
    next();
  },
  afterRouteEnter(to, from, next) {
    next();
  },
  methods: {
    submit() {
      if (!this.sshInput.length) return;
      this.sshStatus = "等待回调...";
      // eslint-disable-next-line no-undef
      if (this.powershell) {
        io.emit(
          "apisendcmd",
          this.id,
          `powershell -command "${this.sshInput}"`
        );
      } else {
        io.emit("apisendcmd", this.id, this.sshInput);
      }
    },
    addQuickCmd() {
      const name = prompt("新快捷操作的名称：");
      const cmd = prompt("新快捷操作的指令：");
      if (name && cmd) {
        this.quickCmd.push({ name: name, cmd: cmd });
        window.localStorage.setItem("quickCmd", JSON.stringify(this.quickCmd));
      } else {
        alert("创建失败！名称或指令不能为空。");
      }
    },
    delQuickCmd(index) {
      this.quickCmd.splice(index, 1);
      window.localStorage.setItem("quickCmd", JSON.stringify(this.quickCmd));
    },
  },
};
</script>

<style lang="scss"></style>

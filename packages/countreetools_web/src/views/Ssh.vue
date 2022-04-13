<template>
  <div id="sshContainer">
    <div class="wrapper">
      <div>
        <label for="sshInput">请输入ssh命令:</label>
        <input
          type="text"
          name="sshInput"
          v-model="sshInput"
          @keypress.enter="submit"
        />
        <input type="button" value="提交" @click="submit" />
      </div>
      <div id="sshOutput">
        <textarea name="sshOutput" id="" v-model="sshOutput"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  data: function () {
    return {
      sshInput: "",
      sshOutput: "Output will be shown here...",
      socket: null,
    };
  },
  watch: {
    // sshInput: function() {
    //   this.sshOutput = this.sshInput;
    // }
  },
  beforeMount() {
    this.socket = io.connect("http://home.countree.cn:7070");
    this.socket.on("message", (data) => {
      this.sshOutput = data;
    });
  },
  beforeRouteLeave(to, from, next) {
    // console.log(this.socket);
    this.socket.close();
    next();
  },
  methods: {
    submit() {
      this.sshOutput = "等待回调...";
      this.socket.send(this.sshInput);
    },
  },
};
</script>

<style lang="scss" scoped>
#sshContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .wrapper {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    #sshOutput {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      flex-direction: column;
      // margin-top: 10%;
      height: 60vh;
      textarea {
        // border: none;
        margin-top: 5%;
        height: 100%;
        width: 95vw;
      }
    }
  }
}
</style>

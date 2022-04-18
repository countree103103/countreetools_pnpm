<template>
  <v-container>
      <video ref="videoRefsmall" width="300px" height="200px" controls></video>
  </v-container>
</template>

<script>
import Hls from "hls.js"
export default {
    props:{
        id:{
            type: String
        }
    },
    data(){
        return {
            hls: null,
        }
    },
    computed:{
        src(){
            return `http://home.countree.cn:8765/hls/${this.id}.m3u8`
        }
    },
    methods: {
      pauseVideo() {
        this.$refs.videoRefsmall.pause();
      },
      playVideo() {
        this.$refs.videoRefsmall.play();
      },
    },
    mounted() {
      this.hls = new Hls();
      this.hls.loadSource(this.src);
      this.hls.attachMedia(this.$refs.videoRefsmall);

      this.hls.on(Hls.Events.MANIFEST_PARSED, function () {
        this.$refs.videoRefsmall.pause();
      });
    },
    beforeDestroy() {
      this.hls.stopLoad();
      this.hls.destroy();
      this.hls = null;
    }
}
</script>

<style>

</style>
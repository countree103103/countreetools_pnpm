<template>
  <div>
    <div>
      <video controls ref="player" class="video-js">
        <source
          type="application/x-mpegURL"
          :src="$route.params.src as string"
        />
      </video>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, ref } from "vue";
import videojs from "video.js";
import "@videojs/http-streaming";
import "video.js/dist/video-js.css";

export default defineComponent({
  name: "PlayerView",
  setup(props) {
    const player = ref();

    nextTick(() => {
      videojs(player.value, {
        width: 300,
        height: 200,
        // html5: {
        //   nativeAudioTracks: false,
        //   nativeVideoTracks: false,
        //   hls: {
        //     overrideNative: true,
        //   },
        // },
      });
      // console.log(player);
    });

    return { props, player };
  },
});
</script>
<style scoped></style>

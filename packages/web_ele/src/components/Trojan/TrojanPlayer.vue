<template>
  <div v-loading="loading">
    <div>
      <video controls ref="player" class="video-js"></video>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  nextTick,
  onActivated,
  onBeforeMount,
  onBeforeUnmount,
  onDeactivated,
  ref,
} from "vue";
import videojs, { VideoJsPlayer } from "video.js";
import "@videojs/http-streaming";
import "video.js/dist/video-js.css";
import { timeout } from "@/plugins/socketio";

export default defineComponent({
  name: "TrojanPlayer",
  props: {
    src: {
      type: String,
    },
  },
  setup(props) {
    const player = ref();
    const loading = ref(true);
    let ginstance: VideoJsPlayer | null = null;

    onBeforeUnmount(() => {
      console.log("player onBeforeUnmount");
      ginstance ? ginstance.dispose() : null;
    });
    onBeforeMount(() => {
      console.log("player onBeforeMount");
    });

    nextTick(() => {
      let instance = videojs(player.value, {
        // width: 300,
        height: 100,
        html5: {
          nativeAudioTracks: false,
          nativeVideoTracks: false,
          hls: {
            overrideNative: true,
          },
        },
      });
      ginstance = instance;

      function isResourceReady() {
        return new Promise((rs, rj) => {
          const interval = setInterval(async () => {
            console.log(`fetching resource...`);
            try {
              if (instance.isDisposed()) {
                clearInterval(interval);
                rj("player disposed, stop fetching.");
              }
              const result = await fetch(props.src as string);
              result.ok
                ? (console.log("resource ready..."),
                  rs(""),
                  clearInterval(interval))
                : console.log("no resource...");
            } catch (error) {
              console.log("resource not ready...");
            }
          }, 3000);
        });
      }

      setTimeout(async () => {
        try {
          await isResourceReady();
          instance.src([
            {
              // type: "application/x-mpegURL",
              src: props.src as string,
            },
          ]);
          instance.load();
          loading.value = false;
        } catch (error) {
          console.log(error);
          loading.value = false;
        }
      });

      // setTimeout(() => {
      //   instance.src(props.src as string);
      // }, 0);
      instance.on("error", () => {
        // instance.load();
        // setTimeout(() => {
        //   instance.src([
        //     {
        //       type: "application/x-mpegURL",
        //       src: props.src as string,
        //     },
        //   ]);
        //   instance.load();
        // }, 2000);
        instance.dispose();
      });
    });

    return { props, player, loading };
  },
});
</script>
<style scoped></style>

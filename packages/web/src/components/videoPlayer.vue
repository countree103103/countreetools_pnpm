<template>
  <div>
    <video :id="player_id" class="video-js" controls ref="player">
      <source :src="src" type="application/x-mpegURL" />
    </video>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    id: {
      type: String,
    },
  },
  data() {
    return {
      player: null,
    };
  },
  computed: {
    src() {
      return `http://home.countree.cn:8765/hls/${this.id}.m3u8`;
    },
    player_id() {
      return `player-${this.id}`;
    },
  },
  mounted() {
    let that = this;
    this.player = this.$video(
      `#${this.player_id}`,
      {
        width: "300px",
        height: "200px",
        html5: {
          nativeAudioTracks: false,
          nativeVideoTracks: false,
          hls: {
            overrideNative: true,
          },
        },
      },
      function () {
        // this.on("stalled",()=>{
        //     setTimeout(()=>{
        //         // this.reset()
        //         this.load()
        //     },2000)
        // })
        this.on("error", () => {
          setTimeout(() => {
            this.reset();
            this.src([
              {
                type: "application/x-mpegURL",
                src: that.src,
              },
            ]);
            console.log(this);
            console.log(that.src);
            this.load();
          }, 2000);
        });
      }
    );
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  },
};
</script>

<template>
  <v-container>
      <v-btn small fab @click="$router.go(-1)" class="mb-6 mr-5"
        ><v-icon>fa-angle-left</v-icon></v-btn
      >
      <h1>{{id}}</h1>
      <video-player :options="options" :id="id"></video-player>
  </v-container>
</template>

<script>
import videoPlayer from "../../components/videoPlayer.vue"
export default {
    components:{
        videoPlayer
    },
    data(){
        return {

        }
    },
    props: ["id", "options"]
}
</script>

<style>

</style>
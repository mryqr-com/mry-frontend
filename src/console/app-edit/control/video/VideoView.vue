<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">
    <VideoListViewer v-if="control.videos.length > 0"
                     :borderRadius="control.borderRadius"
                     :disableClickToPlay="true"
                     :transcode="false"
                     :videos="theVideos">
    </VideoListViewer>

    <div v-if="control.videos.length === 0" :class="$style.placeholderText">
      <i class="el-icon-warning-outline"> 请添加视频文件</i>
    </div>
  </div>
</template>

<script>

export default {
  props: ['control', 'tabletView', "controlIndex"],

  components: {
    VideoListViewer: () => import(/* webpackChunkName: "video-list-player" */ '@/common/components/VideoListViewer')
  },

  computed: {
    theVideos() {
      return [{
        file: this.control.videos[0],
        poster: this.control.poster,
      }]
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.placeholderText {
  color: $warningYellow;
}

</style>

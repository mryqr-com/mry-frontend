<template>
  <ControlWrapper v-if="control.videos.length > 0" :control="control" :index="index">
    <VideoListViewer :borderRadius="control.borderRadius" :videos="theVideos"></VideoListViewer>
  </ControlWrapper>
</template>

<script>

export default {
  props: ['control', 'index'],

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

</style>

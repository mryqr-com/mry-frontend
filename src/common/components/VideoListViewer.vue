<template>
  <div v-if="videos.length > 0" :class="$style.wrapper">
    <div v-for="(aVideo,index) in videos" :class="$style.videoContainer">
      <div v-if="showFileName" :class="$style.videoName">{{ aVideo.file.name }}</div>

      <video-player
          :key="index"
          ref="videoPlayer"
          :class="[$style.videoPlayer,{[$style.disableClickToPlay]:disableClickToPlay}]"
          :options="playerOptionOf(aVideo)"
          :playsinline="true"
          :style="playerStyle"
          class="vjsSkin">
      </video-player>
    </div>
  </div>
</template>

<script>
import {imageDisplayUrl} from "@/common/utils/image-utils";
import 'video.js/dist/video-js.css'
import {videoPlayer} from 'vue-video-player'

export default {
  props: {
    videos: {
      type: Array,
    },

    disableClickToPlay: {
      type: Boolean,
      default: false,
    },

    showFileName: {
      type: Boolean,
      default: false,
    },

    borderRadius: {
      type: Number,
      default: 0,
    },

    transcode: {
      type: Boolean,
      default: true,
    }
  },

  components: {
    videoPlayer
  },

  computed: {
    playerStyle() {
      return {
        borderRadius: this.borderRadius + 'px',
      }
    }
  },

  methods: {
    playerOptionOf(aVideo) {
      return {
        autoplay: false,
        muted: false,
        language: 'zh-CN',
        playbackRates: [1.0, 1.5, 2.0],
        sources: [{
          src: this.videoSrc(aVideo),
        }],
        poster: this.posterImage(aVideo),
      }
    },

    videoSrc(aVideo) {
      if (this.transcode) {
        let origin = new URL(aVideo.file.fileUrl).origin;
        let transCodedOrigin = origin + '/MTS';
        return aVideo.file.fileUrl.replace(origin, transCodedOrigin).replace(/\.[^/.]+$/, ".mp4");
      }

      return aVideo.file.fileUrl;
    },

    posterImage(aVideo) {
      if (aVideo.poster) {
        return imageDisplayUrl(aVideo.poster);
      }

      if (this.transcode) {
        let origin = new URL(aVideo.file.fileUrl).origin;
        let transCodedOrigin = origin + '/MTS/snapshot';
        return aVideo.file.fileUrl.replace(origin, transCodedOrigin).replace(/\.[^/.]+$/, ".jpeg");
      }

      return `${aVideo.file.fileUrl}?x-oss-process=video/snapshot,t_1000,f_jpg,w_400,h_0,m_fast,ar_auto`;
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.videoContainer {
  margin-bottom: 25px;
}

.videoContainer:last-child {
  margin-bottom: 0;
}

.videoName {
  color: $primaryTextColor;
  line-height: 1.6em;
}

.videoPlayer {
  width: 100%;
  overflow: hidden;
}

.videoPlayer:hover {
  cursor: pointer;
}

.disableClickToPlay {
  :global {
    .vjs-tech {
      pointer-events: none;
    }
  }
}

:global {
  .vjs-big-play-button .vjs-icon-placeholder:before {
    font-size: 30px !important;
  }

  .vjs-poster {
    background-position: center center !important;
    background-size: cover !important;
  }

  .vjs-big-play-button {
    border-width: 0 !important;
    font-size: 2.5em !important;
  }

  .vjsSkin > .video-js {
    width: calc(100vw - 30px); //有些android不能使用aspect-ratio
    height: calc((100vw - 30px) / 1.78);
    font-family: "PingFang SC", "Helvetica Neue", "Hiragino Sans GB", "Segoe UI", "Microsoft YaHei", "微软雅黑", sans-serif;
  }

  .vjsSkin > .video-js .vjs-menu-button-inline.vjs-slider-active, .vjsSkin > .video-js .vjs-menu-button-inline:focus, .vjsSkin > .video-js .vjs-menu-button-inline:hover, .video-js.vjs-no-flex .vjs-menu-button-inline {
    width: 10em
  }

  .vjsSkin > .video-js .vjs-controls-disabled .vjs-big-play-button {
    display: none !important
  }

  .vjsSkin > .video-js .vjs-control {
    width: 3em
  }

  .vjsSkin > .video-js .vjs-control.vjs-live-control {
    width: auto;
    padding-left: .5em;
    letter-spacing: .1em;
  }

  .vjsSkin > .video-js .vjs-menu-button-inline:before {
    width: 1.5em
  }

  .vjs-menu-button-inline .vjs-menu {
    left: 3em
  }

  .vjs-paused.vjs-has-started.vjsSkin > .video-js .vjs-big-play-button, .video-js.vjs-ended .vjs-big-play-button, .video-js.vjs-paused .vjs-big-play-button {
    display: block
  }

  .vjsSkin > .video-js .vjs-load-progress div, .vjs-seeking .vjs-big-play-button, .vjs-waiting .vjs-big-play-button {
    display: none !important
  }

  .vjsSkin > .video-js .vjs-mouse-display:after, .vjsSkin > .video-js .vjs-play-progress:after {
    padding: 0 .4em .3em
  }

  .video-js.vjs-ended .vjs-loading-spinner {
    display: none;
  }

  .video-js.vjs-ended .vjs-big-play-button {
    display: block !important;
  }

  .video-js.vjs-ended .vjs-big-play-button, .video-js.vjs-paused .vjs-big-play-button, .vjs-paused.vjs-has-started.vjsSkin > .video-js .vjs-big-play-button {
    display: block
  }

  .vjsSkin > .video-js .vjs-big-play-button {
    top: 50%;
    left: 50%;
    margin-left: -1.5em;
    margin-top: -1em
  }

  .vjsSkin > .video-js .vjs-big-play-button {
    background-color: rgba(0, 0, 0, 0.45);
    font-size: 3.5em;
    /*border-radius: 50%;*/
    height: 2em !important;
    line-height: 2em !important;
    margin-top: -1em !important
  }

  //
  //.video-js:hover .vjs-big-play-button, .vjsSkin > .video-js .vjs-big-play-button:focus, .vjsSkin > .video-js .vjs-big-play-button:active {
  //  background-color: rgba(0, 191, 255, 0.65)
  //}

  .vjsSkin > .video-js .vjs-loading-spinner {
    border-color: rgba(0, 191, 255, 0.51)
  }

  .vjsSkin > .video-js .vjs-control-bar2 {
    background-color: #000000
  }

  .vjsSkin > .video-js .vjs-control-bar {
    /*background-color: rgba(0,0,0,0.3) !important;*/
    color: #ffffff;
    font-size: 14px
  }

  .vjsSkin > .video-js .vjs-play-progress, .vjsSkin > .video-js .vjs-volume-level {
    background-color: #00bfff;
  }

  .vjsSkin > .video-js .vjs-play-progress:before {
    top: -0.3em;
  }

  .vjsSkin > .video-js .vjs-progress-control:hover .vjs-progress-holder {
    font-size: 1.3em;
  }

  .vjs-menu-button-popup.vjs-volume-menu-button-vertical .vjs-menu {
    left: 0;
  }

  .vjsSkin > .video-js .vjs-menu li {
    padding: 0;
    line-height: 2em;
    font-size: 1.1em;
    font-family: "PingFang SC", "Helvetica Neue", "Hiragino Sans GB", "Segoe UI", "Microsoft YaHei", "微软雅黑", sans-serif;
  }

  .vjsSkin > .video-js .vjs-time-tooltip,
  .vjsSkin > .video-js .vjs-mouse-display:after,
  .vjsSkin > .video-js .vjs-play-progress:after {
    border-radius: 0;
    font-size: 1em;
    padding: 0;
    width: 3em;
    height: 1.5em;
    line-height: 1.5em;
    top: -3em;
  }

  .vjsSkin > .video-js .vjs-menu-button-popup .vjs-menu {
    width: 5em;
    left: -1em;
  }

  .vjsSkin > .video-js .vjs-menu-button-popup.vjs-volume-menu-button-vertical .vjs-menu {
    left: 0;
  }

  .vjsSkin > .video-js .vjs-control-bar .vjs-resolution-button .vjs-menu {
    /*order: 4;*/
  }

  /*排序顺序*/
  .vjsSkin > .video-js .vjs-control-bar .vjs-play-control {
    order: 0;
  }

  .vjsSkin > .video-js .vjs-control-bar .vjs-time-control {
    min-width: 1em;
    padding: 0;
    margin: 0 .1em;
    text-align: center;
    display: block;
    order: 1;
  }

  .vjsSkin > .video-js .vjs-control-bar .vjs-playback-rate .vjs-playback-rate-value {
    font-size: 1.2em;
    line-height: 2.4;
  }

  .vjsSkin > .video-js .vjs-progress-control.vjs-control {
    order: 2;
  }

  .vjsSkin > .video-js .vjs-control-bar .vjs-volume-menu-button {
    order: 3;
  }

  .vjsSkin > .video-js .vjs-control-bar .vjs-resolution-button {
    order: 4;
  }

  .vjsSkin > .video-js .vjs-control-bar .vjs-resolution-button .vjs-resolution-button-label {
    display: block;
    line-height: 3em;
  }

  .vjsSkin > .video-js .vjs-control-bar .vjs-playback-rate {
    order: 5;
  }

  .vjsSkin > .video-js .vjs-control-bar .vjs-fullscreen-control {
    order: 6;
  }
}


@media (min-width: $mobileScreenBreakpoint), print {
  :global {
    .vjsSkin > .video-js {
      width: 100%;
      aspect-ratio: 1.78;
      height: auto;
    }
  }
}

</style>

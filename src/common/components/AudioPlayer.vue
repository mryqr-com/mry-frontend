<template>
  <div :class="$style.wrapper">
    <div :class="$style.contentContainer">
      <img :class="$style.actionIcon" :src="actionIconSrc" alt="action" @click="togglePlay"/>
      <span :class="$style.duration">{{ currentTime }} / {{ totalTime }}</span>
      <vue-slider v-model="progress"
                  :class="$style.progressSlider"
                  :dotSize="12"
                  :max="totalDuration"
                  tooltip="none"
                  @change="onSlideChange"
                  @drag-start="onDragStart"
                  @drag-end="onDragEnd">
      </vue-slider>
      <img :class="$style.soundIcon" :src="soundIconSrc" alt="sound" @click="toggleMute"/>
      <template v-if="!isMobileBrowser()">
        <vue-slider v-model="volume" :class="$style.volumeSlider" :dotSize="12" :max="100" tooltip="none"></vue-slider>
      </template>
    </div>

    <audio ref="player" :class="$style.audioElement">
      <source :src="src">
    </audio>
  </div>
</template>

<script>
import playIcon from '@/common/static/play.svg';
import soundIcon from '@/common/static/soundon.svg';
import muteIcon from '@/common/static/mute.svg';
import pauseIcon from '@/common/static/pause.svg';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css'
import {isMobileBrowser} from '@/common/utils/common-utils';

export default {
  props: {
    src: {
      type: String,
      required: true,
    },
  },

  components: {
    VueSlider,
  },

  data() {
    return {
      totalDuration: 100,
      paused: true,
      progress: 0,
      volume: 100,
      muted: false,
      previousPaused: false,
    }
  },

  mounted() {
    this.$nextTick(() => {
      let audio = this.$refs.player;
      audio.addEventListener("loadedmetadata", this.onLoadMetaData);
      audio.addEventListener("timeupdate", this.onTimeUpdate);
      audio.addEventListener("ended", this.onEnded);
      audio.addEventListener("pause", this.onPause);
      audio.addEventListener("play", this.onPlay);
      this.$watch("volume", function (value) {
        this.$refs.player.volume = value / 100;
      });
    });
  },

  computed: {
    actionIconSrc() {
      return this.paused ? playIcon : pauseIcon;
    },

    soundIconSrc() {
      return !this.muted ? soundIcon : muteIcon;
    },

    totalTime() {
      return this.convertTime(this.totalDuration);
    },

    currentTime() {
      return this.convertTime(this.progress);
    }
  },

  methods: {
    isMobileBrowser,
    onDragStart() {
      this.previousPaused = this.$refs.player.paused;
      this.$refs.player.pause();
    },

    onDragEnd(value) {
      if (!this.previousPaused) {
        this.$refs.player.play();
      }
    },

    onSlideChange(value) {
      this.$refs.player.currentTime = value;
    },

    convertTime(seconds) {
      const format = value => `0${Math.floor(value)}`.slice(-2);
      let hours = seconds / 3600;
      let minutes = (seconds % 3600) / 60;
      return [minutes, seconds % 60].map(format).join(":");
    },

    onLoadMetaData() {
      let audio = this.$refs.player;
      if (audio) {
        this.totalDuration = Math.round(audio.duration);
      }
    },

    onTimeUpdate() {
      this.progress = Math.round(this.$refs.player.currentTime);
    },

    onEnded() {
      this.paused = true;
    },

    onPause() {
      this.paused = true;
    },

    onPlay() {
      this.paused = false;
    },

    togglePlay() {
      this.paused = !this.paused;
      if (this.paused) {
        this.$refs.player.pause();
      } else {
        this.$refs.player.play();
      }
    },

    toggleMute() {
      this.muted = !this.muted;
      this.$refs.player.muted = this.muted;
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .04);
}

.audioElement {
  display: none;
}

.contentContainer {
  background-color: rgba(237, 241, 248, 1);
  height: 60px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
}

.actionIcon {
  cursor: pointer;
  width: 30px;
  height: 30px;
  padding: 8px;
}

.actionIcon:hover {
  background-color: #E4E7ED;
}

.duration {
  margin-right: 10px;
  margin-left: 10px;
  color: $primaryTextColor;
}

.progressSlider {
  flex-grow: 2;
  margin-left: 10px;
  margin-right: 10px;

  :global {
    .vue-slider-process {
      background-color: $primaryThemeColor;
    }

    .vue-slider-rail {
      background-color: #C0C4CC;
    }

    .vue-slider-dot-handle-focus {
      box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.32);
    }
  }
}

.soundIcon {
  cursor: pointer;
  width: 30px;
  height: 30px;
  padding: 8px;
  margin-left: 5px;
  margin-right: 5px;
}

.soundIcon:hover {
  background-color: #E4E7ED;
}

.volumeSlider {
  flex-grow: 1;
  margin-right: 10px;

  :global {
    .vue-slider-process {
      background-color: #515256;
    }

    .vue-slider-rail {
      background-color: #DCDFE6;
    }

    .vue-slider-dot-handle {
      background-color: #909399;
      box-shadow: none;
    }

    .vue-slider-dot-handle-focus {
      box-shadow: none;
    }
  }
}
</style>

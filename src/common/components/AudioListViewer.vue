<template>
  <div :class="$style.wrapper">
    <div v-for="(anAudio,index) in audios" :key="index" :class="$style.audioContainer">
      <div v-if="showFileName" :class="$style.audioName">{{ anAudio.name }}</div>
      <AudioPlayer :class="$style.audioPlayer" :src="anAudio.fileUrl" :style="playerStyle"></AudioPlayer>
    </div>
  </div>
</template>

<script>
import AudioPlayer from '@/common/components/AudioPlayer';

export default {
  props: {
    audios: {
      type: Array,
      required: true,
    },

    showFileName: {
      type: Boolean,
      default: false,
    },

    borderRadius: {
      type: Number,
      default: 0,
    },
  },

  components: {
    AudioPlayer,
  },

  computed: {
    playerStyle() {
      return {
        borderRadius: this.borderRadius + 'px',
      }
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.audioContainer {
  margin-bottom: 25px;
}

.audioContainer:last-child {
  margin-bottom: 0;
}

.audioName {
  color: $primaryTextColor;
  line-height: 1.6em;
}

.audioPlayer {
  overflow: hidden;
}
</style>

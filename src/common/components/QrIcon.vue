<template>
  <span :class="$style.wrapper" :style="wrapperStyle">
    <span v-if="!headerImage" :class="$style.firstLetter" :style="firstLetterStyle">{{ firstLetter }}</span>
  </span>
</template>

<script>
import {imageThumbnailUrl} from "@/common/utils/image-utils";

export default {
  props: {
    qr: {
      type: Object,
      required: true,
    },
    length: {
      type: Number,
      default: 30
    },
    fontSize: {
      type: Number,
      default: 16
    }
  },

  data() {
    return {
      randomColors: [
        // '#ef9629',
        // '#20B2AA',
        // '#008000',
        // '#ec67e6',
        // '#87CEEB',
        // '#ef5e63',
        // '#1fbee0',
        // '#ee682f',
        // '#4698ef',
        // '#6d6fe7',
          '#00BFFF',
          '#228B22',
          '#007FFF',
          '#EE3BF3',
          '#FEA500',
          '#FF033E',
          '#0070BB',
          '#D2122E',
          '#F7D211',
          '#32CD32',
      ]
    }
  },

  computed: {
    wrapperStyle() {
      let base = {
        width: this.length + 'px',
        height: this.length + 'px'
      };

      if (this.headerImage) {
        return {
          ...base,
          backgroundImage: `url('${imageThumbnailUrl(this.headerImage)}')`
        }
      } else {
        return {
          ...base,
          backgroundColor: this.iconBackgroundColor,
        }
      }
    },

    headerImage() {
      return this.qr.headerImage;
    },

    firstLetterStyle() {
      return {
        fontSize: this.fontSize + 'px'
      }
    },

    firstLetter() {
      return this.qr.name.substr(0, 1).toUpperCase();
    },

    iconBackgroundColor() {
      let index = this.qr.name.charCodeAt(0) % 10;
      return this.randomColors[index];
    }
  },

}
</script>

<style lang="scss" module>
.wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-position: center center;
  background-size: cover;
}

.firstLetter {
  color: white;
  font-weight: 500;
}
</style>

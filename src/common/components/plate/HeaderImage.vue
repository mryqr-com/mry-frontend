<template>
  <div :id="id" :class="$style.wrapper" :style="imageStyle"></div>
</template>

<script>
import {randomHtmlElementId} from "@/common/utils/common-utils";

export default {
  props: {
    imageUrl: {
      type: String,
    },

    width: {
      type: Number,
      default: 100,
    },

    height: {
      type: Number,
      default: 120,
    }
  },

  data() {
    return {
      id: randomHtmlElementId(),
    }
  },

  computed: {
    imageStyle() {
      return {
        width: this.width + 'px',
        height: this.height + 'px',
        backgroundImage: this.imageUrl ? `url('${this.imageUrl}')` : null,
      }
    }
  },
}
</script>

<style lang="scss" module>
.wrapper {
  background-position: center center;
  background-size: cover;
  max-width: 100%;
}
</style>

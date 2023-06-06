<template>
  <div :class="$style.wrapper" :style="wrapperStyle">
    <img v-if="control.logo"
         :src="logoSrc"
         :style="logoStyle"
         alt="Logo"/>
    {{ text }}
  </div>
</template>

<script>
import {imageThumbnailUrl} from "@/common/utils/image-utils";
import {fontStyles, justifyContentOf} from "@/common/utils/common-utils";

export default {
  props: {
    text: {
      type: String,
    },

    control: {
      type: Object,
      required: true,
    }
  },

  computed: {
    wrapperStyle() {
      return {
        ...fontStyles(this.control.fontStyle),
        justifyContent: justifyContentOf(this.control.alignType),
        letterSpacing: this.control.letterSpacing + 'px',
        height: this.control.height + 'px',
      }
    },

    logoSrc() {
      return imageThumbnailUrl(this.control.logo);
    },

    logoStyle() {
      return {
        width: this.control.logoHeight + 'px',
        marginRight: this.control.logoTextSpacing + 'px',
      }
    },

  }
}
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  align-items: center;
  overflow: hidden;
  line-height: 1.3em;
}

</style>

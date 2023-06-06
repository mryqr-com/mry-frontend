<template>
  <div v-if="shouldShow" :class="$style.wrapper">
    <img v-if="shouldShowImage"
         :class="$style.theImage"
         :src="imageSrc"
         alt="页眉图片"/>

    <div v-if="shouldShowText" :class="[{[$style.positionedTitle]:shouldShowImage}]">
      <BoxedTextViewer :textStyle="header.textStyle">
        <img v-if="header.logoImage"
             :class="$style.theLogo"
             :src="logoSrc"
             :style="logoStyle"
             alt="Logo"/>
        <span :class="$style.headerText">{{ header.text }}</span>
      </BoxedTextViewer>
    </div>
  </div>
</template>

<script>
import {imageDisplayUrl} from '@/common/utils/image-utils'

export default {
  props: {
    header: {
      type: Object,
      required: true
    },
  },

  computed: {
    shouldShow() {
      return this.shouldShowImage || this.shouldShowText;
    },

    shouldShowImage() {
      return this.header.showImage && this.header.image;
    },

    shouldShowText() {
      return this.header.showText;
    },

    imageSrc() {
      return imageDisplayUrl(this.header.image);
    },

    logoSrc() {
      return imageDisplayUrl(this.header.logoImage);
    },

    logoStyle() {
      return {
        height: this.header.logoHeight + 'px',
        verticalAlign: this.header.logoAlign
      }
    }
  },
}
</script>

<style lang="scss" module>
.wrapper {
  position: relative;
}

.theImage {
  width: 100%;
}

.positionedTitle {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.theLogo {
  padding-right: 2px;
  vertical-align: middle;
}

.headerText {
  display: inline-block;
  vertical-align: middle;
  font-family: inherit;
}

</style>

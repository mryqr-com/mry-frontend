<template>
  <div :class="$style.wrapper" :style="wrapperStyle" @click="onClick">
    <div :class="[$style.imageContainer,{[$style.aspectRatioNotSupported]:isAspectRatioNotSupported}]"
         :style="imageContainerStyle">
      <div v-if="textOverImage" :class="$style.overImageTextContainer">
        <BoxedTextViewer v-if="link.name"
                         :textStyle="linkNameTextStyle">
          {{ link.name }}
        </BoxedTextViewer>
        <BoxedTextViewer v-if="link.description"
                         :textStyle="linkDescriptionTextStyle">
          {{ link.description }}
        </BoxedTextViewer>
      </div>
    </div>

    <div v-if="!textOverImage" :class="$style.textContainer">
      <BoxedTextViewer v-if="link.name"
                       :textStyle="linkNameTextStyle">
        {{ link.name }}
      </BoxedTextViewer>
      <BoxedTextViewer v-if="link.description"
                       :textStyle="linkDescriptionTextStyle">
        {{ link.description }}
      </BoxedTextViewer>
    </div>
  </div>
</template>

<script>
import {imageDisplayUrl} from "@/common/utils/image-utils";
import defaultBackground from '@/common/static/picture.svg';
import {appearanceStyles, isAndroidBrowser} from "@/common/utils/common-utils";

export default {
  props: {
    imageAspectRatio: {
      type: Number,
      default: 150
    },

    link: {
      type: Object,
      required: true
    },

    linkNameTextStyle: {
      type: Object,
      required: true
    },

    linkDescriptionTextStyle: {
      type: Object,
      required: true
    },

    appearanceStyle: {
      type: Object,
      required: true
    },

    textOverImage: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    wrapperStyle() {
      return {
        ...appearanceStyles(this.appearanceStyle),
      }
    },

    imageContainerStyle() {
      return {
        aspectRatio: this.imageAspectRatio / 100,
        backgroundImage: this.link.image ? `url('${imageDisplayUrl(this.link.image)}')` : `url('${defaultBackground}')`
      }
    },

    isAspectRatioNotSupported() {
      return isAndroidBrowser();
    },
  },

  methods: {
    onClick() {
      this.$emit("click", this.link);
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
  overflow: hidden;
}

.wrapper:hover {
  cursor: pointer;
  filter: brightness(95%);
}

.imageContainer {
  width: 100%;
  background-position: center center;
  background-size: cover;
  position: relative;
}

.aspectRatioNotSupported {
  height: calc(100vw * 0.61);
}

.overImageTextContainer {
  position: absolute;
  top: 0;
  left: 0;
  padding: 5px;
  width: 100%;
}

.textContainer {
}
</style>

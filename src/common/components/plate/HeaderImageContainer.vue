<template>
  <div :class="$style.wrapper" :style="wrapperStyle">
    <HeaderImage :height="control.height" :imageUrl="imageUrl" :width="control.width"></HeaderImage>
  </div>
</template>

<script>
import HeaderImage from '@/common/components/plate/HeaderImage';
import {justifyContentOf} from "@/common/utils/common-utils";

export default {
  props: ['control', 'qr'],

  components: {
    HeaderImage,
  },

  computed: {
    wrapperStyle() {
      return {
        justifyContent: justifyContentOf(this.control.alignType),
      }
    },

    imageUrl() {
      return this.qr.headerImageUrl;
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
}
</style>

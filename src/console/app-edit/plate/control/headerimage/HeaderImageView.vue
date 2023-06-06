<template>
  <div :class="$style.wrapper" :style="wrapperStyle">
    <HeaderImage :height="control.height" :imageUrl="placeHolderImageUrl" :width="control.width"></HeaderImage>
  </div>
</template>

<script>
import HeaderImage from '@/common/components/plate/HeaderImage';
import {justifyContentOf} from "@/common/utils/common-utils";
import avatarPlaceholder from '@/common/static/avatar-placeholder-dark.svg';

export default {
  props: ['control'],

  components: {
    HeaderImage,
  },

  computed: {
    wrapperStyle() {
      return {
        justifyContent: justifyContentOf(this.control.alignType),
      }
    },

    placeHolderImageUrl() {
      return avatarPlaceholder;
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
}
</style>

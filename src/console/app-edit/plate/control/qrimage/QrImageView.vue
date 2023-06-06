<template>
  <div :class="$style.wrapper" :style="wrapperStyle">
    <PlateQrImage :content="fakeContent" :setting="control.setting"></PlateQrImage>
  </div>
</template>

<script>
import PlateQrImage from '@/common/components/plate/PlateQrImage';
import {plateFakeQrUrl} from "@/common/utils/common-utils";

export default {
  props: ['control'],

  components: {
    PlateQrImage,
  },

  computed: {
    fakeContent() {
      return plateFakeQrUrl();
    },

    wrapperStyle() {
      return {
        textAlign: this.control.alignType,
      }
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>

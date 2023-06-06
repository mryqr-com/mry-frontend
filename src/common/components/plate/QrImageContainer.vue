<template>
  <div :class="$style.wrapper" :style="wrapperStyle">
    <PlateQrImage :content="qrContent" :setting="control.setting"></PlateQrImage>
  </div>
</template>

<script>
import PlateQrImage from '@/common/components/plate/PlateQrImage';

export default {
  props: ['control', 'qr'],

  components: {
    PlateQrImage,
  },

  computed: {
    qrContent() {
      return this.qr.url;
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

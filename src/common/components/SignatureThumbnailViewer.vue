<template>
  <img v-if="signature"
       :class="$style.wrapper"
       :src="imageThumbnailUrlWide(signature)"
       alt="签名"/>
</template>

<script>
import {imageThumbnailUrlWide} from '@/common/utils/image-utils'

export default {
  props: {
    signature: {
      type: Object,
    },
  },

  methods: {
    imageThumbnailUrlWide,
  }
}
</script>

<style lang="scss" module>
.wrapper {
  max-width: 60px;
  max-height: 32px;
  background-color: white;
  border: $primary1pxBorder;
}
</style>

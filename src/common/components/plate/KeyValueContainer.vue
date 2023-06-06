<template>
  <div :class="$style.wrapper">
    <PlateKeyValue :contentTexts="contentTexts" :control="control" :qrContent="qrContent"></PlateKeyValue>
  </div>
</template>

<script>
import PlateKeyValue from '@/common/components/plate/PlateKeyValue';
import {plateDisplayTextFor} from "@/common/utils/common-utils";

export default {
  props: ['control', 'qr'],

  components: {
    PlateKeyValue,
  },

  computed: {
    contentTexts() {
      return this.control.textValues.map(namedValue => {
        return {id: namedValue.id, text: plateDisplayTextFor(namedValue.value, this.qr)}
      });
    },

    qrContent() {
      return this.qr.url;
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>

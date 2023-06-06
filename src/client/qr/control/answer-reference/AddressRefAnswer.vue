<template>
  <BoxedTextViewer v-if="displayValue"
                   :class="$style.wrapper"
                   :textStyle="presentationControl.textAnswerStyle.textStyle">
    {{ displayValue }}
  </BoxedTextViewer>
</template>

<script>
import {displayAddress} from '@/common/utils/common-utils';

export default {
  props: ['refControl', 'presentationControl', 'value'],

  computed: {
    displayValue() {
      if (!this.value || !this.value.address) {
        return null;
      }

      return displayAddress(this.value.address);
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>

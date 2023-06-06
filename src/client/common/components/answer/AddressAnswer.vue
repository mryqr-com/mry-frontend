<template>
  <span v-if="displayValue" :class="$style.wrapper">{{ displayValue }}</span>
</template>

<script>
import {displayAddress} from '@/common/utils/common-utils';

export default {
  props: ['control', 'value'],

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

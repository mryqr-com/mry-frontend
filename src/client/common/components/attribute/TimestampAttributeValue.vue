<template>
  <span v-if="displayValue" :class="$style.wrapper">{{ displayValue }}</span>
</template>

<script>
import {formatEpochToMinute} from '@/common/utils/common-utils';

export default {
  props: ['attribute', 'value', 'refControl'],
  computed: {
    displayValue() {
      if (!this.value) {
        return null;
      }

      return formatEpochToMinute(this.value.timestamp);
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>

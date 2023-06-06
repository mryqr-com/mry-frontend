<template>
  <span v-if="displayValue != null" :class="$style.wrapper">{{ displayValue }}</span>
</template>

<script>
export default {
  props: ['control', 'value'],

  computed: {
    displayValue() {
      if (!this.value) {
        return null;
      }

      let displayNumber = (Math.round(this.value.number * 100) / 100).toFixed(this.control.precision);
      return this.control.suffix ? `${displayNumber} (${this.control.suffix})` : displayNumber;
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>

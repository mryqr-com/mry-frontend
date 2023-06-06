<template>
  <span v-if="displayValue != null" :class="$style.wrapper">{{ displayValue }}</span>
</template>

<script>
export default {
  props: ['attribute', 'value', 'refControl'],

  computed: {
    displayValue() {
      if (!this.value) {
        return null;
      }

      let displayNumber = (Math.round(this.value.number * 100) / 100).toFixed(this.attribute.precision);
      return this.attribute.suffix ? `${displayNumber} (${this.attribute.suffix})` : displayNumber;
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>

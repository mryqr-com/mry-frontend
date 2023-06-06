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

      if (this.attribute.suffix) {
        return `${this.value.number} (${this.attribute.suffix})`
      }

      return this.value.number;
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>

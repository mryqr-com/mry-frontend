<template>
  <span v-if="displayValue" :class="$style.wrapper">{{ displayValue }}</span>
</template>

<script>
export default {
  props: ['attribute', 'value', 'refControl'],

  computed: {
    displayValue() {
      if (!this.value) {
        return null;
      }

      return this.value.yes ? '是' : '否';
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
  font: inherit;
}
</style>

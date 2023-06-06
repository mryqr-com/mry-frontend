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

      return this.value.number;
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>

<template>
  <span v-if="refControl && displayValue" :class="$style.wrapper">{{ displayValue }}</span>
</template>

<script>

export default {
  props: ['attribute', 'value', 'refControl'],

  computed: {
    optionNameMap() {
      return new Map(this.refControl.options.map(it => [it.id, it.name]));
    },

    displayValue() {
      if (!this.value || !this.value.optionId) {
        return null;
      }

      return this.optionNameMap.get(this.value.optionId);
    }
  },
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>

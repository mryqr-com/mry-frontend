<template>
  <span v-if="displayValue" :class="$style.wrapper">{{ displayValue }}</span>
</template>

<script>
export default {
  props: ['control', 'value'],

  computed: {
    optionNameMap() {
      return new Map(this.control.options.map(it => [it.id, it.name]));
    },

    displayValue() {
      if (!this.value || !this.value.optionIds) {
        return null;
      }
      return this.value.optionIds.map(id => this.optionNameMap.get(id)).filter(name => !!name).join(", ");
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>

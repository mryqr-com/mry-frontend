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
      if (!this.value || !this.value.items) {
        return null;
      }

      return this.value.items.map(item => {
        let name = this.optionNameMap.get(item.optionId);
        return name ? `${name} x${item.number}` : null;
      }).filter(result => !!result).join(", ");
    },

  }
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>

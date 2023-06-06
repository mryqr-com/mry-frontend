<template>
  <span v-if="displayValue" :class="$style.wrapper" v-html="displayValue"></span>
</template>

<script>
export default {
  props: ['control', 'value'],

  computed: {
    optionMap() {
      return new Map(this.control.options.map(it => [it.id, it]));
    },

    displayValue() {
      if (!this.value || !this.value.optionId) {
        return null;
      }

      let option = this.optionMap.get(this.value.optionId);
      if (!option) {
        return null;
      }

      let name = option.name;
      let color = option.color;
      return `<span style="color: ${color};font:inherit;" >${name}</span>`;
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
  font: inherit;
}
</style>

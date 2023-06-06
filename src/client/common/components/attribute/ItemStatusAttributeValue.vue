<template>
  <span v-if="refControl && displayValue" :class="$style.wrapper" v-html="displayValue"></span>
</template>

<script>

export default {
  props: ['attribute', 'value', 'refControl'],

  computed: {

    optionMap() {
      return new Map(this.refControl.options.map(it => [it.id, it]));
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
  },
}
</script>

<style lang="scss" module>
.wrapper {
  font: inherit;
  color: inherit;
}
</style>

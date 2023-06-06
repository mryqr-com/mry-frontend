<template>
  <BoxedTextViewer v-if="displayValue"
                   :class="$style.wrapper"
                   :textStyle="presentationControl.textAnswerStyle.textStyle">
    {{ displayValue }}
  </BoxedTextViewer>
</template>

<script>
export default {
  props: ['refControl', 'presentationControl', 'value'],

  computed: {
    optionNameMap() {
      return new Map(this.refControl.options.map(it => [it.id, it.name]));
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

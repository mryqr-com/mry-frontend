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

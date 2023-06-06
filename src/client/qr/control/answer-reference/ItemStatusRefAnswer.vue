<template>
  <BoxedTextViewer v-if="displayValue"
                   :class="$style.wrapper"
                   :textStyle="presentationControl.textAnswerStyle.textStyle">
    <span :class="$style.content" v-html="displayValue"></span>
  </BoxedTextViewer>
</template>

<script>
export default {
  props: ['refControl', 'presentationControl', 'value'],

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
  }
}
</script>

<style lang="scss" module>
.wrapper {

}

.content {
  font: inherit;
}
</style>

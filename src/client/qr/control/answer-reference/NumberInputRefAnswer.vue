<template>
  <BoxedTextViewer v-if="displayValue != null"
                   :class="$style.wrapper"
                   :textStyle="presentationControl.textAnswerStyle.textStyle">
    {{ displayValue }}
  </BoxedTextViewer>
</template>

<script>
export default {
  props: ['refControl', 'presentationControl', 'value'],

  computed: {
    displayValue() {
      if (!this.value) {
        return null;
      }

      let displayNumber = (Math.round(this.value.number * 100) / 100).toFixed(this.refControl.precision);
      return this.refControl.suffix ? `${displayNumber} (${this.refControl.suffix})` : displayNumber;
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

</style>

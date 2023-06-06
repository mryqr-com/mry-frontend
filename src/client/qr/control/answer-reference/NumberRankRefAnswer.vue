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

      return this.value.number;
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

</style>

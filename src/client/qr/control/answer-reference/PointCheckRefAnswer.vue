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
    displayValue() {
      if (!this.value) {
        return null;
      }
      return this.value.pass ? '<span style="color: #10b01b;font:inherit;">正常</span>' : '<span style="color: #ea0000;font:inherit;" >异常</span>';
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

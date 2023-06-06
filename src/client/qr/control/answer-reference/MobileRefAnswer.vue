<template>
  <BoxedTextViewer v-if="value"
                   :class="$style.wrapper"
                   :textStyle="presentationControl.textAnswerStyle.textStyle">
    <MobileLinkViewer :mobile="value.text"></MobileLinkViewer>
  </BoxedTextViewer>
</template>

<script>
export default {
  props: ['refControl', 'presentationControl', 'value'],
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>

<template>
  <ImageListViewer v-if="images.length > 0"
                   :border="presentationControl.imageAnswerStyle.border"
                   :borderRadius="presentationControl.imageAnswerStyle.borderRadius"
                   :images="images"
                   :shadow="presentationControl.imageAnswerStyle.shadow"
                   :showName="presentationControl.imageAnswerStyle.showImageName"
                   :verticalMargin="presentationControl.imageAnswerStyle.verticalMargin"
                   :widthRatio="presentationControl.imageAnswerStyle.widthRatio">
  </ImageListViewer>
</template>

<script>
export default {
  props: ['refControl', 'presentationControl', 'value'],
  computed: {
    images() {
      if (!this.value) {
        return [];
      }

      return this.value.files;
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

</style>

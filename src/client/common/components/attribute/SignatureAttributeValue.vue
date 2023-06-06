<template>
  <SignatureThumbnailViewer v-if="displayImage" :signature="displayImage"></SignatureThumbnailViewer>
</template>

<script>

export default {
  props: ['attribute', 'value', 'refControl'],
  computed: {
    displayImage() {
      if (!this.value) {
        return null;
      }

      return this.value.files[0];
    }
  },
}
</script>

<style lang="scss" module>

</style>

<template>
  <ImageListThumbnailViewer v-if="displayImages.length > 0" :images="displayImages"></ImageListThumbnailViewer>
</template>

<script>
export default {
  props: ['attribute', 'value', 'refControl'],

  computed: {
    displayImages() {
      if (!this.value) {
        return [];
      }
      return this.value.files;
    }
  },

}
</script>

<style lang="scss" module>

</style>

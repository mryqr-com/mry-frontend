<template>
  <FileListLinkViewer v-if="displayFiles.length > 0" :files="displayFiles"></FileListLinkViewer>
</template>

<script>
export default {
  props: ['control', 'value'],
  computed: {
    displayFiles() {
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

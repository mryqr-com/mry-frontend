<template>
  <span v-if="files.length > 0" :class="$style.wrapper">
    <FileLinkViewer v-for="file in files"
                    :key="file.id"
                    :class="$style.fileLink"
                    :file="file">
    </FileLinkViewer>
  </span>
</template>

<script>
export default {
  props: {
    files: {
      type: Array,
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
}

.fileLink {
  padding-right: 10px;
}

</style>

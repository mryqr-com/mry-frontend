<template>
  <ImageListViewer v-if="signature.length > 0"
                   :border="border"
                   :borderRadius="0"
                   :images="signature"
                   :shadow="shadow">
  </ImageListViewer>
</template>

<script>
export default {
  props: ['refControl', 'presentationControl', 'value'],
  computed: {
    signature() {
      if (!this.value) {
        return [];
      }

      return this.value.files;
    },

    shadow() {
      return {
        width: 0,
        color: 'rgba(0, 0, 0, 0)'
      }
    },

    border() {
      return {
        type: 'SOLID',
        width: 1,
        sides: ['TOP', 'BOTTOM', 'LEFT', 'RIGHT'],
        color: '#DCDFE6'
      };
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

</style>

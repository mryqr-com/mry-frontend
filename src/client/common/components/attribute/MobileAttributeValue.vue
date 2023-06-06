<template>
  <MobileLinkViewer v-if="displayValue" :mobile="displayValue"></MobileLinkViewer>
</template>

<script>
export default {
  props: ['attribute', 'value', 'refControl'],

  computed: {
    displayValue() {
      if (!this.value) {
        return null;
      }

      return this.value.text;
    },
  },
}
</script>

<style lang="scss" module>

</style>

<template>
  <EmailLinkViewer v-if="displayValue" :email="displayValue"></EmailLinkViewer>
</template>

<script>
export default {
  props: ['control', 'value'],

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

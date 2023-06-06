<template>
  <GeolocationLinkViewer v-if="displayValue" :geolocation="displayValue"></GeolocationLinkViewer>
</template>

<script>

export default {
  props: ['control', 'value'],

  computed: {
    displayValue() {
      if (!this.value || !this.value.geolocation) {
        return null;
      }
      return this.value.geolocation;
    },
  },

}
</script>

<style lang="scss" module>
</style>

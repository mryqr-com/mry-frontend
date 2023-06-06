<template>
  <div :class="$style.wrapper">
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>

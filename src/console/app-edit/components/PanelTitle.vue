<template>
  <div :class="$style.wrapper">
    <slot></slot>
    <HelpDocLinker :url="helpUrl"></HelpDocLinker>
  </div>
</template>

<script>
export default {
  props: {
    helpUrl: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
  border-bottom: $primary1pxBorder;
  height: 36px;
  line-height: 36px;
  font-weight: bold;
  text-align: center;
  font-size: 14px;
}
</style>

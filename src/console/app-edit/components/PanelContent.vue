<template>
  <div :class="$style.wrapper">
    <PanelTitle :helpUrl="helpUrl">{{ title }}</PanelTitle>
    <div :class="$style.content">
      <slot></slot>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    title: {
      type: String,
      default: '面板'
    },

    helpUrl: {
      type: String,
      default: '//docs.mryqr.com'
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.content {
  padding: 0 20px;
}


</style>

<template>
  <el-button :class="$style.wrapper" size="mini" type="text" @click="onClick">
    <slot></slot>
  </el-button>
</template>

<script>
export default {
  methods: {
    onClick() {
      this.$emit("click");
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
  font-size: 13px;
  font-style: italic;
  padding: 0;
}
</style>

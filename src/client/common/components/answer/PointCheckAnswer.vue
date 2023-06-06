<template>
  <span v-if="displayValue" :class="$style.wrapper" v-html="displayValue"></span>
</template>

<script>
export default {
  props: ['control', 'value'],

  computed: {
    displayValue() {
      if (!this.value) {
        return null;
      }
      return this.value.pass ? '<span style="color: #10b01b;font:inherit;">正常</span>' : '<span style="color: #ea0000;font:inherit;" >异常</span>';
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
  font: inherit;
}
</style>

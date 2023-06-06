<template>
  <div :class="$style.wrapper">
    <div :class="$style.bar"></div>
    <div :class="$style.bar"></div>
    <div :class="$style.bar"></div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" module>
.wrapper {
  display: inline-block;
  width: 16px;
}

.bar {
  width: 16px;
  height: 2px;
  background-color: $regularTextColor;
  margin: 3px 0;
}
</style>

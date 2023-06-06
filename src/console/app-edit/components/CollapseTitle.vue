<template>
  <div :class="$style.wrapper">
        <span :class="$style.textWrapper">
        <slot></slot>
        </span>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" module>
.wrapper {
  font-size: 14px;
  font-weight: 500;
}

.textWrapper {
  color: $regularTextColor;
  padding-left: 5px;
  border-left: 3px solid $primaryThemeColor;
}

</style>

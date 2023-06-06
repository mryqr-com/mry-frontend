<template>
  <div :class="$style.wrapper">
        <span :class="$style.theText">
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
  margin-bottom: 5px;
  margin-top: 20px;
}

.theText {
  padding-left: 5px;
  border-left: 3px solid $primaryThemeColor;
}
</style>

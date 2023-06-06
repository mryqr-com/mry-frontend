<template>
  <div :class="$style.wrapper">
    <slot>验证错误</slot>
  </div>


</template>

<script>
export default {}
</script>

<style lang="scss" module>
.wrapper {
  font-size: 13px;
  color: red;
  margin-top: 3px;
}


</style>

<template>
  <div :class="$style.wrapper">
    <slot></slot>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" module>
.wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: whitesmoke;
}

</style>

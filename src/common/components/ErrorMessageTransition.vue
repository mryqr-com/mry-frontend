<template>
  <transition :enter-active-class="$style.enterActive"
              :enter-class="$style.enterClass"
              :leave-active-class="$style.leaveActive"
              :leave-to-class="$style.leaveTo">
    <slot></slot>
  </transition>

</template>

<script>
export default {}
</script>

<style lang="scss" module>

.enterActive, .leaveActive {
  transition: opacity .5s;
}

.enterClass, .leaveTo {
  opacity: 0;
}


</style>

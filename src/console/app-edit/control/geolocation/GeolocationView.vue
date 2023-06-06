<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">
    <StyledButton :buttonStyle="control.buttonStyle"
                  :class="$style.theButton">
      <i class="el-icon-location-outline"></i> &nbsp;获取当前位置
    </StyledButton>
  </div>
</template>

<script>
export default {
  props: ['control', 'tabletView', "controlIndex"],
}
</script>

<style lang="scss" module>
.wrapper {
}

.wrapperWide {
  max-width: $maxControlButtonWidth;
}

.theButton {
  pointer-events: none;
}

</style>

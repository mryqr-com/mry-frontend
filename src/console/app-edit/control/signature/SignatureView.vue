<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">
    <StyledButton :buttonStyle="control.buttonStyle"
                  :class="$style.theButton">
      <i class="el-icon-edit"></i>&nbsp;{{ buttonText }}
    </StyledButton>
  </div>
</template>

<script>
export default {
  props: ['control', 'tabletView', "controlIndex"],
  data() {
    return {};
  },

  computed: {
    buttonText() {
      return this.control.buttonText ? this.control.buttonText : '签名';
    }
  },

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

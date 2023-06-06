<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">
    <StyledButton :buttonStyle="control.buttonStyle"
                  :class="$style.theButton">
      <i class="el-icon-plus"></i> &nbsp;{{ buttonText }}（0/{{ control.maxItem }}）
    </StyledButton>
  </div>
</template>

<script>
export default {
  props: ['control', 'tabletView', "controlIndex"],
  data() {
    return {
      value: null
    };
  },

  computed: {
    buttonText() {
      return this.control.buttonText ? this.control.buttonText : '新增';
    }
  },

  methods: {
    noclick(e) {
      this.$refs['theSelect'].blur();
      this.$el.click();
    }
  }
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

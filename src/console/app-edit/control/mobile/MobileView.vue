<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">
    <el-input v-model="value"
              :class="[$style.theInput,{[$style.theInputWide]: tabletView}]"
              :placeholder="control.placeholder"
              :spellcheck="false"
              prefix-icon="el-icon-mobile-phone"
              readonly>
    </el-input>
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

}
</script>

<style lang="scss" module>
.wrapper {
}

.theInput {
  pointer-events: none;

  :global {
    .el-input__inner {
      cursor: pointer;
    }
  }
}

.theInputWide {
  max-width: $maxControlInputWidth;
}

</style>

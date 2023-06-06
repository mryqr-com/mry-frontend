<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">
    <el-input :class="[$style.theInput,{[$style.theInputWide]: tabletView}]"
              :placeholder="control.placeholder"
              :spellcheck="false"
              :value="value"
              prefix-icon="el-icon-time"
              readonly>
    </el-input>
  </div>
</template>

<script>
export default {
  props: ['control', 'tabletView', "controlIndex"],

  computed: {
    value() {
      let now = new Date();
      let minutes = now.getMinutes();
      let hours = now.getHours();

      return this.control.defaultToNow ? `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}` : null;
    }
  }

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

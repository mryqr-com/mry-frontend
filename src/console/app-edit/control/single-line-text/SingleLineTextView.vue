<template>
  <div v-bind:class="[ $style.wrapper]">
    <el-input v-model="value"
              :class="[$style.theInput,{[$style.theInputWide]: tabletView}]"
              :placeholder="control.placeholder"
              :spellcheck="false"
              readonly
              size="small">
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
      height: $formPageInputHeight;
    }
  }
}

.theInputWide {
  max-width: $maxControlContentWidth;
}

</style>

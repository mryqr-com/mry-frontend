<template>
  <div v-bind:class="[ $style.wrapper]">
    <el-input v-model="value"
              :class="[$style.theInput,{[$style.theInputWide]: tabletView}]"
              :placeholder="control.placeholder"
              :rows="control.rows"
              readonly
              size="small"
              type="textarea">
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
    .el-textarea__inner {
      cursor: pointer;
    }
  }
}

.theInputWide {
  max-width: $maxControlContentWidth;
}

</style>

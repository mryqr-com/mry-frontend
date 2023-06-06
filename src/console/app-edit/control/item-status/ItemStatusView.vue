<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">
    <el-select ref="theSelect"
               v-model="value"
               :class="[$style.theSelect,{[$style.autoCalculate]:control.shouldAutoCalculate}]"
               :placeholder="control.placeholder"
               @visible-change="noclick">
    </el-select>
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
  :global {
    .el-select {
      width: 100%;
    }
  }
}

.wrapperWide {
  :global {
    .el-select {
      max-width: $maxControlSelectionWidth;
    }
  }
}

.theSelect {
  pointer-events: none;
}

.autoCalculate {
  background-color: $lightBackgroundColor;
}

</style>

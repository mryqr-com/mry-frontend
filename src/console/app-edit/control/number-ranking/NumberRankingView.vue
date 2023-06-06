<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">
    <el-rate v-model="value"
             :class="$style.theRate"
             :max="control.max">
    </el-rate>
  </div>
</template>

<script>
export default {
  props: ['control', 'tabletView', "controlIndex"],
  data() {
    return {
      value: 0
    };
  },

}
</script>

<style lang="scss" module>
.wrapper {
}

.theRate {
  pointer-events: none;
  height: 24px;
  margin-top: 8px;
  margin-bottom: 8px;

  :global {
    .el-rate__icon {
      font-size: 24px;
    }
  }
}

</style>

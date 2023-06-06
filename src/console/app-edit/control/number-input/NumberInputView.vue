<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">

    <div :class="[$style.answerContainer,{[$style.answerContainerWide]: tabletView}]">
      <el-input v-model="value"
                :class="[$style.theInput,{[$style.autoCalculate]:control.shouldAutoCalculate}]"
                :placeholder="control.placeholder"
                prefix-icon="el-icon-s-grid">
      </el-input>

      <div v-if="control.suffix" :class="$style.suffix">{{ control.suffix }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['control', 'tabletView', "controlIndex"],
  data() {
    return {
      value: ''
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

.answerContainer {
  display: flex;
  align-items: center;
}

.theInput {
  flex-basis: 100px;
  flex-grow: 1;
}

.autoCalculate {
  :global {
    .el-input__inner {
      background-color: $lightBackgroundColor !important;
    }
  }
}

.suffix {
  height: $formPageInputHeight;
  line-height: $formPageInputHeight;
  overflow: hidden;
  padding-left: 2px;
}

.answerContainerWide {
  max-width: $maxControlInputWidth;
}

</style>

<template>
  <div :class="$style.wrapper">
    <el-radio-group v-model="radio" :class="[$style.radioGroup,{[$style.radioGroupWide]: tabletView}]">
      <el-radio v-for="item in control.options"
                :key="item.id"
                :ref="item.id"
                :class="[$style.theRadio,{[$style.theRadioWide]: tabletView}]"
                :label="item.id">
        {{ item.name }}
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  props: ['control', 'tabletView', "controlIndex"],
  data() {
    return {
      radio: null
    };
  },
}
</script>

<style lang="scss" module>
.wrapper {
  :global {
    .el-radio-group {
      width: 100%;
    }

    .el-radio {
      margin-right: 0;
    }

    .el-radio__input {
      margin-left: 10px;
    }
  }
}

.radioGroup {
  overflow: hidden;
  border: $primary1pxBorder;
}

.radioGroupWide {
  border: none;

  :global {
    .el-radio__input {
      margin-left: 0;
    }
  }

}

.theRadio {
  pointer-events: none;
  display: block;
  height: $formPageInputHeight;
  line-height: $formPageInputHeight;
  border-bottom: $primary1pxBorder;
}

.theRadio:last-child {
  border-bottom: none;
}

.theRadioWide {
  border-bottom: none;
}


</style>

<template>
  <div :class="$style.wrapper">
    <el-checkbox-group v-model="checklist" :class="[$style.checkboxGroup,{[$style.checkboxGroupWide]: tabletView}]">
      <el-checkbox v-for="item in control.options"
                   :key="item.id"
                   :class="[$style.theBox,{[$style.theBoxWide]: tabletView}]"
                   :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  props: ['control', 'tabletView', "controlIndex"],
  data() {
    return {
      checklist: []
    };
  },
}
</script>

<style lang="scss" module>
.wrapper {
  :global {
    .el-checkbox-group {
      width: 100%;
    }

    .el-checkbox {
      margin-right: 0;
    }

    .el-checkbox__input {
      margin-left: 10px;
    }

    .el-checkbox__label {
      font-size: 14px;
      font-weight: normal;
      padding-left: 13px;
    }

  }
}

.checkboxGroup {
  overflow: hidden;
  border: $primary1pxBorder;
}

.checkboxGroupWide {
  border: none;

  :global {
    .el-checkbox__input {
      margin-left: 0;
    }
  }
}

.theBox {
  pointer-events: none;
  display: block;
  height: $formPageInputHeight;
  line-height: $formPageInputHeight;
  border-bottom: $primary1pxBorder;
}

.theBox:last-child {
  border-bottom: none;
}

.theBoxWide {
  border-bottom: none;
}

</style>

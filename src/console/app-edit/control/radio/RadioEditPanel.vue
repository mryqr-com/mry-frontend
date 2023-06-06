<template>
  <div :class="$style.wrapper">
    <OptionSelector v-model="value.options" title="编辑选项，最多可添加20个"></OptionSelector>
    <EditTitle>基本设置</EditTitle>
    <div class="keyValueSettingContainer" title="赋值后，可用于数字控件和状态选择控件的自动计算">
      选项赋值：
      <el-button class="rightInputWidth" size="mini" type="plain" @click="openNumericalValueSettingDialog">
        赋值设置...
      </el-button>
    </div>

    <NumericalValueSettingDialog :options="value.options"
                                 :show.sync="numericalValueDialogVisible">
    </NumericalValueSettingDialog>
  </div>
</template>

<script>
import OptionSelector from '@/console/app-edit/components/OptionSelector';
import NumericalValueSettingDialog from '@/console/app-edit/control/NumericalValueSettingDialog';

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
  },

  components: {
    OptionSelector,
    NumericalValueSettingDialog
  },

  data() {
    return {
      numericalValueDialogVisible: false,
    }
  },

  methods: {
    openNumericalValueSettingDialog() {
      this.numericalValueDialogVisible = true;
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {

}
</style>

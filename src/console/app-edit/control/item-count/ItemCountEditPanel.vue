<template>
  <div :class="$style.wrapper">
    <OptionSelector v-model="value.options" :max="100" title="编辑选项，最多可添加100个"></OptionSelector>

    <EditTitle>基本设置</EditTitle>
    <div class="keyValueSettingContainer">
      最大可选明细条数：
      <el-input-number v-model="value.maxItem"
                       :max="100"
                       :min="1"
                       :stepStrictly="true"
                       class="rightInputWidth"
                       controls-position="right"
                       size="mini"
                       title="最大可选明细条数">
      </el-input-number>
    </div>

    <div class="keyValueSettingContainer">
      单条明细最大数量：
      <el-input-number v-model="value.maxNumberPerItem"
                       :max="1000000"
                       :min="1"
                       :stepStrictly="true"
                       class="rightInputWidth"
                       controls-position="right"
                       size="mini"
                       title="单条明细最大数量">
      </el-input-number>
    </div>

    <div class="keyValueSettingContainer">
      按钮文本：
      <el-input v-model="value.buttonText"
                :maxlength="10"
                :spellcheck="false"
                class="rightInputWidth"
                size="mini"
                title="按钮文本">
      </el-input>
    </div>

    <div class="keyValueSettingContainer">
      按钮样式：
      <el-popover placement="bottom"
                  trigger="click"
                  width="300">
        <el-button slot="reference" class="rightInputWidth" size="mini" title="设置按钮样式" type="plain">按钮样式...</el-button>
        <ButtonStyleInput v-model="value.buttonStyle"></ButtonStyleInput>
      </el-popover>
    </div>

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
    NumericalValueSettingDialog,
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

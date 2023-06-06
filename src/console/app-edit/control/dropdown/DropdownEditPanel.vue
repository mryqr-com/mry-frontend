<template>
  <div :class="$style.wrapper">
    <OptionSelector v-model="value.options" :max="100" title="编辑选项，最多可添加100个"></OptionSelector>

    <EditTitle>基本设置</EditTitle>
    <div class="singleLineTitle marginTop10">占位符</div>
    <el-input v-model="value.placeholder"
              :maxlength="50"
              :spellcheck="false"
              class="settingMarginBottom"
              size="mini"
              title="占位符">
    </el-input>

    <el-checkbox v-model="value.filterable"
                 class="settingMarginBottom block"
                 size="mini"
                 title="选项是否可搜索">
      可搜索
    </el-checkbox>

    <el-checkbox v-model="value.multiple"
                 class="settingMarginBottom block"
                 size="mini"
                 title="是否多选">
      多选
    </el-checkbox>

    <MinMaxEditor v-if="value.multiple"
                  v-model="value.minMaxSetting"
                  :maxMax="100"
                  :minMin="0"
                  :precision="0"
                  :step="1"
                  :stepStrictly="true"
                  maxText="最大可选数："
                  minText="最小可选数：">
    </MinMaxEditor>

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

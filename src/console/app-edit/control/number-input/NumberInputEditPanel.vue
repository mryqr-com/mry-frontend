<template>
  <div :class="$style.wrapper">
    <EditTitle>基本设置</EditTitle>
    <div class="singleLineTitle marginTop10">占位符</div>
    <el-input v-model="value.placeholder"
              :maxlength="50"
              :spellcheck="false"
              class="settingMarginBottom"
              size="mini"
              title="占位符">
    </el-input>

    <div :class="$style.autoCalculate" class="keyValueSettingContainer" title="控件提交值由其它控件计算而得">
      <el-checkbox v-model="value.autoCalculateEnabled" size="mini">
        自动计算
      </el-checkbox>

      <el-button v-if="value.autoCalculateEnabled"
                 class="rightInputWidth"
                 size="mini"
                 type="plain"
                 @click="openAutoCalculateSettingDialog">
        自动计算规则...
      </el-button>
    </div>

    <MinMaxEditor v-if="!value.autoCalculateEnabled"
                  v-model="value.minMaxSetting"
                  :maxMax="1000000000"
                  :minMin="-1000000000"
                  :precision="value.precision"
                  :stepStrictly="false"
                  maxText="最大值："
                  minText="最小值：">
    </MinMaxEditor>

    <div class="keyValueSettingContainer">
      最多保留小数位：
      <el-input-number v-model="value.precision"
                       :max="3"
                       :min="0"
                       :stepStrictly="true"
                       class="rightInputWidth"
                       controls-position="right"
                       size="mini"
                       title="最多保留小数位">
      </el-input-number>
    </div>

    <div class="keyValueSettingContainer">
      后缀：
      <el-input v-model.trim="value.suffix"
                :maxlength="10"
                :spellcheck="false"
                class="rightInputWidth"
                size="mini"
                title="后缀">
      </el-input>
    </div>

    <NumberInputAutoCalculateSettingDialog v-model="value.autoCalculateSetting"
                                           :selectableControls="selectableAnswerNumericalControls"
                                           :show.sync="autoCalculateSettingDialogVisible">
    </NumberInputAutoCalculateSettingDialog>
  </div>
</template>

<script>
import NumberInputAutoCalculateSettingDialog
  from '@/console/app-edit/control/number-input/NumberInputAutoCalculateSettingDialog';
import {createNamespacedHelpers} from "vuex";

const {mapGetters} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
  },

  components: {
    NumberInputAutoCalculateSettingDialog,
  },

  data() {
    return {
      autoCalculateSettingDialogVisible: false,
    }
  },

  computed: {
    ...mapGetters([
      'currentPageAllAnswerNumericalControls'
    ]),

    selectableAnswerNumericalControls() {
      return this.currentPageAllAnswerNumericalControls.filter(control => {
        return control.id !== this.value.id;
      });
    }
  },

  methods: {
    openAutoCalculateSettingDialog() {
      this.autoCalculateSettingDialogVisible = true;
    }
  }

}
</script>

<style lang="scss" module>
.wrapper {
}

.autoCalculate {
  min-height: 29px;
}

</style>

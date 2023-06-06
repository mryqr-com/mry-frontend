<template>
  <div :class="$style.wrapper">
    <ColoredOptionSelector v-model="value.options"
                           :max="10"
                           :min="2"
                           buttonText="添加状态"
                           title="设置状态选项"
                           @optionDeleted="onOptionDeleted">
    </ColoredOptionSelector>

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

    <div v-if="!value.autoCalculateEnabled" class="keyValueSettingContainer" title="初始状态，当表单提交时没有提供该控件值时，系统将自动填写为该初始状态">
      初始状态：
      <el-select v-model="value.initialOptionId"
                 class="rightInputWidth"
                 clearable
                 placeholder="请选择"
                 size="mini">
        <el-option
            v-for="option in value.options"
            :key="option.id"
            :label="option.name"
            :value="option.id">
        </el-option>
      </el-select>
    </div>

    <ItemStatusAutoCalculateSettingDialog v-model="value.autoCalculateSetting"
                                          :options="value.options"
                                          :selectableControls="selectableAnswerNumericalControls"
                                          :show.sync="autoCalculateSettingDialogVisible">
    </ItemStatusAutoCalculateSettingDialog>
  </div>
</template>

<script>
import ColoredOptionSelector from '@/console/app-edit/components/ColoredOptionSelector'
import ItemStatusAutoCalculateSettingDialog
  from '@/console/app-edit/control/item-status/ItemStatusAutoCalculateSettingDialog';
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
    ColoredOptionSelector,
    ItemStatusAutoCalculateSettingDialog
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
      return this.currentPageAllAnswerNumericalControls;
    }
  },

  methods: {
    onOptionDeleted(id) {
      if (id === this.value.initialOptionId) {
        this.value.initialOptionId = null;
      }
    },

    openAutoCalculateSettingDialog() {
      this.autoCalculateSettingDialogVisible = true;
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

</style>

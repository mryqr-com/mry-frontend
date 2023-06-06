<template>
  <el-dialog :title="isNew? `新建控件提交值值域分布报表`:`编辑控件提交值值域分布报表`"
             :visible.sync="visible"
             width="500px"
             @close="$emit('update:show', false)"
             @open="initDialog">
    <el-form v-if="internalReport.setting"
             ref="theForm"
             :hide-required-asterisk="true"
             :model="internalReport"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="onSubmit">

      <el-form-item ref="nameItem" label="名称：" prop="name">
        <el-input ref="nameInput"
                  v-model="internalReport.name"
                  :class="$style.fieldInput"
                  :maxlength="20"
                  :spellcheck="false"
                  size="medium">
        </el-input>
      </el-form-item>

      <el-form-item ref="segmentTypeItem" label="统计类型：" prop="setting.segmentType">
        <el-select v-model="internalReport.setting.segmentType"
                   :class="$style.fieldInput"
                   placeholder="请选择统计类型"
                   size="medium"
                   title="统计类型">
          <el-option
              v-for="type in segmentTypes"
              :key="type.key"
              :label="type.name"
              :value="type.key">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item ref="pageIdItem" label="页面：" prop="setting.pageId">
        <el-select v-model="internalReport.setting.pageId"
                   :class="$style.fieldInput"
                   placeholder="请选择需引用的页面"
                   size="medium"
                   title="所引用的页面"
                   @change="clearControlSelection">
          <el-option v-for="page in homePageExplicitAllPageReferences"
                     :key="page.id"
                     :label="page.name"
                     :value="page.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item ref="basedControlIdItem" label="基准控件：" prop="setting.basedControlId">
        <el-select v-model="internalReport.setting.basedControlId"
                   :class="$style.fieldInput"
                   placeholder="请选择基准控件"
                   size="medium"
                   title="所引用的基准控件">
          <el-option
              v-for="control in allAnswerNumberedControlsOfPage(internalReport.setting.pageId)"
              :key="control.id"
              :label="controlFieldName(control)"
              :value="control.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item ref="numberRangeItem" label="基准控件值域分段：" prop="setting.numberRangesString">
        <el-input ref="numberRangeItem"
                  v-model="internalReport.setting.numberRangesString"
                  :class="$style.fieldInput"
                  :maxlength="100"
                  :spellcheck="false"
                  placeholder="请输入以逗号分隔的数字分段，比如10,20,30,40,50"
                  size="medium">
        </el-input>
      </el-form-item>

      <el-form-item
          v-if="internalReport.setting.segmentType && internalReport.setting.segmentType !== 'SUBMIT_COUNT_SUM'"
          ref="targetControlIdItem"
          label="目标控件："
          prop="setting.targetControlId">
        <el-select v-model="internalReport.setting.targetControlId"
                   :class="$style.fieldInput"
                   placeholder="请选择目标控件"
                   size="medium"
                   title="所引用的目标控件">
          <el-option
              v-for="control in allAnswerNumberedControlsOfPage(internalReport.setting.pageId)"
              :key="control.id"
              :label="controlFieldName(control)"
              :value="control.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item ref="rangeItem" label="统计时间范围：" prop="setting.range">
        <el-select v-model="internalReport.setting.range"
                   :class="$style.fieldInput"
                   placeholder="请选择时间范围"
                   size="medium"
                   title="统计时间范围设置">
          <el-option
              v-for="range in ranges"
              :key="range.key"
              :label="range.name"
              :value="range.key">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button :class="$style.footerButton"
                 icon="el-icon-close"
                 size="medium"
                 type="plain"
                 @click="cancel">
        取消
      </el-button>
      <el-button :class="$style.footerButton"
                 icon="el-icon-check"
                 size="medium"
                 type="primary"
                 @click="onSubmit">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {cloneDeep} from 'lodash-es';
import {createNamespacedHelpers} from "vuex";
import reportRanges from "@/common/utils/report-ranges";
import {controlFieldName} from "@/common/utils/common-utils";
import submissionSegmentTypes from '@/common/utils/submission-segment-types';
import validations from "@/common/utils/validations";

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    report: {
      type: Object,
    },

    isNew: {
      type: Boolean,
      required: true,
    },
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  data() {
    return {
      visible: this.show,
      internalReport: {},
      rules: {
        name: [
          {required: true, message: '请输入报表名称', trigger: 'change'},
          {max: 20, message: '名称不能超过20个字符', trigger: 'change'},
        ],

        'setting.segmentType': [
          {required: true, message: '请选择统计类型', trigger: 'change'},
        ],

        'setting.pageId': [
          {required: true, message: '请选择页面', trigger: 'change'},
        ],

        'setting.basedControlId': [
          {required: true, message: '请选择基准控件', trigger: 'change'},
        ],

        'setting.numberRangesString': [
          {required: true, message: '请设置值域分段', trigger: 'change'},
          {validator: validations.NUMBER_RANGE_SEGMENT_RULE, trigger: 'blur'}
        ],

        'setting.targetControlId': [
          {required: true, message: '请选择目标控件', trigger: 'change'},
        ],

        'setting.range': [
          {required: true, message: '请选择统计时间范围', trigger: 'change'},
        ],
      }
    }
  },

  computed: {
    ...appOperationStore.mapGetters([
      'allAnswerNumberedControlsOfPage',
      'homePageExplicitAllPageReferences',
    ]),

    segmentTypes() {
      return submissionSegmentTypes;
    },

    ranges() {
      return reportRanges;
    },
  },

  methods: {
    controlFieldName,
    initDialog() {
      this.internalReport = cloneDeep(this.report);
      this.$nextTick(() => {
        this.$refs['nameInput'].focus();
        this.$refs['theForm'].clearValidate();
      });
    },

    clearControlSelection() {
      this.internalReport.setting.basedControlId = null;
      this.internalReport.setting.targetControlId = null;
    },

    onSubmit() {
      this.$refs['theForm'].validate().then(() => {
        this.$emit("updated", this.internalReport);
        this.visible = false;
      }).catch(e => {
      });
    },

    cancel() {
      this.visible = false;
    }
  }
}
</script>

<style lang="scss" module>
.fieldInput {
  width: 100%;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>

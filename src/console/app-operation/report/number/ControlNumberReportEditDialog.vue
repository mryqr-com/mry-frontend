<template>
  <el-dialog :title="isNew? '新建控件提交值数字报表':'编辑控件提交值数字报表'"
             :visible.sync="visible"
             width="500px"
             @close="$emit('update:show', false)"
             @open="initDialog">
    <el-form ref="theForm"
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

      <el-form-item ref="pageIdItem" label="页面：" prop="pageId">
        <el-select v-model="internalReport.pageId"
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

      <el-form-item ref="controlIdItem" label="控件：" prop="controlId">
        <el-select v-model="internalReport.controlId"
                   :class="$style.fieldInput"
                   placeholder="请选择需引用的控件"
                   size="medium"
                   title="所引用的控件">
          <el-option
              v-for="control in allAnswerNumberedControlsOfPage(internalReport.pageId)"
              :key="control.id"
              :label="controlFieldName(control)"
              :value="control.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item ref="aggregationItem" label="统计方式：" prop="numberAggregationType">
        <el-select v-model="internalReport.numberAggregationType"
                   :class="$style.fieldInput"
                   placeholder="请选择统计方式"
                   size="medium"
                   title="统计方式设置">
          <el-option
              v-for="type in aggregationTypes"
              :key="type.key"
              :label="type.name"
              :value="type.key">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item ref="rangeItem" label="统计时间范围：" prop="range">
        <el-select v-model="internalReport.range"
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

      <el-form-item ref="suffixItem" label="后缀：" prop="suffix">
        <el-input ref="suffixInput"
                  v-model.trim="internalReport.suffix"
                  :class="$style.fieldInput"
                  :maxlength="10"
                  :spellcheck="false"
                  size="medium">
        </el-input>
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
import numberAggregationTypes from "@/common/utils/number-aggregation-types";
import {controlFieldName} from "@/common/utils/common-utils";

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    report: {
      type: Object,
      required: true
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

        pageId: [
          {required: true, message: '请选择页面', trigger: 'change'},
        ],

        controlId: [
          {required: true, message: '请选择控件', trigger: 'change'},
        ],

        suffix: [
          {max: 10, message: '后缀不能超过10个字符', trigger: 'change'},
        ],

        range: [
          {required: true, message: '请选择统计时间范围', trigger: 'change'},
        ],

        numberAggregationType: [
          {required: true, message: '请选择统计方式', trigger: 'change'},
        ],
      }
    }
  },

  computed: {
    ...appOperationStore.mapGetters([
      'allAnswerNumberedControlsOfPage',
      'homePageExplicitAllPageReferences',
    ]),

    ranges() {
      return reportRanges;
    },

    aggregationTypes() {
      return numberAggregationTypes;
    }
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
      this.internalReport.controlId = null;
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

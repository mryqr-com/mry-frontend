<template>
  <el-dialog :title="`样式设置:【${report.name}】`"
             :visible.sync="visible"
             width="500px"
             @close="$emit('update:show', false)"
             @open="initDialog">
    <el-form v-if="internalReport.style"
             ref="theForm"
             :hide-required-asterisk="true"
             :model="internalReport"
             :rules="rules"
             label-position="left"
             label-width="150px"
             @submit.native.prevent="onSubmit">

      <el-form-item ref="spanItem" label="宽度：" prop="span">
        <el-select v-model.number="internalReport.span"
                   :class="$style.fieldInput"
                   placeholder="请选择宽度"
                   size="medium"
                   title="报表占所在行的宽度比例">
          <el-option
              v-for="type in spanTypes"
              :key="type.key"
              :label="type.name"
              :value="type.key">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item ref="aspectRatioItem" label="高宽比(%)：" prop="aspectRatio">
        <el-input-number v-model.number="internalReport.aspectRatio"
                         :class="[$style.fieldInput,$style.numberInput]"
                         :max="100"
                         :min="30"
                         :step="5"
                         :stepStrictly="true"
                         controls-position="right"
                         size="medium"
                         title="高宽比">
        </el-input-number>
      </el-form-item>

      <el-form-item ref="maxItem" label="最大显示数据条数：" prop="style.max">
        <el-input-number v-model="internalReport.style.max"
                         :class="[$style.fieldInput,$style.numberInput]"
                         :max="20"
                         :min="1"
                         :step="1"
                         :stepStrictly="true"
                         controls-position="right"
                         size="medium"
                         title="最大显示数据条数">
        </el-input-number>
      </el-form-item>

      <el-form-item ref="xTitleItem" label="横轴标题：" prop="style.xTitle">
        <el-input v-model="internalReport.style.xTitle"
                  :class="$style.fieldInput"
                  :maxlength="50"
                  :spellcheck="false"
                  size="medium">
        </el-input>
      </el-form-item>

      <el-form-item ref="yTitleItem" label="纵轴标题：" prop="style.yTitle">
        <el-input v-model="internalReport.style.yTitle"
                  :class="$style.fieldInput"
                  :maxlength="50"
                  :spellcheck="false"
                  size="medium">
        </el-input>
      </el-form-item>

      <el-form-item ref="colorItem" label="颜色：" prop="style.colors">
        <MryColorPicker v-for="index in barCount"
                        :key="index"
                        v-model="internalReport.style.colors[index-1]"
                        :title="`第${index}条图形颜色`">
        </MryColorPicker>
      </el-form-item>

      <el-checkbox v-model="internalReport.style.horizontal" class="settingMarginBottom block">水平显示</el-checkbox>
      <el-checkbox v-model="internalReport.style.hideGrid" class="settingMarginBottom block">隐藏网格</el-checkbox>
      <el-checkbox v-model="internalReport.style.showNumber">显示数字</el-checkbox>
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
import {createNamespacedHelpers} from "vuex";
import {cloneDeep} from 'lodash-es';
import spanTypes from '@/console/app-operation/report/chart/chart-report-span-types';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    report: {
      type: Object,
      default: true,
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
        'style.xTitle': [
          {max: 50, message: '横轴标题不能超过50个字符', trigger: 'change'},
        ],

        'style.yTitle': [
          {max: 50, message: '纵轴标题不能超过50个字符', trigger: 'change'},
        ],
      }
    }
  },

  computed: {
    ...appOperationStore.mapGetters(['currentAppChartReportSetting']),

    spanTypes() {
      return spanTypes;
    },

    barCount() {
      if (this.report.type === 'CONTROL_BAR_REPORT') {
        if (this.report.setting.segmentType === 'SUBMIT_COUNT_SUM') {
          return 1;
        }

        return this.report.setting.targetControlIds.length;
      } else {
        if (this.report.setting.segmentType === 'QR_COUNT_SUM') {
          return 1;
        }

        return this.report.setting.targetAttributeIds.length;
      }
    },
  },

  methods: {
    initDialog() {
      this.internalReport = cloneDeep(this.report);
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
    },

  }
}
</script>

<style lang="scss" module>
.fieldInput {
  width: 100%;
}

.numberInput {
  :global {
    .el-input__inner {
      text-align: left !important;
      padding-left: 10px !important;
    }
  }
}

.footerButton {
  width: $dialogButtonWidth;
}
</style>

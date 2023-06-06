<template>
  <div :class="$style.wrapper">
    <EditTitle>统计项</EditTitle>
    <div class="singleLineTitle">统计类型</div>
    <el-select v-model="value.segmentType"
               :class="$style.selectInput"
               class="marginBottom10"
               placeholder="请选择统计类型"
               size="mini"
               title="统计类型"
               @change="clearPageAndControlSelection">
      <el-option
          v-for="range in types"
          :key="range.key"
          :label="range.name"
          :value="range.key">
      </el-option>
    </el-select>

    <div class="singleLineTitle">页面</div>
    <el-select v-model="value.pageId"
               :class="$style.selectInput"
               class="marginBottom10"
               placeholder="请选择需引用的页面"
               size="mini"
               title="所引用的页面"
               @change="clearControlSelection">
      <el-option
          v-for="page in allPageSummaries"
          :key="page.id"
          :label="page.name"
          :value="page.id">
      </el-option>
    </el-select>

    <div class="singleLineTitle">基准控件(x轴)</div>
    <el-select v-model="value.basedControlId"
               :class="$style.selectInput"
               placeholder="请选择统计基准控件"
               size="mini"
               title="基准控件，基准控件一般为一些提供离散值的控件以便进行统计分类，比如单选、多选控件等">
      <el-option
          v-for="control in allAnswerCategorizedControlsOfPage(value.pageId)"
          :key="control.id"
          :label="controlFieldName(control)"
          :value="control.id">
      </el-option>
    </el-select>

    <template v-if="refBasedControlType === 'ADDRESS' || refBasedControlType==='GEOLOCATION'">
      <div class="singleLineTitle marginTop10">统计粒度</div>
      <el-select v-model="value.addressPrecisionType"
                 :class="$style.selectInput"
                 placeholder="统计粒度"
                 size="mini"
                 title="统计粒度">
        <el-option
            v-for="range in addressPrecisionTypes"
            :key="range.type"
            :label="range.text"
            :value="range.type">
        </el-option>
      </el-select>
    </template>

    <template v-if="refBasedControlType === 'MULTI_LEVEL_SELECTION'">
      <div class="singleLineTitle marginTop10">统计粒度</div>
      <el-select v-model="value.multiLevelSelectionPrecisionType"
                 :class="$style.selectInput"
                 placeholder="统计粒度"
                 size="mini"
                 title="统计粒度">
        <el-option
            v-for="range in multiLevelSelectionPrecisionTypes"
            :key="range.type"
            :label="range.text"
            :value="range.type">
        </el-option>
      </el-select>
    </template>

    <template v-if="value.segmentType !== 'SUBMIT_COUNT_SUM'">
      <div class="singleLineTitle marginTop10">目标控件(y轴)</div>
      <el-select ref="targetSelect"
                 v-model="value.targetControlIds"
                 :class="$style.selectInput"
                 :multiple="true"
                 :multiple-limit="2"
                 placeholder="请选择需要统计数值的目标控件"
                 size="mini"
                 title="目标控件和基准控件来自于相同页面"
                 @change="collapseDropdown('targetSelect')">
        <el-option v-for="control in allAnswerNumberedControlsOfPage(value.pageId)"
                   :key="control.id"
                   :label="controlFieldName(control)"
                   :value="control.id">
        </el-option>
      </el-select>
    </template>

    <EditTitle>基本设置</EditTitle>
    <div class="keyValueSettingContainer">
      时间范围：
      <el-select v-model="value.range"
                 class="width130"
                 placeholder="请选择时间范围"
                 size="mini"
                 title="统计时间范围设置">
        <el-option
            v-for="range in ranges"
            :key="range.key"
            :label="range.name"
            :value="range.key">
        </el-option>
      </el-select>
    </div>

    <div class="keyValueSettingContainer">
      缩放比例(%)：
      <el-input-number v-model="value.sizeRatio"
                       :max="100"
                       :min="60"
                       :step="1"
                       :stepStrictly="true"
                       controls-position="right"
                       size="mini"
                       title="控件宽度占用整行宽度的比例">
      </el-input-number>
    </div>

    <div v-if="refBasedControlType !== 'POINT_CHECK'" class="keyValueSettingContainer">
      最大显示选项数：
      <el-input-number v-model="value.max"
                       :max="20"
                       :min=1
                       :step="1"
                       :stepStrictly="true"
                       controls-position="right"
                       size="mini"
                       title="最大显示条数">
      </el-input-number>
    </div>

    <div class="keyValueSettingContainer">
      横轴标题：
      <el-input v-model="value.xTitle"
                :maxlength="50"
                :spellcheck="false"
                class="width130"
                size="mini"
                title="横轴标题">
      </el-input>
    </div>

    <div class="keyValueSettingContainer">
      纵轴标题：
      <el-input v-model="value.yTitle"
                :maxlength="50"
                :spellcheck="false"
                class="width130"
                size="mini"
                title="纵轴标题">
      </el-input>
    </div>

    <el-checkbox v-model="value.horizontal" class="marginBottom10 block"
                 size="mini"
                 title="水平显示条形图">
      水平显示
    </el-checkbox>

    <el-checkbox v-model="value.hideGrid" class="marginBottom10 block"
                 size="mini"
                 title="隐藏网格线">
      隐藏网格线
    </el-checkbox>

    <el-checkbox v-model="value.showNumber" class="marginBottom10 block"
                 size="mini"
                 title="显示每项数值">
      显示数值
    </el-checkbox>

    <el-checkbox v-model="value.hideControlIfNoData" class="marginBottom10 block"
                 size="mini"
                 title="无数据时隐藏控件">
      无数据时隐藏控件
    </el-checkbox>

    <div class="keyValueSettingContainer">
      条形颜色：
      <div>
        <MryColorPicker v-for="index in barCount"
                        :key="index"
                        v-model="value.colors[index-1]"
                        :title="`条形${index}颜色`">
        </MryColorPicker>
      </div>
    </div>
  </div>
</template>

<script>
import addressPrecisionTypes from '@/common/utils/address-precision-types';
import reportRanges from '@/common/utils/report-ranges';
import {createNamespacedHelpers} from 'vuex';
import submissionSegmentTypes from '@/common/utils/submission-segment-types';
import multiLevelSelectionPrecisionTypes from "@/common/utils/multi-level-selection-precision-types";
import {controlFieldName} from "@/common/utils/common-utils";

const {mapGetters} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
  },

  computed: {
    ...mapGetters([
      'allAnswerCategorizedControlsOfPage',
      'allPageSummaries',
      'allAnswerNumberedControlsOfPage',
      'controlOf',
    ]),

    barCount() {
      if (this.value.segmentType === 'SUBMIT_COUNT_SUM') {
        return 1;
      }

      return this.value.targetControlIds.length;
    },

    refBasedControlType() {
      if (!this.value.basedControlId) {
        return null;
      }

      return this.controlOf(this.value.basedControlId).type;
    },

    types() {
      return submissionSegmentTypes;
    },

    ranges() {
      return reportRanges;
    },

    addressPrecisionTypes() {
      return addressPrecisionTypes;
    },

    multiLevelSelectionPrecisionTypes() {
      return multiLevelSelectionPrecisionTypes;
    }
  },

  methods: {
    controlFieldName,
    clearPageAndControlSelection() {
      this.value.pageId = null;
      this.value.basedControlId = null;
      this.value.targetControlIds = [];
    },

    clearControlSelection() {
      this.value.basedControlId = null;
      this.value.targetControlIds = [];
    },

    collapseDropdown(select) {
      let _this = this;
      setTimeout(function () {
        _this.$refs[select].blur();
      }, 50);
    },
  }

}
</script>

<style lang="scss" module>
.wrapper {
}

.selectInput {
  width: 100%;
}

</style>

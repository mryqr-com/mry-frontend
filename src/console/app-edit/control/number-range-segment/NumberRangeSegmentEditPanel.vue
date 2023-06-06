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
               class="marginBottom10"
               placeholder="请选择统计基准控件"
               size="mini"
               title="所引用的基准控件">
      <el-option
          v-for="control in allAnswerNumberedControlsOfPage(value.pageId)"
          :key="control.id"
          :label="controlFieldName(control)"
          :value="control.id">
      </el-option>
    </el-select>

    <div class="singleLineTitle">基准控件值域分段</div>
    <el-input v-model="value.numberRangesString"
              :class="$style.selectInput"
              :maxlength="100"
              :spellcheck="false"
              placeholder="数值以逗号(,)隔开，例如: 100,200,300"
              size="mini"
              title="以逗号(,)隔开的数值区间，例如: 100,200,300">
    </el-input>

    <template v-if="value.segmentType !== 'SUBMIT_COUNT_SUM'">
      <div class="singleLineTitle marginTop10">目标控件(y轴)</div>
      <el-select v-model="value.targetControlId"
                 :class="$style.selectInput"
                 placeholder="请选择需要统计数值的目标控件"
                 size="mini"
                 title="目标控件和基准控件来自于相同页面">
        <el-option
            v-for="control in allAnswerNumberedControlsOfPage(value.pageId)"
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

    <div class="keyValueSettingContainer">
      图形颜色：
      <MryColorPicker v-model="value.color" title="图形颜色"></MryColorPicker>
    </div>

    <el-checkbox v-model="value.hideGrid"
                 class="marginBottom10 block"
                 size="mini"
                 title="隐藏网格线">
      隐藏网格线
    </el-checkbox>

    <el-checkbox v-model="value.showNumber"
                 class="marginBottom10 block"
                 size="mini"
                 title="显示数值">
      显示数值
    </el-checkbox>

    <el-checkbox v-model="value.hideControlIfNoData"
                 class="marginBottom10 block"
                 size="mini"
                 title="无数据时隐藏控件">
      无数据时隐藏控件
    </el-checkbox>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import reportRanges from "@/common/utils/report-ranges";
import {controlFieldName} from "@/common/utils/common-utils";
import submissionSegmentTypes from "@/common/utils/submission-segment-types";

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
      'allAnswerNumberedControlsOfPage',
      'allPageSummaries',
    ]),

    types() {
      return submissionSegmentTypes;
    },

    ranges() {
      return reportRanges;
    },

  },

  methods: {
    controlFieldName,
    clearPageAndControlSelection() {
      this.value.pageId = null;
      this.value.basedControlId = null;
      this.value.targetControlId = null;
    },

    clearControlSelection() {
      this.value.basedControlId = null;
      this.value.targetControlId = null;
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

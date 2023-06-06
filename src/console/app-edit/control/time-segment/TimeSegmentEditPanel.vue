<template>
  <div :class="$style.wrapper">
    <EditTitle>统计项</EditTitle>
    <el-collapse v-if="value.segmentSettings.length > 0"
                 v-model="activeName"
                 :class="$style.theCollapse"
                 accordion>
      <draggable v-model="value.segmentSettings"
                 :class="$style.theDragWrapper"
                 :handle="'.' + $style.dragHandle"
                 animation="200"
                 tag="div">
        <el-collapse-item v-for="(item,index) in value.segmentSettings"
                          :key="item.id"
                          :ref="item.id"
                          :class="$style.optionWrapper"
                          :name="item.id">
          <template slot="title">
            <div :class="$style.linkTitle">
              <div :class="$style.linkName">
                <ThreeBarIcon :class="$style.dragHandle"
                              title="上下拖动移位">
                </ThreeBarIcon>
                <div :class="$style.nameText">
                  {{ item.name }}
                  <i v-if="!isComplete(item)"
                     :class="$style.warning"
                     class="el-icon-warning-outline"
                     title="请完善统计项设置">
                  </i>
                </div>
              </div>
              <i :class="$style.deleteButton"
                 class="el-icon-close"
                 title="删除"
                 @click="deleteItem(item.id)">
              </i>
            </div>
          </template>

          <div :class="$style.opsArea">
            <div class="singleLineTitle">名称</div>
            <div class="marginBottom10">
              <el-input
                  v-model="item.name"
                  :class="[{elementInputErrorBordered: $v.value.segmentSettings.$each.$iter[index].name.$invalid }]"
                  :maxlength="10"
                  size="mini"
                  title="统计项名称">
              </el-input>
              <div v-if="$v.value.segmentSettings.$each.$iter[index].name.$invalid"
                   :class="$style.errorMessage">
                <ErrorMessage v-if="!$v.value.segmentSettings.$each.$iter[index].name.required">
                  统计项名称不能为空
                </ErrorMessage>
              </div>
            </div>

            <div class="singleLineTitle">统计类型</div>
            <el-select v-model="item.segmentType"
                       :class="$style.selectInput"
                       class="marginBottom10"
                       placeholder="请选择统计类型"
                       size="mini"
                       title="统计类型"
                       @change="clearPageAndControlSelection(item)">
              <el-option
                  v-for="range in types"
                  :key="range.key"
                  :label="range.name"
                  :value="range.key">
              </el-option>
            </el-select>

            <div class="singleLineTitle">统计方式</div>
            <el-select v-model="item.basedType"
                       :class="$style.selectInput"
                       class="marginBottom10"
                       placeholder="请选择统计方式"
                       size="mini"
                       title="统计方式"
                       @change="clearBasedControlSelection(item)">
              <el-option
                  v-for="basedType in basedTypes"
                  :key="basedType.key"
                  :label="basedType.name"
                  :value="basedType.key">
              </el-option>
            </el-select>

            <div class="singleLineTitle">页面</div>
            <el-select v-model="item.pageId"
                       :class="$style.selectInput"
                       class="marginBottom10"
                       placeholder="请选择需引用的页面"
                       size="mini"
                       title="所引用的页面"
                       @change="clearControlSelection(item)">
              <el-option
                  v-for="page in allPageSummaries"
                  :key="page.id"
                  :label="page.name"
                  :value="page.id">
              </el-option>
            </el-select>

            <template v-if="item.basedType !== 'CREATED_AT'">
              <div class="singleLineTitle">基准控件(x轴)</div>
              <el-select v-model="item.basedControlId"
                         :class="$style.selectInput"
                         class="marginBottom10"
                         placeholder="请选择需引用的基准控件"
                         size="mini"
                         title="所引用的基准控件">
                <el-option
                    v-for="control in allDateControlsOfPage(item.pageId)"
                    :key="control.id"
                    :label="controlFieldName(control)"
                    :value="control.id">
                </el-option>
              </el-select>
            </template>

            <template v-if="item.segmentType !== 'SUBMIT_COUNT_SUM'">
              <div class="singleLineTitle">目标控件(y轴)</div>
              <el-select v-model="item.targetControlId"
                         :class="$style.selectInput"
                         class="marginBottom10"
                         placeholder="请选择需引用的目标控件"
                         size="mini"
                         title="所引用的目标控件">
                <el-option
                    v-for="control in allAnswerNumberedControlsOfPage(item.pageId)"
                    :key="control.id"
                    :label="controlFieldName(control)"
                    :value="control.id">
                </el-option>
              </el-select>
            </template>
          </div>
        </el-collapse-item>
      </draggable>
    </el-collapse>

    <PlainButton
        :disabled="value.segmentSettings.length >= max"
        title="添加统计项，最多添加2个统计项"
        @click="addItem">
      <i class="el-icon-plus"></i>&nbsp;添加统计项（{{ value.segmentSettings.length }}/{{ max }}）
    </PlainButton>

    <EditTitle>基本设置</EditTitle>
    <div class="keyValueSettingContainer">
      时段间隔：
      <el-select v-model="value.interval"
                 class="width130"
                 placeholder="请选择时段间隔"
                 size="mini"
                 title="设置时段间隔">
        <el-option
            v-for="range in intervals"
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
      最大显示条数：
      <el-input-number v-model="value.max"
                       :max="20"
                       :min=1
                       :step="1"
                       :stepStrictly="true"
                       controls-position="right"
                       size="mini"
                       title="最大显示数据条数，从当前时间往前推，比如对于按月统计来说，设置最大显示条数为3，表示查看最近3个月的数据">
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
      条形颜色：
      <div>
        <MryColorPicker v-for="index in value.segmentSettings.length"
                        :key="index"
                        v-model="value.colors[index-1]"
                        :title="`条形${index}颜色`">
        </MryColorPicker>
      </div>
    </div>

    <el-checkbox v-model="value.horizontal"
                 class="marginBottom10 block"
                 size="mini"
                 title="水平显示">
      水平显示
    </el-checkbox>

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
import timeSegmentIntervals from '@/common/utils/time-segment-intervals';
import submissionSegmentTypes from '@/common/utils/submission-segment-types';
import submissionReportTimeBasedTypes from '@/common/utils/submission-report-time-based-types';
import {controlFieldName} from "@/common/utils/common-utils";
import uuid from 'short-uuid';
import draggable from 'vuedraggable';
import {required} from 'vuelidate/lib/validators'

import {createNamespacedHelpers} from 'vuex';

const {mapGetters} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
  },

  components: {
    draggable,
  },


  data() {
    return {
      activeName: null,
      max: 2,
    }
  },

  computed: {
    ...mapGetters([
      'allAnswerNumberedControlsOfPage',
      'allPageSummaries',
      'allDateControlsOfPage',
    ]),

    types() {
      return submissionSegmentTypes;
    },

    basedTypes() {
      return submissionReportTimeBasedTypes;
    },

    intervals() {
      return timeSegmentIntervals;
    }
  },

  methods: {
    controlFieldName,
    clearPageAndControlSelection(item) {
      item.pageId = null;
      item.targetControlId = null;
      item.basedControlId = null;
    },

    clearBasedControlSelection(item) {
      item.basedControlId = null;
    },

    clearControlSelection(item) {
      item.basedControlId = null;
      item.targetControlId = null;
    },

    isComplete(item) {
      let pageComplete = !!item.pageId;

      let targetComplete = true;
      if (item.segmentType !== 'SUBMIT_COUNT_SUM') {
        targetComplete = !!item.targetControlId;
      }

      let basedComplete = true;
      if (item.basedType !== 'CREATED_AT') {
        basedComplete = !!item.basedControlId;
      }

      return pageComplete && targetComplete && basedComplete;
    },

    addItem() {
      if (this.value.segmentSettings.length >= this.max) {
        this.$message({
          type: 'error',
          message: `添加失败，最大只能包含${this.max}个统计项。`,
          center: true
        });
        return;
      }

      let id = uuid.generate();
      this.value.segmentSettings.push({
        id: id,
        name: '未命名',
        segmentType: 'SUBMIT_COUNT_SUM',
        basedType: 'CREATED_AT',
        pageId: null,
        basedControlId: null,
        targetControlId: null,
      });
      this.activeName = id;
    },

    deleteItem(id) {
      this.value.segmentSettings.splice(this.value.segmentSettings.findIndex(i => i.id === id), 1);
    }
  },
  validations: {
    value: {
      segmentSettings: {
        $each: {
          name: {
            required,
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.theCollapse {
  margin-bottom: 10px;

  :global {
    .el-collapse-item__arrow {
      display: none;
    }

    .el-collapse-item__content {
      padding-bottom: 10px;
    }
  }
}

.theDragWrapper {
  border-left: $primary1pxBorder;
  border-right: $primary1pxBorder;
}

.dragHandle {
  cursor: move;
  margin-right: 15px;
  margin-left: 10px;
}

.optionWrapper {
  :global {
    .el-collapse-item__content {
      padding-left: 15px;
      padding-bottom: 15px;
    }
  }
}


.linkTitle {
  width: 100%;
  padding: 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.linkName {
  display: flex;
  align-items: center;
}

.nameText {
  line-height: normal;
  font-weight: normal;
}

.deleteButton {
  cursor: pointer;
  margin-right: 15px;
}

.deleteButton:hover {
  color: $rejectRed;
}

.opsArea {
  margin-left: 10px;
  margin-right: 10px;
}

.selectInput {
  width: 100%;
}

.warning {
  color: $warningYellow;
  cursor: default;
  font-size: 15px;
  font-weight: 500;
}

</style>

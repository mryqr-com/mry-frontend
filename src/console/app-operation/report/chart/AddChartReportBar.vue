<template>
  <div :class="$style.wrapper">
    <el-dropdown trigger="click" @command="handleAddChartReportCommand">
      <el-button :class="$style.editButton"
                 :disabled="isMaxSizeReached"
                 :title="isMaxSizeReached? '报表数量已达最大值(20个)，无法继续新建':'新建数字报表'"
                 size="mini"
                 type="plain">
        <i class="el-icon-plus el-icon--left"></i>新建图形报表
      </el-button>

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="addAttributeBarReport">
          <icon :class="$style.icon" icon="signal"/>
          属性值条形图
        </el-dropdown-item>

        <el-dropdown-item command="addAttributePieReport">
          <icon :class="$style.icon" icon="chart-pie"/>
          属性值饼状图
        </el-dropdown-item>

        <el-dropdown-item command="addAttributeDoughnutReport">
          <icon :class="$style.icon" icon="circle-notch"/>
          属性值圆环图
        </el-dropdown-item>

        <el-dropdown-item command="addAttributeNumberRangeSegmentReport">
          <icon :class="$style.icon" icon="sort-amount-up"/>
          属性值值域分布图
        </el-dropdown-item>

        <el-dropdown-item :class="$style.menuSplit" command="addAttributeTimeSegmentReport">
          <icon :class="$style.icon" icon="chart-bar"/>
          属性值分时统计图
        </el-dropdown-item>

        <el-dropdown-item command="addControlBarReport">
          <icon :class="$style.icon" icon="signal"/>
          控件提交值条形图
        </el-dropdown-item>

        <el-dropdown-item command="addControlPieReport">
          <icon :class="$style.icon" icon="chart-pie"/>
          控件提交值饼状图
        </el-dropdown-item>

        <el-dropdown-item command="addControlDoughnutReport">
          <icon :class="$style.icon" icon="circle-notch"/>
          控件提交值圆环图
        </el-dropdown-item>

        <el-dropdown-item command="addControlNumberRangeSegmentReport">
          <icon :class="$style.icon" icon="sort-amount-up"/>
          控件提交值值域分布图
        </el-dropdown-item>

        <el-dropdown-item command="addControlTimeSegmentReport">
          <icon :class="$style.icon" icon="chart-bar"/>
          控件提交值分时统计图
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-button :class="$style.editButton" size="mini" type="plain" @click="openConfigurationDialog">
      <i class="el-icon-setting el-icon--left"></i>图形报表设置
    </el-button>

    <ControlCategorizedReportEditDialog :isNew="true"
                                        :report="reportForAdd"
                                        :show.sync="controlCategorizedReportDialogVisible"
                                        @updated="addReport">
    </ControlCategorizedReportEditDialog>

    <ControlNumberRangeSegmentReportEditDialog :isNew="true"
                                               :report="reportForAdd"
                                               :show.sync="controlNumberRangeSegmentDialogVisible"
                                               @updated="addReport">
    </ControlNumberRangeSegmentReportEditDialog>

    <ControlTimeSegmentReportEditDialog :isNew="true"
                                        :report="reportForAdd"
                                        :show.sync="controlTimeSegmentDialogVisible"
                                        @updated="addReport">
    </ControlTimeSegmentReportEditDialog>

    <AttributeCategorizedReportEditDialog :isNew="true"
                                          :report="reportForAdd"
                                          :show.sync="attributeCategorizedReportDialogVisible"
                                          @updated="addReport">
    </AttributeCategorizedReportEditDialog>

    <AttributeNumberRangeSegmentReportEditDialog :isNew="true"
                                                 :report="reportForAdd"
                                                 :show.sync="attributeNumberRangeReportDialogVisible"
                                                 @updated="addReport">
    </AttributeNumberRangeSegmentReportEditDialog>

    <AttributeTimeSegmentReportEditDialog :isNew="true"
                                          :report="reportForAdd"
                                          :show.sync="attributeTimeSegmentDialogVisible"
                                          @updated="addReport">
    </AttributeTimeSegmentReportEditDialog>

    <ChartReportConfigurationEditDialog :show.sync="configurationDialogVisible">
    </ChartReportConfigurationEditDialog>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import ChartReportConfigurationEditDialog
  from '@/console/app-operation/report/chart/ChartReportConfigurationEditDialog';
import ControlCategorizedReportEditDialog
  from '@/console/app-operation/report/chart/control/ControlCategorizedReportEditDialog';
import ControlTimeSegmentReportEditDialog
  from '@/console/app-operation/report/chart/control/ControlTimeSegmentReportEditDialog';
import ControlNumberRangeSegmentReportEditDialog
  from '@/console/app-operation/report/chart/control/ControlNumberRangeSegmentReportEditDialog';

import AttributeCategorizedReportEditDialog
  from '@/console/app-operation/report/chart/attribute/AttributeCategorizedReportEditDialog';

import AttributeNumberRangeSegmentReportEditDialog
  from '@/console/app-operation/report/chart/attribute/AttributeNumberRangeSegmentReportEditDialog';

import AttributeTimeSegmentReportEditDialog
  from '@/console/app-operation/report/chart/attribute/AttributeTimeSegmentReportEditDialog';
import uuid from "short-uuid";
import {randomColors} from "@/common/utils/common-utils";

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  components: {
    ChartReportConfigurationEditDialog,
    ControlCategorizedReportEditDialog,
    ControlNumberRangeSegmentReportEditDialog,
    ControlTimeSegmentReportEditDialog,
    AttributeCategorizedReportEditDialog,
    AttributeNumberRangeSegmentReportEditDialog,
    AttributeTimeSegmentReportEditDialog,
  },

  data() {
    return {
      reportForAdd: {},
      controlCategorizedReportDialogVisible: false,
      controlNumberRangeSegmentDialogVisible: false,
      controlTimeSegmentDialogVisible: false,

      attributeCategorizedReportDialogVisible: false,
      attributeNumberRangeReportDialogVisible: false,
      attributeTimeSegmentDialogVisible: false,

      configurationDialogVisible: false,
    }
  },

  computed: {
    ...appOperationStore.mapGetters([
      'currentAppChartReportSetting',
    ]),

    isMaxSizeReached() {
      return this.currentAppChartReportSetting.reports.length >= 20;
    }
  },

  methods: {
    ...appOperationStore.mapMutations(['addChartReport']),

    handleAddChartReportCommand(command) {
      switch (command) {
        case 'addControlBarReport': {
          this.reportForAdd = {
            id: uuid.generate(),
            type: 'CONTROL_BAR_REPORT',
            name: null,
            span: 12,
            aspectRatio: 45,
            setting: {
              segmentType: null,
              pageId: null,
              basedControlId: null,
              addressPrecisionType: 'CITY',
              multiLevelSelectionPrecisionType: 'LEVEL2',
              targetControlIds: [],
              range: 'NO_LIMIT',
            },
            style: {
              max: 10,
              xTitle: null,
              yTitle: null,
              hideGrid: false,
              colors: ['#FF8C00', '#00bfff'],
              showNumber: true,
              horizontal: false,
            }
          };
          this.controlCategorizedReportDialogVisible = true;
          break;
        }

        case 'addControlPieReport': {
          this.reportForAdd = {
            id: uuid.generate(),
            type: 'CONTROL_PIE_REPORT',
            name: null,
            span: 12,
            aspectRatio: 45,
            setting: {
              segmentType: null,
              pageId: null,
              basedControlId: null,
              addressPrecisionType: 'CITY',
              multiLevelSelectionPrecisionType: 'LEVEL2',
              targetControlIds: [],
              range: 'NO_LIMIT',
            },
            style: {
              max: 10,
              showValue: true,
              showPercentage: true,
              showLabels: true,
              colors: randomColors(),
            }
          };
          this.controlCategorizedReportDialogVisible = true;
          break;
        }

        case 'addControlDoughnutReport': {
          this.reportForAdd = {
            id: uuid.generate(),
            type: 'CONTROL_DOUGHNUT_REPORT',
            name: null,
            span: 12,
            aspectRatio: 45,
            setting: {
              segmentType: null,
              pageId: null,
              basedControlId: null,
              addressPrecisionType: 'CITY',
              multiLevelSelectionPrecisionType: 'LEVEL2',
              targetControlIds: [],
              range: 'NO_LIMIT',
            },
            style: {
              max: 10,
              showValue: true,
              showPercentage: true,
              showLabels: true,
              showCenterTotal: true,
              colors: randomColors(),
            }
          };
          this.controlCategorizedReportDialogVisible = true;
          break;
        }

        case 'addControlNumberRangeSegmentReport': {
          this.reportForAdd = {
            id: uuid.generate(),
            type: 'CONTROL_NUMBER_RANGE_REPORT',
            name: null,
            span: 12,
            aspectRatio: 45,
            setting: {
              segmentType: null,
              pageId: null,
              basedControlId: null,
              numberRangesString: null,
              targetControlId: null,
              range: 'NO_LIMIT',
            },
            style: {
              xTitle: null,
              yTitle: null,
              color: '#FF8C00',
              hideGrid: false,
              showNumber: true,
            }
          };
          this.controlNumberRangeSegmentDialogVisible = true;
          break;
        }

        case 'addControlTimeSegmentReport': {
          this.reportForAdd = {
            id: uuid.generate(),
            type: 'CONTROL_TIME_SEGMENT_REPORT',
            name: null,
            span: 12,
            aspectRatio: 45,
            setting: {
              segmentSettings: [
                {
                  id: uuid.generate(),
                  name: "未命名",
                  segmentType: null,
                  basedType: null,
                  pageId: null,
                  basedControlId: null,
                  targetControlId: null,
                },
              ],
              interval: 'PER_MONTH',
            },
            style: {
              max: 6,
              xTitle: null,
              yTitle: null,
              colors: ['#FF8C00', '#00bfff'],
              hideGrid: false,
              showNumber: true,
              horizontal: false,
            }
          };
          this.controlTimeSegmentDialogVisible = true;
          break;
        }

        case 'addAttributeBarReport': {
          this.reportForAdd = {
            id: uuid.generate(),
            type: 'ATTRIBUTE_BAR_REPORT',
            name: null,
            span: 12,
            aspectRatio: 45,
            setting: {
              segmentType: null,
              basedAttributeId: null,
              addressPrecisionType: 'CITY',
              multiLevelSelectionPrecisionType: 'LEVEL2',
              targetAttributeIds: [],
              range: 'NO_LIMIT',
            },
            style: {
              max: 10,
              xTitle: null,
              yTitle: null,
              hideGrid: false,
              colors: ['#FF8C00', '#00bfff'],
              showNumber: true,
              horizontal: false,
            }
          };
          this.attributeCategorizedReportDialogVisible = true;
          break;
        }

        case 'addAttributePieReport': {
          this.reportForAdd = {
            id: uuid.generate(),
            type: 'ATTRIBUTE_PIE_REPORT',
            name: null,
            span: 12,
            aspectRatio: 45,
            setting: {
              segmentType: null,
              basedAttributeId: null,
              addressPrecisionType: 'CITY',
              multiLevelSelectionPrecisionType: 'LEVEL2',
              targetAttributeIds: [],
              range: 'NO_LIMIT',
            },
            style: {
              max: 10,
              showValue: true,
              showPercentage: true,
              showLabels: true,
              colors: randomColors(),
            }
          };
          this.attributeCategorizedReportDialogVisible = true;
          break;
        }

        case 'addAttributeDoughnutReport': {
          this.reportForAdd = {
            id: uuid.generate(),
            type: 'ATTRIBUTE_DOUGHNUT_REPORT',
            name: null,
            span: 12,
            aspectRatio: 45,
            setting: {
              segmentType: null,
              basedAttributeId: null,
              addressPrecisionType: 'CITY',
              multiLevelSelectionPrecisionType: 'LEVEL2',
              targetAttributeIds: [],
              range: 'NO_LIMIT',
            },
            style: {
              max: 10,
              showValue: true,
              showPercentage: true,
              showLabels: true,
              showCenterTotal: true,
              colors: randomColors(),
            }
          };
          this.attributeCategorizedReportDialogVisible = true;
          break;
        }

        case 'addAttributeNumberRangeSegmentReport': {
          this.reportForAdd = {
            id: uuid.generate(),
            type: 'ATTRIBUTE_NUMBER_RANGE_SEGMENT_REPORT',
            name: null,
            span: 12,
            aspectRatio: 45,
            setting: {
              segmentType: null,
              basedAttributeId: null,
              numberRangesString: null,
              targetAttributeId: null,
              range: 'NO_LIMIT',
            },
            style: {
              xTitle: null,
              yTitle: null,
              color: '#FF8C00',
              hideGrid: false,
              showNumber: true,
            }
          };
          this.attributeNumberRangeReportDialogVisible = true;
          break;
        }

        case 'addAttributeTimeSegmentReport': {
          this.reportForAdd = {
            id: uuid.generate(),
            type: 'ATTRIBUTE_TIME_SEGMENT_REPORT',
            name: null,
            span: 12,
            aspectRatio: 45,
            setting: {
              segmentSettings: [
                {
                  id: uuid.generate(),
                  name: "未命名",
                  segmentType: null,
                  basedType: null,
                  basedAttributeId: null,
                  targetAttributeId: null,
                },
              ],
              interval: 'PER_MONTH',
            },
            style: {
              max: 6,
              xTitle: null,
              yTitle: null,
              colors: ['#FF8C00', '#00bfff'],
              hideGrid: false,
              showNumber: true,
              horizontal: false,
            }
          };
          this.attributeTimeSegmentDialogVisible = true;
          break;
        }
      }
    },

    openConfigurationDialog() {
      this.configurationDialogVisible = true;
    },

    addReport(report) {
      this.addChartReport(report);
    },

  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.editButton {
  font-weight: normal;
  margin-right: 10px;
}

.icon {
  margin-right: 5px;
}

.menuSplit {
  border-bottom: solid 1px $primaryBorderColor;
}
</style>

<template>
  <div :class="$style.wrapper">
    <el-row v-if="allReports.length > 0" :gutter="configuration.gutter">
      <el-col v-for="(report,index) in allReports" :key="report.id" :span="report.span">
        <div :class="[$style.reportWrapper,{[$style.inEditReportWrapper]:isEditMode}]" :style="reportWrapperStyle">
          <div v-if="isEditMode" :class="$style.opsBar">
            <i :class="$style.opsBarIcon" class="el-icon-edit-outline" title="编辑报表"
               @click="openSettingEditDialog(report)"></i>

            <i :class="$style.opsBarIcon" class="el-icon-data-analysis" title="样式设置"
               @click="openStyleEditDialog(report)"></i>

            <i :class="$style.opsBarIcon" class="el-icon-delete" title="删除报表"
               @click="deleteReport(report)"></i>

            <i v-if="index !== 0" :class="$style.opsBarIcon" class="el-icon-back" title="前移报表"
               @click="moveReportForward(report)"></i>

            <i v-if="index !== allReports.length - 1" :class="$style.opsBarIcon" class="el-icon-right" title="后移报表"
               @click="moveReportBackward(report)"></i>
          </div>

          <ChartReport :appId="currentAppId"
                       :appSetting="appSetting"
                       :attributesMap="attributesMap"
                       :class="$style.chartReport"
                       :controlsMap="controlsMap"
                       :groupId="groupId"
                       :groupNamesMap="groupNamesMap"
                       :index="index"
                       :report="report">
          </ChartReport>
        </div>
      </el-col>
    </el-row>

    <ControlCategorizedReportEditDialog :isNew="false"
                                        :report="currentReport"
                                        :show.sync="controlCategorizedReportDialogVisible"
                                        @updated="updateReport">
    </ControlCategorizedReportEditDialog>

    <ControlNumberRangeSegmentReportEditDialog :isNew="false"
                                               :report="currentReport"
                                               :show.sync="controlNumberRangeSegmentDialogVisible"
                                               @updated="updateReport">
    </ControlNumberRangeSegmentReportEditDialog>

    <ControlTimeSegmentReportEditDialog :isNew="false"
                                        :report="currentReport"
                                        :show.sync="controlTimeSegmentDialogVisible"
                                        @updated="updateReport">
    </ControlTimeSegmentReportEditDialog>

    <AttributeCategorizedReportEditDialog :isNew="false"
                                          :report="currentReport"
                                          :show.sync="attributeCategorizedReportDialogVisible"
                                          @updated="updateReport">
    </AttributeCategorizedReportEditDialog>

    <AttributeNumberRangeSegmentReportEditDialog :isNew="false"
                                                 :report="currentReport"
                                                 :show.sync="attributeNumberRangeReportDialogVisible"
                                                 @updated="updateReport">
    </AttributeNumberRangeSegmentReportEditDialog>

    <AttributeTimeSegmentReportEditDialog :isNew="false"
                                          :report="currentReport"
                                          :show.sync="attributeTimeSegmentDialogVisible"
                                          @updated="updateReport">
    </AttributeTimeSegmentReportEditDialog>

    <BarReportStyleEditDialog :report="currentReport"
                              :show.sync="barReportStyleDialogVisible"
                              @updated="updateReport">
    </BarReportStyleEditDialog>

    <PieReportStyleEditDialog :report="currentReport"
                              :show.sync="pieReportStyleDialogVisible"
                              @updated="updateReport">
    </PieReportStyleEditDialog>

    <DoughnutReportStyleEditDialog :report="currentReport"
                                   :show.sync="doughnutReportStyleDialogVisible"
                                   @updated="updateReport">
    </DoughnutReportStyleEditDialog>

    <NumberRangeSegmentReportStyleEditDialog :report="currentReport"
                                             :show.sync="numberRangeSegmentReportStyleDialogVisible"
                                             @updated="updateReport">
    </NumberRangeSegmentReportStyleEditDialog>

    <TimeSegmentReportStyleEditDialog :report="currentReport"
                                      :show.sync="timeSegmentReportStyleDialogVisible"
                                      @updated="updateReport">
    </TimeSegmentReportStyleEditDialog>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import ControlCategorizedReportEditDialog
  from '@/console/app-operation/report/chart/control/ControlCategorizedReportEditDialog';
import BarReportStyleEditDialog from '@/console/app-operation/report/chart/style/BarReportStyleEditDialog';
import PieReportStyleEditDialog from '@/console/app-operation/report/chart/style/PieReportStyleEditDialog';
import DoughnutReportStyleEditDialog from '@/console/app-operation/report/chart/style/DoughnutReportStyleEditDialog';
import ControlTimeSegmentReportEditDialog
  from '@/console/app-operation/report/chart/control/ControlTimeSegmentReportEditDialog';
import TimeSegmentReportStyleEditDialog
  from '@/console/app-operation/report/chart/style/TimeSegmentReportStyleEditDialog';
import NumberRangeSegmentReportStyleEditDialog
  from '@/console/app-operation/report/chart/style/NumberRangeSegmentReportStyleEditDialog';
import ControlNumberRangeSegmentReportEditDialog
  from '@/console/app-operation/report/chart/control/ControlNumberRangeSegmentReportEditDialog';

import AttributeCategorizedReportEditDialog
  from '@/console/app-operation/report/chart/attribute/AttributeCategorizedReportEditDialog';

import AttributeNumberRangeSegmentReportEditDialog
  from '@/console/app-operation/report/chart/attribute/AttributeNumberRangeSegmentReportEditDialog';

import AttributeTimeSegmentReportEditDialog
  from '@/console/app-operation/report/chart/attribute/AttributeTimeSegmentReportEditDialog';

import ChartReport from '@/common/components/report/chart/ChartReport';

const reportingStore = createNamespacedHelpers('REPORTING_STORE');
const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: {
    groupId: {
      type: String,
    },
  },

  components: {
    ControlCategorizedReportEditDialog,
    BarReportStyleEditDialog,
    PieReportStyleEditDialog,
    DoughnutReportStyleEditDialog,
    ControlNumberRangeSegmentReportEditDialog,
    NumberRangeSegmentReportStyleEditDialog,
    ControlTimeSegmentReportEditDialog,
    TimeSegmentReportStyleEditDialog,
    AttributeCategorizedReportEditDialog,
    AttributeNumberRangeSegmentReportEditDialog,
    AttributeTimeSegmentReportEditDialog,
    ChartReport,
  },

  data() {
    return {
      currentReport: {},
      controlCategorizedReportDialogVisible: false,
      controlNumberRangeSegmentDialogVisible: false,
      controlTimeSegmentDialogVisible: false,

      attributeCategorizedReportDialogVisible: false,
      attributeNumberRangeReportDialogVisible: false,
      attributeTimeSegmentDialogVisible: false,

      barReportStyleDialogVisible: false,
      pieReportStyleDialogVisible: false,
      doughnutReportStyleDialogVisible: false,
      numberRangeSegmentReportStyleDialogVisible: false,
      timeSegmentReportStyleDialogVisible: false,
    }
  },

  computed: {
    ...appOperationStore.mapState(['controlsMap', 'attributesMap', 'groupNamesMap']),
    ...appOperationStore.mapGetters([
      'currentAppId',
      'currentAppChartReportSetting',
      'appSetting',
    ]),
    ...reportingStore.mapGetters(['isEditMode']),

    allReports() {
      return this.currentAppChartReportSetting.reports;
    },

    configuration() {
      return this.currentAppChartReportSetting.configuration;
    },

    reportWrapperStyle() {
      return {
        marginBottom: this.configuration.gutter + 'px',
      }
    },

  },

  methods: {
    ...appOperationStore.mapMutations([
      'updateChartReport',
      'deleteChartReport',
      'moveChartReportForward',
      'moveChartReportBackward',
    ]),

    openSettingEditDialog(report) {
      this.currentReport = report;

      switch (report.type) {
        case 'CONTROL_PIE_REPORT':
        case 'CONTROL_DOUGHNUT_REPORT':
        case 'CONTROL_BAR_REPORT': {
          this.controlCategorizedReportDialogVisible = true;
          break;
        }

        case 'CONTROL_NUMBER_RANGE_REPORT': {
          this.controlNumberRangeSegmentDialogVisible = true;
          break;
        }

        case 'CONTROL_TIME_SEGMENT_REPORT': {
          this.controlTimeSegmentDialogVisible = true;
          break;
        }

        case 'ATTRIBUTE_DOUGHNUT_REPORT':
        case 'ATTRIBUTE_PIE_REPORT':
        case 'ATTRIBUTE_BAR_REPORT': {
          this.attributeCategorizedReportDialogVisible = true;
          break;
        }

        case 'ATTRIBUTE_NUMBER_RANGE_SEGMENT_REPORT': {
          this.attributeNumberRangeReportDialogVisible = true;
          break;
        }

        case 'ATTRIBUTE_TIME_SEGMENT_REPORT': {
          this.attributeTimeSegmentDialogVisible = true;
          break;
        }
      }
    },

    openStyleEditDialog(report) {
      this.currentReport = report;

      switch (report.type) {
        case 'ATTRIBUTE_BAR_REPORT':
        case 'CONTROL_BAR_REPORT': {
          this.barReportStyleDialogVisible = true;
          break;
        }

        case 'ATTRIBUTE_PIE_REPORT':
        case 'CONTROL_PIE_REPORT': {
          this.pieReportStyleDialogVisible = true;
          break;
        }

        case 'ATTRIBUTE_DOUGHNUT_REPORT':
        case 'CONTROL_DOUGHNUT_REPORT': {
          this.doughnutReportStyleDialogVisible = true;
          break;
        }

        case 'ATTRIBUTE_NUMBER_RANGE_SEGMENT_REPORT':
        case 'CONTROL_NUMBER_RANGE_REPORT': {
          this.numberRangeSegmentReportStyleDialogVisible = true;
          break;
        }

        case 'ATTRIBUTE_TIME_SEGMENT_REPORT':
        case 'CONTROL_TIME_SEGMENT_REPORT': {
          this.timeSegmentReportStyleDialogVisible = true;
          break;
        }
      }
    },

    updateReport(report) {
      this.updateChartReport(report);
    },

    deleteReport(report) {
      this.$confirm(`确认删除报表【${report.name}】？`, '提示', {
        confirmButtonText: '是的，删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => this.deleteChartReport(report.id)).catch((_) => {
      });
    },

    moveReportForward(report) {
      this.moveChartReportForward(report.id);
    },

    moveReportBackward(report) {
      this.moveChartReportBackward(report.id);
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.reportWrapper {
  box-shadow: $primaryShadow;
}

.inEditReportWrapper {
}

.opsBar {
  background-color: #EBEEF5;
  padding: 5px;
}

.opsBarIcon {
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  margin-right: 5px;
}

.opsBarIcon:hover {
  color: $primaryThemeColor;
}

.chartReport {
  padding: 15px;
}

</style>

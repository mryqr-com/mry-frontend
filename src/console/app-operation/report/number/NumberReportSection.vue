<template>
  <div :class="$style.wrapper">
    <el-row v-if="allReports.length > 0" :gutter="configuration.gutter">
      <el-col v-for="(report,index) in allReports" :key="report.id" :span="24/configuration.reportPerLine">
        <div :class="[$style.reportWrapper,{[$style.inEditReportWrapper]:isEditMode}]" :style="reportWrapperStyle">
          <div v-if="isEditMode" :class="$style.opsBar">
            <i :class="$style.opsBarIcon" class="el-icon-edit-outline" title="编辑报表" @click="openEditDialog(report)"></i>
            <i :class="$style.opsBarIcon" class="el-icon-delete" title="删除报表" @click="deleteReport(report)"></i>
            <i v-if="index !== 0" :class="$style.opsBarIcon" class="el-icon-back" title="前移报表"
               @click="moveReportForward(report)"></i>
            <i v-if="index !== allReports.length - 1" :class="$style.opsBarIcon" class="el-icon-right" title="后移报表"
               @click="moveReportBackward(report)"></i>
          </div>

          <NumberReport :appId="currentAppId"
                        :groupId="groupId"
                        :height="configuration.height"
                        :report="report">
          </NumberReport>
        </div>
      </el-col>
    </el-row>

    <AttributeNumberReportEditDialog :isNew="false"
                                     :report="currentReport"
                                     :show.sync="attributeNumberDialogVisible"
                                     @updated="updateReport">
    </AttributeNumberReportEditDialog>

    <ControlNumberReportEditDialog :isNew="false"
                                   :report="currentReport"
                                   :show.sync="controlNumberDialogVisible"
                                   @updated="updateReport">
    </ControlNumberReportEditDialog>

    <InstanceNumberReportEditDialog :isNew="false"
                                    :report="currentReport"
                                    :show.sync="instanceNumberDialogVisible"
                                    @updated="updateReport">
    </InstanceNumberReportEditDialog>

    <PageNumberReportEditDialog :isNew="false"
                                :report="currentReport"
                                :show.sync="pageNumberDialogVisible"
                                @updated="updateReport">
    </PageNumberReportEditDialog>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import NumberReport from '@/common/components/report/number/NumberReport';
import AttributeNumberReportEditDialog from '@/console/app-operation/report/number/AttributeNumberReportEditDialog';
import ControlNumberReportEditDialog from '@/console/app-operation/report/number/ControlNumberReportEditDialog';
import InstanceNumberReportEditDialog from '@/console/app-operation/report/number/InstanceNumberReportEditDialog';
import PageNumberReportEditDialog from '@/console/app-operation/report/number/PageNumberReportEditDialog';

const reportingStore = createNamespacedHelpers('REPORTING_STORE');
const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: {
    groupId: {
      type: String,
    },
  },

  components: {
    NumberReport,
    AttributeNumberReportEditDialog,
    ControlNumberReportEditDialog,
    InstanceNumberReportEditDialog,
    PageNumberReportEditDialog,
  },

  data() {
    return {
      currentReport: {},
      attributeNumberDialogVisible: false,
      controlNumberDialogVisible: false,
      instanceNumberDialogVisible: false,
      pageNumberDialogVisible: false,
    }
  },

  computed: {
    ...appOperationStore.mapGetters([
      'currentAppId',
      'currentAppNumberReportSetting',
    ]),
    ...reportingStore.mapGetters(['isEditMode']),

    allReports() {
      return this.currentAppNumberReportSetting.reports;
    },

    configuration() {
      return this.currentAppNumberReportSetting.configuration;
    },

    reportWrapperStyle() {
      return {
        marginBottom: this.configuration.gutter + 'px',
      }
    },

  },

  methods: {
    ...appOperationStore.mapMutations([
      'updateNumberReport',
      'deleteNumberReport',
      'moveNumberReportForward',
      'moveNumberReportBackward',
    ]),

    openEditDialog(report) {
      this.currentReport = report;

      switch (report.type) {
        case 'INSTANCE_NUMBER_REPORT': {
          this.instanceNumberDialogVisible = true;
          break;
        }

        case 'PAGE_NUMBER_REPORT': {
          this.pageNumberDialogVisible = true;
          break;
        }

        case 'ATTRIBUTE_NUMBER_REPORT': {
          this.attributeNumberDialogVisible = true;
          break;
        }

        case 'CONTROL_NUMBER_REPORT': {
          this.controlNumberDialogVisible = true;
          break;
        }
      }
    },

    updateReport(report) {
      this.updateNumberReport(report);
    },

    deleteReport(report) {
      this.$confirm(`确认删除报表【${report.name}】？`, '提示', {
        confirmButtonText: '是的，删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => this.deleteNumberReport(report.id)).catch((_) => {
      });
    },

    moveReportForward(report) {
      this.moveNumberReportForward(report.id);
    },

    moveReportBackward(report) {
      this.moveNumberReportBackward(report.id);
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

</style>

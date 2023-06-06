<template>
  <div :class="$style.wrapper">
    <el-dropdown trigger="click" @command="handleAddNumberReportCommand">
      <el-button :class="$style.editButton"
                 :disabled="isMaxSizeReached"
                 :title="isMaxSizeReached? '报表数量已达最大值(20个)，无法继续新建':'新建数字报表'"
                 size="mini"
                 type="plain">
        <i class="el-icon-plus el-icon--left"></i>新建数字报表
      </el-button>

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="addAttributeNumberReport">属性数值</el-dropdown-item>
        <el-dropdown-item command="addControlNumberReport">控件提交值</el-dropdown-item>
        <el-dropdown-item command="addInstanceNumberReport">{{ instanceDesignation }}相关数值</el-dropdown-item>
        <el-dropdown-item command="addPageNumberReport">页面相关数值</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-button :class="$style.editButton" size="mini" type="plain" @click="openConfigurationDialog">
      <i class="el-icon-setting el-icon--left"></i>数字报表设置
    </el-button>

    <AttributeNumberReportEditDialog :isNew="true"
                                     :report="reportForAdd"
                                     :show.sync="attributeNumberDialogVisible"
                                     @updated="addReport">
    </AttributeNumberReportEditDialog>

    <ControlNumberReportEditDialog :isNew="true"
                                   :report="reportForAdd"
                                   :show.sync="controlNumberDialogVisible"
                                   @updated="addReport">
    </ControlNumberReportEditDialog>

    <InstanceNumberReportEditDialog :isNew="true"
                                    :report="reportForAdd"
                                    :show.sync="instanceNumberDialogVisible"
                                    @updated="addReport">
    </InstanceNumberReportEditDialog>

    <PageNumberReportEditDialog :isNew="true"
                                :report="reportForAdd"
                                :show.sync="pageNumberDialogVisible"
                                @updated="addReport">
    </PageNumberReportEditDialog>

    <NumberReportConfigurationEditDialog :show.sync="configurationDialogVisible">
    </NumberReportConfigurationEditDialog>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import AttributeNumberReportEditDialog from '@/console/app-operation/report/number/AttributeNumberReportEditDialog';
import ControlNumberReportEditDialog from '@/console/app-operation/report/number/ControlNumberReportEditDialog';
import InstanceNumberReportEditDialog from '@/console/app-operation/report/number/InstanceNumberReportEditDialog';
import PageNumberReportEditDialog from '@/console/app-operation/report/number/PageNumberReportEditDialog';
import NumberReportConfigurationEditDialog
  from '@/console/app-operation/report/number/NumberReportConfigurationEditDialog';
import uuid from 'short-uuid';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  components: {
    AttributeNumberReportEditDialog,
    ControlNumberReportEditDialog,
    InstanceNumberReportEditDialog,
    PageNumberReportEditDialog,
    NumberReportConfigurationEditDialog,
  },

  data() {
    return {
      reportForAdd: {},
      attributeNumberDialogVisible: false,
      controlNumberDialogVisible: false,
      instanceNumberDialogVisible: false,
      pageNumberDialogVisible: false,
      configurationDialogVisible: false,
    }
  },

  computed: {
    ...appOperationStore.mapGetters([
      'currentAppNumberReportSetting',
      'instanceDesignation'
    ]),

    isMaxSizeReached() {
      return this.currentAppNumberReportSetting.reports.length >= 20;
    }
  },

  methods: {
    ...appOperationStore.mapMutations(['addNumberReport']),

    handleAddNumberReportCommand(command) {
      switch (command) {
        case 'addAttributeNumberReport': {
          this.reportForAdd = {
            id: uuid.generate(),
            type: 'ATTRIBUTE_NUMBER_REPORT',
            name: null,
            suffix: null,
            range: 'NO_LIMIT',
            attributeId: null,
            numberAggregationType: null
          };
          this.attributeNumberDialogVisible = true;
          break;
        }

        case 'addControlNumberReport': {
          this.reportForAdd = {
            id: uuid.generate(),
            type: 'CONTROL_NUMBER_REPORT',
            name: null,
            suffix: null,
            range: 'NO_LIMIT',
            pageId: null,
            controlId: null,
            numberAggregationType: null
          };
          this.controlNumberDialogVisible = true;
          break;
        }

        case 'addInstanceNumberReport': {
          this.reportForAdd = {
            id: uuid.generate(),
            type: 'INSTANCE_NUMBER_REPORT',
            name: null,
            suffix: null,
            range: 'NO_LIMIT',
            instanceNumberReportType: null,
          };
          this.instanceNumberDialogVisible = true;
          break;
        }

        case 'addPageNumberReport': {
          this.reportForAdd = {
            id: uuid.generate(),
            type: 'PAGE_NUMBER_REPORT',
            name: null,
            suffix: null,
            range: 'NO_LIMIT',
            pageId: null,
            pageNumberReportType: null,
          };
          this.pageNumberDialogVisible = true;
          break;
        }
      }
    },

    openConfigurationDialog() {
      this.configurationDialogVisible = true;
    },

    addReport(report) {
      this.addNumberReport(report);
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
</style>

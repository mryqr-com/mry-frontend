<template>
  <div :class="$style.wrapper">
    <div v-if="isReportingAllowed" :class="$style.content">
      <section :class="$style.header">
        <span :class="$style.headerTitle">
          统计报表
          <HelpDocLinker url="//docs.mryqr.com/console-app-operation/reporting/"></HelpDocLinker>
        </span>
        <template v-if="canManageCurrentApp && isAppLevel">
          <el-button v-if="!isEditMode && hasReports"
                     :class="$style.topButton"
                     icon="el-icon-edit-outline"
                     size="medium"
                     type="plain"
                     @click="enterEditMode">
            编辑报表
          </el-button>
          <el-button v-if="isEditMode"
                     :class="$style.topButton"
                     icon="el-icon-check"
                     size="medium"
                     type="primary"
                     @click="saveReportSetting">
            保存
          </el-button>
        </template>
      </section>

      <div v-if="!hasReports && !isEditMode" :class="$style.emptySection">
        <div :class="$style.emptyImageContainer" :style="emptyImage"></div>
        <div :class="$style.emptyText">当前无报表</div>
        <el-button v-if="canManageCurrentApp && isAppLevel"
                   :class="$style.emptyEditButton"
                   icon="el-icon-edit-outline"
                   size="medium"
                   type="primary"
                   @click="enterEditMode">
          编辑报表
        </el-button>
      </div>

      <AddNumberReportBar v-if="isEditMode"
                          :class="$style.addNumberReportBar">
      </AddNumberReportBar>

      <NumberReportSection v-if="hasNumberReports"
                           :class="$style.numberReportSection"
                           :groupId="groupId">
      </NumberReportSection>

      <AddChartReportBar v-if="isEditMode"
                         :class="$style.addChartReportBar">
      </AddChartReportBar>

      <ChartReportSection v-if="hasChartReports"
                          :groupId="groupId">
      </ChartReportSection>
    </div>

    <div v-else :class="$style.packageWarning">
      <el-alert :closable="false"
                effect="dark"
                type="warning">
                <span slot="title">{{ planWarningText }}
                  <template v-if="isTenantAdmin">如需使用请前往
                    <router-link :class="$style.purchaseLink" :to="{name:'purchase-packages'}">
                        套餐购买页面
                    </router-link>完成套餐升级或续费。
                    </template>
                  <template v-else>如需使用请联系系统管理员完成套餐升级或续费。</template>
                </span>
      </el-alert>
    </div>
  </div>
</template>

<script>
import {createNamespacedHelpers, mapGetters} from "vuex";
import AddNumberReportBar from '@/console/app-operation/report/number/AddNumberReportBar';
import AddChartReportBar from '@/console/app-operation/report/chart/AddChartReportBar';
import NumberReportSection from '@/console/app-operation/report/number/NumberReportSection';
import ChartReportSection from '@/console/app-operation/report/chart/ChartReportSection';
import appApi from '@/common/api/app-api';
import emptyImageUrl from "@/common/static/empty.svg";

const reportingStore = createNamespacedHelpers('REPORTING_STORE');
const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: {
    groupId: {
      type: String,
    },
  },

  components: {
    AddNumberReportBar,
    NumberReportSection,
    AddChartReportBar,
    ChartReportSection,
  },

  created() {
    this.resetState();
  },

  computed: {
    ...mapGetters([
      'currentPlanName',
      'isCurrentPlanExpired',
      'isTenantAdmin',
      'isReportingAllowed',
    ]),

    ...appOperationStore.mapGetters([
      'currentAppId',
      'hasReports',
      'reportSetting',
      'canManageCurrentApp',
      'currentAppNumberReportSetting',
      'currentAppChartReportSetting',
    ]),

    ...reportingStore.mapGetters(['isEditMode']),

    isAppLevel() {
      return !this.groupId;
    },

    emptyImage() {
      return {
        backgroundImage: `url('${emptyImageUrl}')`
      }
    },

    hasNumberReports() {
      return this.currentAppNumberReportSetting.reports.length > 0;
    },

    hasChartReports() {
      return this.currentAppChartReportSetting.reports.length > 0;
    },

    planWarningText() {
      if (this.isCurrentPlanExpired) {
        return `您当前的${this.currentPlanName}套餐已过期，有效套餐已降为免费版，无法使用报表功能；`;
      }

      return `您当前是${this.currentPlanName}套餐，无法使用报表功能；`
    },
  },

  methods: {
    ...reportingStore.mapMutations([
      'resetState',
      'enterEditMode',
      'exitEditMode'
    ]),

    saveReportSetting() {
      return appApi.updateAppReportSetting(this.currentAppId, {setting: this.reportSetting}).then(() => {
        this.exitEditMode();
        this.$emit('reportSaved');
        this.$message({
          type: 'success',
          message: `报表保存成功。`,
          center: true
        });
      });
    },
  }
}
</script>

<style lang="scss" module>
$content-margin: 24px;

.wrapper {
  height: calc(100vh - #{$consoleTopBarHeight});
  overflow-y: auto;
}

.content {
  margin: 10px $content-margin $content-margin;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  margin-bottom: 15px;
}

.headerTitle {
  font-size: 15px;
  font-weight: 500;
}

.topButton {
  width: $pageButtonWidth;
}

.addNumberReportBar {
  margin-bottom: 15px;
}

.numberReportSection {
  margin-bottom: 20px;
}

.emptySection {
  margin-top: 200px;
}

.emptyImageContainer {
  background-position: center center;
  background-size: cover;
  width: 200px;
  height: 200px;
  margin: auto;
}

.emptyText {
  text-align: center;
  margin-top: 20px;
  color: $secondaryTextColor;
}

.emptyEditButton {
  width: $pageButtonWidth;
  display: block;
  margin: 15px auto auto;
}

.addChartReportBar {
  margin-bottom: 15px;
}

.packageWarning {
  margin: 24px;
}

.purchaseLink {
  color: white;
  text-decoration: underline;
}

.purchaseLink:visited {
  color: white;
}
</style>

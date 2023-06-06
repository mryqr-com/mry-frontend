<template>
  <div :class="$style.wrapper">
    <template v-if="isReportingAllowed">
      <header :class="$style.headerBar">
        <div :class="$style.iconButtonContainer">
          <button :class="$style.headerButton"
                  class="majoricon i-left plainButton"
                  title="返回上级"
                  @click="goToUpperLink">
          </button>
        </div>
        <span :class="$style.headerBarTitle">{{ barTitle }}</span>
        <div :class="$style.rightPlaceholder"></div>
      </header>

      <main :class="$style.mainContent">
        <div :class="$style.mainContentTopPlaceHolder"></div>
        <section :class="$style.numberReportSection">
          <el-row v-if="numberReports.length > 0" :gutter="10">
            <el-col v-for="(report,index) in numberReports"
                    :key="report.id"
                    :span="12">
              <NumberReport :appId="appId"
                            :class="$style.numberReport"
                            :groupId="groupId"
                            :height="80"
                            :nameFontSize="13"
                            :numberFontSize="26"
                            :report="report">
              </NumberReport>
            </el-col>
          </el-row>
        </section>

        <section :class="$style.chartReportSection">
          <ChartReport v-for="(report,index) in chartReports"
                       :key="index"
                       :appId="appId"
                       :appSetting="appSetting"
                       :attributesMap="attributesMap"
                       :class="$style.chartReport"
                       :controlsMap="controlsMap"
                       :groupId="groupId"
                       :groupNamesMap="groupNamesMap"
                       :index="index"
                       :report="report">
          </ChartReport>
        </section>
      </main>
    </template>
    <template v-else>
      <div :class="$style.packageNotAllowedText">
        您当前的套餐版本过低或者已经过期，无法使用统计报表功能，请联系您的系统管理员在码如云官网进行套餐升级或续费。
        <el-button :class="$style.backButton" size="medium" type="primary" @click="goToUpperLink">返回</el-button>
      </div>
    </template>
  </div>
</template>

<script>
import {createNamespacedHelpers, mapGetters} from "vuex";
import NumberReport from '@/common/components/report/number/NumberReport';
import ChartReport from '@/common/components/report/chart/ChartReport';

const clientAppOperationStore = createNamespacedHelpers('CLIENT_APP_OPERATION_STORE');

export default {
  props: {
    groupId: {
      type: String,
    },

    upperLinkName: {
      type: String,
      required: true,
    }
  },

  components: {
    NumberReport,
    ChartReport,
  },

  computed: {
    ...mapGetters([
      'isReportingAllowed',
    ]),

    ...clientAppOperationStore.mapState([
      'groupNamesMap',
      'attributesMap',
      'controlsMap',
    ]),

    ...clientAppOperationStore.mapGetters([
      'appId',
      'appName',
      'groupNameOf',
      'numberReportSetting',
      'chartReportSetting',
      'appSetting',
    ]),

    barTitle() {
      return this.groupId ? this.groupNameOf(this.groupId) : this.appName;
    },

    numberReports() {
      return this.numberReportSetting.reports;
    },

    chartReports() {
      return this.chartReportSetting.reports;
    },
  },

  methods: {
    goToUpperLink() {
      this.$router.push({name: this.upperLinkName});
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
  height: 100%;
  overflow-y: auto;
}

.headerBar {
  height: $clientTopBarHeight;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: $clientPageZIndex + 1;
  background-color: white;
  display: flex;
  align-items: center;
  box-shadow: $lightShadow;
}

.iconButtonContainer {
  flex-shrink: 0;
  flex-grow: 0;
  padding: 10px;
}

.headerButton {
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: $clientIconButtonLength;
  height: $clientIconButtonLength;
  font-size: 20px;
  color: $regularTextColor;
}

.headerBarTitle {
  flex-grow: 1;
  flex-shrink: 0;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  color: $primaryTextColor;
}

.rightPlaceholder {
  width: calc(#{$clientIconButtonLength} + 20px);
}

.mainContent {
  position: relative;
  z-index: $clientPageZIndex;
  margin-top: $clientTopBarHeight;
  height: calc(100vh - #{$clientTopBarHeight});
  overflow-y: auto;
}

.mainContentTopPlaceHolder {
  height: 10px;
}

.numberReportSection {
  margin-left: 10px;
  margin-right: 10px;
}

.numberReport {
  margin-bottom: 10px;
}

.chartReportSection {
  margin-left: 10px;
  margin-right: 10px;
}

.chartReport {
  padding: 10px;
  margin-bottom: 10px;
}

.packageNotAllowedText {
  padding: 15px;
  line-height: 1.8em;
  margin-top: 30vh;
}

.backButton {
  display: block;
  width: $pageButtonWidth;
  margin-left: auto;
  margin-right: auto;
  margin-top: 36px;
}

</style>

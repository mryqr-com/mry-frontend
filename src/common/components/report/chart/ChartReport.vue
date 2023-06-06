<template>
  <div :class="$style.wrapper">
    <div :class="$style.reportName">{{ report.name }}</div>
    <component :is="report.type"
               :appSetting="appSetting"
               :attributesMap="attributesMap"
               :controlsMap="controlsMap"
               :groupNamesMap="groupNamesMap"
               :index="index"
               :loadFailed="loadFailed"
               :report="report"
               :reportData="reportData"
               @requestReloadData="reloadData">
    </component>
  </div>
</template>

<script>
import reportApi from '@/common/api/report-api';
import ControlBarReport from '@/common/components/report/chart/ControlBarReport';
import ControlPieReport from '@/common/components/report/chart/ControlPieReport';
import ControlDoughnutReport from '@/common/components/report/chart/ControlDoughnutReport';
import AttributeBarReport from '@/common/components/report/chart/AttributeBarReport';
import AttributePieReport from '@/common/components/report/chart/AttributePieReport';
import AttributeDoughnutReport from '@/common/components/report/chart/AttributeDoughnutReport';

import NumberRangeReport from '@/common/components/report/chart/NumberRangeReport';
import TimeSegmentReport from '@/common/components/report/chart/TimeSegmentReport';

export default {
  props: {
    report: {
      type: Object,
      required: true
    },

    appId: {
      type: String,
      required: true
    },

    groupId: {
      type: String,
    },

    controlsMap: {
      type: Map,
      required: true,
    },

    attributesMap: {
      type: Map,
      required: true,
    },

    groupNamesMap: {
      type: Map,
      required: true,
    },

    index: {
      type: Number,
      default: 0,
    },

    appSetting: {
      type: Object,
      required: true
    }
  },

  components: {
    CONTROL_BAR_REPORT: ControlBarReport,
    CONTROL_PIE_REPORT: ControlPieReport,
    CONTROL_DOUGHNUT_REPORT: ControlDoughnutReport,
    CONTROL_NUMBER_RANGE_REPORT: NumberRangeReport,
    CONTROL_TIME_SEGMENT_REPORT: TimeSegmentReport,
    ATTRIBUTE_BAR_REPORT: AttributeBarReport,
    ATTRIBUTE_PIE_REPORT: AttributePieReport,
    ATTRIBUTE_DOUGHNUT_REPORT: AttributeDoughnutReport,
    ATTRIBUTE_NUMBER_RANGE_SEGMENT_REPORT: NumberRangeReport,
    ATTRIBUTE_TIME_SEGMENT_REPORT: TimeSegmentReport,
  },

  data() {
    return {
      reportData: null,
      loadFailed: false,
    }
  },

  created() {
    this.fetchReport();
  },

  methods: {
    reloadData() {
      this.fetchReport();
    },

    fetchReport() {
      this.reportData = null;
      this.loadFailed = false;

      let query = {
        appId: this.appId,
        groupId: this.groupId,
        report: this.report
      };

      return reportApi.fetchChartReport(query).then((response) => {
        this.reportData = response.data;
        this.loadFailed = false;
      }).catch(e => {
        this.reportData = null;
        this.loadFailed = true;
      });
    },
  }

}
</script>

<style lang="scss" module>
.wrapper {
  background-color: white;
}

.reportName {
  font-weight: 500;
  color: $primaryTextColor;
  margin-bottom: 10px;
}

</style>

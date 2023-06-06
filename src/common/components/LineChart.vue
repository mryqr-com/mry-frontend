<template>
  <div :class="$style.wrapper">
    <canvas :id="id"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {randomHtmlElementId} from "@/common/utils/common-utils";

export default {
  props: {
    data: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      id: randomHtmlElementId()
    }
  },

  mounted() {
    const config = {
      type: 'line',
      data: this.data,
      options: this.options,
      plugins: [ChartDataLabels,
        {
          beforeInit(chart) {//增加legend和图形区域的间距，参考: https://stackoverflow.com/questions/42585861/chart-js-increase-spacing-between-legend-and-chart
            const originalFit = chart.legend.fit;
            chart.legend.fit = function fit() {
              originalFit.bind(chart.legend)();
              this.height += 10;
            }
          }
        }],
    };
    new Chart(
        document.getElementById(this.id),
        config
    );
  }
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>
<template>
  <div :class="$style.wrapper">
    <canvas :id="id"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {randomHtmlElementId} from "@/common/utils/common-utils";

let centerLabelPlugin = {
  id: 'doughnut-center-label',
  beforeDraw: function (chart) {
    let data = chart.data.datasets[0].data;
    let sum = data.reduce(function (a, b) {
      return a + b;
    }, 0);
    let minusWidth = chart.legend.position === 'top' || chart.legend.position === 'bottom' ? 0 : chart.legend.width;
    let width = chart.width - minusWidth,
        height = (chart.chartArea.top + chart.chartArea.bottom) / 2,
        ctx = chart.ctx;
    ctx.restore();
    let fontSize = (height / 10).toFixed(2);
    ctx.font = fontSize + "px Arial";
    ctx.textBaseline = "middle";
    let text = sum,
        textX = Math.round((width - ctx.measureText(text).width) / 2);
    ctx.fillText(text, textX, height);
    ctx.save();
  }
};

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
      id: randomHtmlElementId(),
    }
  },

  mounted() {
    const config = {
      type: 'doughnut',
      data: this.data,
      options: this.options,
      plugins: [ChartDataLabels, centerLabelPlugin],
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
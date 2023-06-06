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
      type: 'pie',
      data: this.data,
      options: this.options,
      plugins: [ChartDataLabels],
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
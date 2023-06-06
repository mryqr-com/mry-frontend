<template>
  <div :class="$style.wrapper">
    <LineChart :key="chartKey + index"
               :class="$style.theChart"
               :data="chartData"
               :options="chartOptions">
    </LineChart>
    <div v-if="!reportData || loadFailed" :class="$style.loadingMask">
      <template v-if="loadFailed">
        加载失败
        <el-button :class="$style.reloadButton" type="text" @click="reloadData">重新加载</el-button>
      </template>
      <template v-else>
        <i :class="$style.loadingIcon" class="el-icon-loading"></i>加载中...
      </template>
    </div>
  </div>
</template>

<script>
import uuid from "short-uuid";
import {isEqual} from 'lodash-es';
import {isMobileBrowser} from "@/common/utils/common-utils";

export default {
  props: ['report', 'controlsMap', 'reportData', 'index', 'loadFailed'],

  components: {
    LineChart: () => import(/* webpackChunkName: "chartjs" */ '@/common/components/LineChart')
  },

  data() {
    return {
      chartKey: uuid.generate(),
    }
  },

  watch: {
    setting: {
      handler(newValue, oldValue) {
        if (!isEqual(newValue, oldValue)) {
          this.$emit('requestReloadData');
        }
      },
      deep: true,
    },

    style: {
      handler(newValue, oldValue) {
        if (!isEqual(newValue, oldValue)) {
          this.chartKey = uuid.generate();
        }
      },
      deep: true,
    },

    'report.aspectRatio': {
      handler() {
        this.chartKey = uuid.generate();
      },
    },

    reportData: {
      handler() {
        this.chartKey = uuid.generate();
      },
      deep: true,
    }
  },

  computed: {
    resultReportData() {
      if (this.reportData) {
        return this.reportData;
      }

      return {
        numberRanges: [],
        segments: [],
        type: 'NUMBER_RANGE_SEGMENT',
        hasData: false,
      }
    },

    segments() {
      return this.resultReportData.segments;
    },

    numberRanges() {
      return this.resultReportData.numberRanges;
    },

    setting() {
      return this.report.setting;
    },

    style() {
      return this.report.style;
    },

    labels() {
      let result = [];
      for (let index = 0; index < this.numberRanges.length - 1; index++) {
        result.push(`[${this.numberRanges[index]}-${this.numberRanges[index + 1]})`);
      }
      return result;
    },

    datas() {
      return this.segments.map(segment => segment.value);
    },

    chartData() {
      return {
        labels: this.labels,
        datasets: [{
          type: 'bar',
          data: this.datas,
          backgroundColor: this.style.color,
          categoryPercentage: 1,
          barPercentage: 1,
          borderColor: 'white',
          borderWidth: {
            right: 1
          },
          datalabels: {
            anchor: 'end',
            align: 'end',
          }
        },
        ]
      }
    },

    chartOptions() {
      return {
        layout: {
          padding: {
            top: 5
          }
        },
        scales: {
          x: {
            display: false,
          },

          x1: {
            type: 'linear',
            grid: {
              display: !this.style.hideGrid,
            },
            title: {
              display: this.style.xTitle,
              color: '#909399',
              text: this.style.xTitle,
              padding: {top: 10, left: 0, right: 0, bottom: 0}
            },
            min: 0,
            max: this.labels.length,
            ticks: {
              stepSize: 1,
              callback: (value, index) => {
                if (index < this.labels.length) {
                  return this.numberRanges[index];
                }
                return this.numberRanges[this.numberRanges.length - 1];
              }
            }
          },
          y: {
            grid: {
              display: !this.style.hideGrid
            },
            title: {
              display: this.style.yTitle,
              color: '#909399',
              text: this.style.yTitle,
              padding: {top: 0, left: 0, right: 0, bottom: 10}
            },
            ticks: {
              stepSize: 1,
            }
          }
        },

        aspectRatio: isMobileBrowser() ? 1.2 : 1 / (this.report.aspectRatio / 100),
        indexAxis: 'x',
        plugins: {
          legend: {
            display: false
          },
          datalabels: {
            display: this.style.showNumber,
            color: '#606266',
          }
        }
      }
    },
  },

  methods: {
    reloadData() {
      this.$emit('requestReloadData');
    }
  },
}
</script>

<style lang="scss" module>
.wrapper {
  position: relative;
}

.theChart {
  position: relative;
  margin-left: auto;
  margin-right: auto;
}

.loadingMask {
  width: 100%;
  height: 100%;
  background-color: white;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $secondaryTextColor;
}

.reloadButton {
  margin-left: 5px;
  padding: 0;
}

.loadingIcon {
  font-weight: normal;
  font-size: 20px;
  margin-right: 5px;
}
</style>

<template>
  <div :class="$style.wrapper">
    <BarChart :key="chartKey + index"
              :class="$style.theChart"
              :data="chartData"
              :options="chartOptions">
    </BarChart>
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
import {isMobileBrowser, recentMonths, recentSeasons, recentYears} from "@/common/utils/common-utils";

export default {
  props: ['report', 'controlsMap', 'reportData', 'index', 'loadFailed'],

  components: {
    BarChart: () => import(/* webpackChunkName: "chartjs" */ '@/common/components/BarChart')
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
        segmentsData: [[]],
        interval: 'PER_MONTH',
        type: 'TIME_SEGMENT',
        hasData: false,
      }
    },

    segmentsData() {
      return this.resultReportData.segmentsData;
    },

    interval() {
      return this.resultReportData.interval;
    },

    setting() {
      return this.report.setting;
    },

    style() {
      return this.report.style;
    },

    mappedSegmentsData() {
      return this.segmentsData.map(segments => {
        return Object.fromEntries(segments.map(segment => {
          return {key: `${segment.year}-${segment.period}`, value: segment.value}
        }).map(e => [e.key, e.value]));
      });
    },

    finalSegmentsData() {
      switch (this.interval) {
        case 'PER_MONTH': {
          let months = recentMonths(this.style.max);
          return this.mappedSegmentsData.map(segmentsMap => {
            return months.map(month => {
              return {
                label: `${month.year}-${month.month}月`,
                value: segmentsMap[`${month.year}-${month.month}`]
              };
            });
          });
        }

        case 'PER_SEASON': {
          let seasons = recentSeasons(this.style.max);
          return this.mappedSegmentsData.map(segmentsMap => {
            return seasons.map(season => {
              return {
                label: `${season.year}-${season.season}季度`,
                value: segmentsMap[`${season.year}-${season.season}`]
              };
            });
          });
        }

        case 'PER_YEAR': {
          let years = recentYears(this.style.max);
          return this.mappedSegmentsData.map(segmentsMap => {
            return years.map(year => {
              return {
                label: `${year}年`,
                value: segmentsMap[`${year}-${year}`]
              };
            });
          });
        }
      }
    },

    chartData() {
      let datasets = this.finalSegmentsData.map((segments, index) => {
        return {
          label: this.setting.segmentSettings[index].name,
          maxBarThickness: 80,
          data: segments.map(segment => segment.value),
          yAxisID: 'y' + index,
          backgroundColor: this.style.colors[index],
          datalabels: {
            anchor: 'end',
            align: this.style.horizontal ? 'start' : 'end',
            offset: this.style.horizontal ? 5 : 0,
          }
        };
      });

      return {
        labels: this.finalSegmentsData.length > 0 ? this.finalSegmentsData[0].map(segment => segment.label) : [],
        datasets: datasets,
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
            grid: {
              display: !this.style.hideGrid
            },
            title: {
              display: this.style.xTitle,
              color: '#909399',
              text: this.style.xTitle,
              padding: {top: 10, left: 0, right: 0, bottom: 0}
            }
          },
          y0: {
            grid: {
              display: !this.style.hideGrid
            },
            title: {
              display: this.style.yTitle,
              color: '#909399',
              text: this.style.yTitle,
              padding: {top: 0, left: 0, right: 10, bottom: 10}
            }
          },
          y1: {
            display: this.segmentsData.length > 1,//只有多余1套数据时才显示
            position: 'right',
            grid: {
              display: false,
            },
          }
        },
        aspectRatio: isMobileBrowser() ? 1.2 : 1 / (this.report.aspectRatio / 100),
        indexAxis: this.style.horizontal ? 'y' : 'x',
        plugins: {
          legend: {
            display: this.segmentsData.length > 1,
            position: 'top',
          },
          datalabels: {
            display: this.style.showNumber,
            color: this.style.horizontal ? 'white' : '#606266',
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

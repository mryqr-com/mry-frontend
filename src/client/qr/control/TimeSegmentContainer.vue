<template>
  <ControlWrapper v-if="shouldShowControl" :control="control" :index="index">
    <BarChart v-if="segmentsData.length > 0"
              :class="$style.theChart"
              :data="chartData"
              :options="chartOptions"
              :style="chartStyle">
    </BarChart>
    <div v-else :class="$style.errorMessage">
      <template v-if="errorMessage">
        {{ errorMessage }}
      </template>
      <template v-else>无数据</template>
    </div>
  </ControlWrapper>
</template>

<script>
import {
  apiErrorCodeOf,
  errorOfApi,
  isApiErrorResponse,
  recentMonths,
  recentSeasons,
  recentYears
} from "@/common/utils/common-utils";
import presentationApi from "@/common/api/presentation-api";
import {createNamespacedHelpers} from "vuex";

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  props: ['control', 'index'],

  components: {
    BarChart: () => import(/* webpackChunkName: "chartjs" */ '@/common/components/BarChart')
  },

  data() {
    return {
      segmentsData: [],
      loaded: false,
      errorMessage: null,
    }
  },

  created() {
    if (!this.isLoggedIn) {
      this.loaded = true;
      this.errorMessage = '请登录后查看';
      return;
    }

    if (!this.control.complete) {
      console.error(`Time segment control[${this.control.id}] is not complete.`)
      this.loaded = true;
      return;
    }

    presentationApi.fetchPresentation(this.qrId, this.currentPageId, this.control.id)
        .then(response => this.segmentsData = response.data.segmentsData)
        .catch(ex => {
          console.error("Failed to fetch time segment data:" + ex.message);
          if (isApiErrorResponse(ex)) {
            switch (apiErrorCodeOf(ex)) {
              case 'CONTROL_TYPE_NOT_ALLOWED': {
                this.errorMessage = errorOfApi(ex).userMessage;
                break;
              }

              case 'AUTHENTICATION_FAILED': {
                this.errorMessage = '请登录后查看';
                break;
              }

              case 'ACCESS_DENIED': {
                this.errorMessage = '无权查看';
                break;
              }

              default: {
                this.errorMessage = '无法获取数据';
              }
            }
          }
        }).finally(() => this.loaded = true);
  },

  computed: {
    ...clientQrStore.mapGetters([
      'isLoggedIn',
      'qrId',
      'currentPageId',
    ]),

    hasData() {
      return this.segmentsData.some(it => it.length > 0);
    },

    shouldShowControl() {
      if (!this.loaded) {
        return false;
      }

      return !(this.control.hideControlIfNoData && !this.hasData);
    },

    chartStyle() {
      return {
        width: `${this.control.sizeRatio}%`
      }
    },

    mappedSegmentsData() {
      return this.segmentsData.map(segments => {
        return Object.fromEntries(segments.map(segment => {
          return {key: `${segment.year}-${segment.period}`, value: segment.value}
        }).map(e => [e.key, e.value]));
      });
    },

    finalSegmentsData() {
      switch (this.control.interval) {
        case 'PER_MONTH': {
          let months = recentMonths(this.control.max);
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
          let seasons = recentSeasons(this.control.max);
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
          let years = recentYears(this.control.max);
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
          label: this.control.segmentSettings[index].name,
          maxBarThickness: 80,
          data: segments.map(segment => segment.value),
          yAxisID: 'y' + index,
          backgroundColor: this.control.colors[index],
          datalabels: {
            anchor: 'end',
            align: this.control.horizontal ? 'start' : 'end',
            offset: this.control.horizontal ? 5 : 0,
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
              display: !this.control.hideGrid
            },
            title: {
              display: this.control.xTitle,
              color: '#909399',
              text: this.control.xTitle,
              padding: {top: 10, left: 0, right: 0, bottom: 0}
            }
          },
          y0: {
            grid: {
              display: !this.control.hideGrid
            },
            title: {
              display: this.control.yTitle,
              color: '#909399',
              text: this.control.yTitle,
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
        indexAxis: this.control.horizontal ? 'y' : 'x',
        plugins: {
          legend: {
            display: this.segmentsData.length > 1,
            position: 'top',
          },
          datalabels: {
            display: this.control.showNumber,
            color: this.control.horizontal ? 'white' : '#606266',
          }
        }
      }
    },
  }
}
</script>

<style lang="scss" module>
.theChart {
  position: relative;
  margin-left: auto;
  margin-right: auto;
}

.errorMessage {
  line-height: 1.4em;
}
</style>

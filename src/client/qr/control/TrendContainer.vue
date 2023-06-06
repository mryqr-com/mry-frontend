<template>
  <ControlWrapper v-if="shouldShowControl" :control="control" :index="index">
    <LineChart v-if="dataSets.length > 0"
               :class="$style.theChart"
               :data="chartData"
               :options="chartOptions"
               :style="chartStyle">
    </LineChart>
    <div v-else :class="$style.errorMessage">
      <template v-if="errorMessage">
        {{ errorMessage }}
      </template>
      <template v-else>无数据</template>
    </div>
  </ControlWrapper>
</template>

<script>
import presentationApi from "@/common/api/presentation-api";
import {createNamespacedHelpers} from "vuex";
import {apiErrorCodeOf, errorOfApi, formatDateToDate, isApiErrorResponse} from "@/common/utils/common-utils";

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  props: ['control', 'index'],

  components: {
    LineChart: () => import(/* webpackChunkName: "chartjs" */ '@/common/components/LineChart')
  },

  data() {
    return {
      dataSets: [],
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
      console.error(`Trend control[${this.control.id}] is not complete.`)
      this.loaded = true;
      return;
    }

    presentationApi.fetchPresentation(this.qrId, this.currentPageId, this.control.id)
        .then(response => this.dataSets = response.data.dataSets)
        .catch(ex => {
          console.error("Failed to fetch trend data:" + ex.message);
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

    chartStyle() {
      return {
        width: `${this.control.sizeRatio}%`
      }
    },

    labels() {
      let allDateStrings = new Set();
      this.dataSets.forEach(dataset => {
        dataset.records.forEach(record => {
          allDateStrings.add(record.date);
        });
      })

      if (allDateStrings.length <= 1) {
        return [];
      }

      let allDates = Array.from(allDateStrings).map(date => new Date(date));

      let maxDate = new Date(Math.max.apply(null, allDates));
      let minDate = new Date(Math.min.apply(null, allDates));
      let days = Math.round((maxDate - minDate) / (1000 * 60 * 60 * 24));

      return [...Array(days + 1)].map((_, i) => {
        const date = new Date(minDate.getTime());
        date.setDate(minDate.getDate() + i);
        return formatDateToDate(date);
      });
    },

    chartData() {
      return {
        labels: this.labels,
        datasets: this.dataSets.map((item, index) => {
          return {
            datalabels: {
              align: 'end',
              anchor: 'end'
            },
            data: item.records.map(record => {
              return {x: record.date, y: record.number};
            }),
            label: item.label,
            yAxisID: 'y' + index,
            tension: this.control.bezier ? 0.3 : 0,
            borderColor: this.control.colors[index]
          };
        })
      }
    },

    chartOptions() {
      return {
        scales: {
          x: {
            title: {
              display: this.control.xTitle,
              color: '#909399',
              text: this.control.xTitle,
              padding: {top: 10, left: 0, right: 0, bottom: 0}
            },
            grid: {
              display: !this.control.hideGrid
            },
          },
          y0: {
            type: 'linear',
            display: true,
            position: 'left',
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
            type: 'linear',
            display: this.dataSets.length > 1,//只有多余1套数据时才显示
            position: 'right',
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
              display: !this.control.hideGrid
            },
          },
        },
        plugins: {
          datalabels: {
            display: this.control.showNumber,
            formatter: (value, ctx) => {
              return value.y;
            },
          }
        }
      }
    },

    shouldShowControl() {
      if (!this.loaded) {
        return false;
      }
      return !(this.control.hideControlIfNoData && this.dataSets.length === 0);
    },
  },
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

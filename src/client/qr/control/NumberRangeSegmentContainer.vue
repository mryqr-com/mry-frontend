<template>
  <ControlWrapper v-if="shouldShowControl" :control="control" :index="index">
    <LineChart v-if="hasData"
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
import {apiErrorCodeOf, errorOfApi, isApiErrorResponse} from "@/common/utils/common-utils";

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  props: ['control', 'index'],

  components: {
    LineChart: () => import(/* webpackChunkName: "chartjs" */ '@/common/components/LineChart')
  },

  data() {
    return {
      numberRanges: [],
      segments: [],
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
      console.error(`Value segment control[${this.control.id}] is not complete.`)
      this.loaded = true;
      return;
    }

    presentationApi.fetchPresentation(this.qrId, this.currentPageId, this.control.id)
        .then(response => {
          this.segments = response.data.segments;
          this.numberRanges = response.data.numberRanges;
        }).catch(ex => {
      console.error("Failed to fetch value segment data:" + ex.message);
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
      return this.segments.some(segment => segment.value !== 0);
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
          backgroundColor: this.control.color,
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
              display: !this.control.hideGrid,
            },
            title: {
              display: this.control.xTitle,
              color: '#909399',
              text: this.control.xTitle,
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
              display: !this.control.hideGrid
            },
            title: {
              display: this.control.yTitle,
              color: '#909399',
              text: this.control.yTitle,
              padding: {top: 0, left: 0, right: 0, bottom: 10}
            },
            ticks: {
              stepSize: 1,
            }
          }
        },
        indexAxis: 'x',
        plugins: {
          legend: {
            display: false
          },
          datalabels: {
            display: this.control.showNumber,
            color: '#606266',
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

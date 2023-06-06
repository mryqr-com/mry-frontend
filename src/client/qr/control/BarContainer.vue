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
import {createNamespacedHelpers} from "vuex";
import presentationApi from "@/common/api/presentation-api";
import {apiErrorCodeOf, controlFieldName, errorOfApi, isApiErrorResponse} from "@/common/utils/common-utils";

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  props: ['control', 'index'],

  components: {
    BarChart: () => import(/* webpackChunkName: "chartjs" */ '@/common/components/BarChart')
  },

  data() {
    return {
      loaded: false,
      errorMessage: null,
      segmentsData: [],
    }
  },

  created() {
    if (!this.isLoggedIn) {
      this.loaded = true;
      this.errorMessage = '请登录后查看';
      return;
    }

    if (!this.control.complete) {
      console.error(`Bar control[${this.control.id}] is not complete.`)
      this.loaded = true;
      return;
    }

    presentationApi.fetchPresentation(this.qrId, this.currentPageId, this.control.id)
        .then(response => {
          response.data.segmentsData.forEach(it => it.sort((a, b) => b.value - a.value));
          this.segmentsData = response.data.segmentsData;
        }).catch(ex => {
      console.error("Failed to fetch bar segment data:" + ex.message);
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
      'controlOf',
    ]),

    chartStyle() {
      return {
        width: `${this.control.sizeRatio}%`
      }
    },

    cleanedSegmentsData() {
      let refControl = this.controlOf(this.control.basedControlId);
      if (!refControl) {
        return [];
      }

      return this.segmentsData.map(segments => {
        switch (refControl.type) {
          case 'RADIO':
          case 'CHECKBOX':
          case 'ITEM_STATUS':
          case 'DROPDOWN': {
            let optionMap = new Map(refControl.options.map(it => [it.id, it.name]));
            return segments.map(segment => {
              let textValue = optionMap.get(segment.option);
              return textValue ? {option: textValue, value: segment.value} : null;
            }).filter(segment => segment);
          }
          case 'GEOLOCATION':
          case 'ADDRESS': {
            if (this.control.addressPrecisionType === 'PROVINCE') {//省份
              return segments.filter(segment => {
                return !segment.option.includes('/');
              });
            }
            if (this.control.addressPrecisionType === 'DISTRICT') {//区县
              return segments.filter(segment => {
                return (segment.option.match(/\//g) || []).length === 2;
              }).map(segment => {
                let split = segment.option.split('/');
                return {option: `${split[1]}/${split[2]}`, value: segment.value};
              });
            }
            return segments.filter(segment => {//城市
              return (segment.option.match(/\//g) || []).length === 1;
            }).map(segment => {
              return {option: segment.option.split('/')[1], value: segment.value};
            });
          }

          case 'MULTI_LEVEL_SELECTION': {
            if (this.control.multiLevelSelectionPrecisionType === 'LEVEL1') {
              return segments.filter(segment => {
                return !segment.option.includes('/');
              });
            }

            if (this.control.multiLevelSelectionPrecisionType === 'LEVEL2') {
              return segments.filter(segment => {
                return (segment.option.match(/\//g) || []).length === 1;
              });
            }

            return segments.filter(segment => {
              return (segment.option.match(/\//g) || []).length === 2;
            });
          }

          case 'POINT_CHECK': {
            return segments.map(segment => {
              return {option: segment.option === 'YES' ? '正常' : '异常', value: segment.value};
            });
          }
        }
      });
    },

    finalSegmentsData() {
      if (this.cleanedSegmentsData.length === 0) {
        return [];
      }

      let finalSegmentsData = [];
      let primarySegments = this.cleanedSegmentsData[0].sort((a, b) => b.value - a.value).slice(0, this.control.max);
      finalSegmentsData.push(primarySegments);

      if (this.cleanedSegmentsData.length > 1) {//以第一个统计项为基准填入第二个统计项的值
        let secondarySegments = primarySegments.map(segment => {
          let secondSegment = this.cleanedSegmentsData[1].find(it => it.option === segment.option);
          return secondSegment ? secondSegment : {option: segment.option, value: null};
        });

        finalSegmentsData.push(secondarySegments);
      }
      return finalSegmentsData;
    },

    hasData() {
      return this.finalSegmentsData.length > 0 && this.finalSegmentsData[0].length > 0;
    },

    chartData() {
      let datasets = this.finalSegmentsData.map((segments, index) => {
        return {
          label: this.control.targetControlIds.length > 0 ? controlFieldName(this.controlOf(this.control.targetControlIds[index])) : 0,
          maxBarThickness: 60,
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
        labels: this.finalSegmentsData.length > 0 ? this.finalSegmentsData[0].map(segment => segment.option) : [],
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
            ticks: {
              stepSize: 1,
            },
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
            ticks: {
              stepSize: 1,
            },
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
            display: this.finalSegmentsData.length > 1,//只有多余1套数据时才显示
            position: 'right',
            grid: {
              display: false,
            },
          }
        },

        indexAxis: this.control.horizontal ? 'y' : 'x',
        plugins: {
          legend: {
            display: this.finalSegmentsData.length > 1,
            position: 'top',
          },
          datalabels: {
            display: this.control.showNumber,
            color: this.control.horizontal ? 'white' : '#606266',
          }
        }
      }
    },

    shouldShowControl() {
      if (!this.loaded) {
        return false;
      }

      return !(this.control.hideControlIfNoData && !this.hasData);
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

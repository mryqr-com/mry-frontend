<template>
  <ControlWrapper v-if="shouldShowControl" :control="control" :index="index">
    <DoughnutChart v-if="finalSegments.length > 0 && sum > 0"
                   :class="$style.theChart"
                   :data="chartData"
                   :options="chartOptions"
                   :style="chartStyle">
    </DoughnutChart>
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
import {apiErrorCodeOf, errorOfApi, isApiErrorResponse, randomColors} from "@/common/utils/common-utils";

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  props: ['control', 'index'],

  components: {
    DoughnutChart: () => import(/* webpackChunkName: "chartjs" */ '@/common/components/DoughnutChart')
  },

  data() {
    return {
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
      console.error(`Doughnut control[${this.control.id}] is not complete.`)
      this.loaded = true;
      return;
    }

    presentationApi.fetchPresentation(this.qrId, this.currentPageId, this.control.id)
        .then(response => this.segments = response.data.segments.sort((a, b) => b.value - a.value))
        .catch(ex => {
          console.error("Failed to fetch doughnut segment data:" + ex.message);
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

    displaySegments() {
      let refControl = this.controlOf(this.control.basedControlId);
      if (!refControl) {
        return [];
      }

      switch (refControl.type) {
        case 'RADIO':
        case 'CHECKBOX':
        case 'DROPDOWN': {
          let optionMap = new Map(refControl.options.map(it => [it.id, it]));
          return this.segments.map((segment, index) => {
            let textValue = optionMap.get(segment.option).name;
            return textValue ? {option: textValue, value: segment.value, color: this.control.colors[index]} : null;
          }).filter(segment => segment);
        }

        case 'ITEM_STATUS': {
          let optionMap = new Map(refControl.options.map(it => [it.id, it]));
          return this.segments.map((segment, index) => {
            let option = optionMap.get(segment.option);
            let textValue = option.name;
            let color = option.color;
            if (!color) {
              color = randomColors()[index];
            }
            return textValue ? {option: textValue, value: segment.value, color: color} : null;
          }).filter(segment => segment);
        }

        case 'GEOLOCATION':
        case 'ADDRESS': {
          if (this.control.addressPrecisionType === 'PROVINCE') {
            return this.segments.filter(segment => {
              return !segment.option.includes('/');
            }).map((segment, index) => {
              return {option: segment.option, value: segment.value, color: this.control.colors[index]};
            });
          }

          if (this.control.addressPrecisionType === 'DISTRICT') {
            return this.segments.filter(segment => {
              return (segment.option.match(/\//g) || []).length === 2;
            }).map((segment, index) => {
              let split = segment.option.split('/');
              return {option: `${split[1]}/${split[2]}`, value: segment.value, color: this.control.colors[index]};
            });
          }

          return this.segments.filter(segment => {
            return (segment.option.match(/\//g) || []).length === 1;
          }).map((segment, index) => {
            return {option: segment.option.split('/')[1], value: segment.value, color: this.control.colors[index]};
          });
        }

        case 'MULTI_LEVEL_SELECTION': {
          if (this.control.multiLevelSelectionPrecisionType === 'LEVEL1') {
            return this.segments.filter(segment => {
              return !segment.option.includes('/');
            }).map((segment, index) => {
              return {option: segment.option, value: segment.value, color: this.control.colors[index]};
            });
          }

          if (this.control.multiLevelSelectionPrecisionType === 'LEVEL2') {
            return this.segments.filter(segment => {
              return (segment.option.match(/\//g) || []).length === 1;
            }).map((segment, index) => {
              return {option: segment.option, value: segment.value, color: this.control.colors[index]};
            });
          }

          return this.segments.filter(segment => {
            return (segment.option.match(/\//g) || []).length === 2;
          }).map((segment, index) => {
            return {option: segment.option, value: segment.value, color: this.control.colors[index]};
          });
        }

        case 'POINT_CHECK': {
          return this.segments.map(segment => {
            return {
              option: segment.option === 'YES' ? '正常' : '异常',
              value: segment.value,
              color: segment.option === 'YES' ? '#10b01b' : '#ea0000'
            };
          });
        }
      }
    },

    finalSegments() {
      if (this.control.max >= this.displaySegments.length) {
        return this.displaySegments;
      }

      let toBeDisplayed = this.displaySegments.slice(0, this.control.max);
      let others = this.displaySegments.slice(this.control.max, this.displaySegments.length);

      let othersTotalValue = others.reduce((a, b) => a + b.value, 0);
      if (othersTotalValue > 0) {
        toBeDisplayed.push({option: '其他', value: othersTotalValue, color: '#D9DBE0'});
      }

      return toBeDisplayed;
    },

    labels() {
      return this.finalSegments.map(segment => segment.option);
    },

    datas() {
      return this.finalSegments.map(segment => segment.value);
    },

    sum() {
      return this.finalSegments.reduce((a, b) => +a + +b.value, 0);
    },

    colors() {
      return this.finalSegments.map(segment => segment.color);
    },

    chartData() {
      return {
        labels: this.labels,
        datasets: [{
          data: this.datas,
          backgroundColor: this.colors,
        }]
      }
    },

    chartOptions: function () {
      let _this = this;
      return {
        plugins: {
          'doughnut-center-label': this.control.showCenterTotal,
          legend: {
            labels: {
              boxWidth: 10,
              padding: 6,
            }
          },

          datalabels: {
            formatter: (value, ctx) => {
              let percentageNumber = value * 100 / _this.sum;
              if (percentageNumber < 7) {
                return '';
              }

              let labelText = null;
              if (this.control.showLabels) {
                labelText = this.labels[ctx.dataIndex];
              }

              let valueText = null;
              if (this.control.showValue) {
                valueText = value;
              }

              let percentageText = null;
              if (this.control.showPercentage) {
                percentageText = percentageNumber.toFixed(2) + "%";
              }

              return [labelText, valueText, percentageText].filter(v => !!v).join('\n');
            },
            color: 'white',
          },

          tooltip: {
            callbacks: {
              label: function (context) {
                let value = +context.raw;
                let percentageText = _this.control.showPercentage ? ` (${(value * 100 / _this.sum).toFixed(2)}%)` : '';
                let label = context.label ? context.label + ': ' : '';

                return label + value + percentageText;
              }
            }
          },
        }
      }
    },

    shouldShowControl() {
      if (!this.loaded) {
        return false;
      }

      return !(this.control.hideControlIfNoData && this.finalSegments.length === 0);
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

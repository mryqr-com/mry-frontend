<template>
  <div :class="$style.wrapper">
    <PieChart :key="chartKey + index"
              :class="$style.pieChart"
              :data="pieData"
              :options="chartOptions">
    </PieChart>
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
import {isMobileBrowser, randomColors} from "@/common/utils/common-utils";
import uuid from "short-uuid";
import {isEqual} from 'lodash-es';

export default {
  props: ['report', 'controlsMap', 'reportData', 'index', 'loadFailed'],

  components: {
    PieChart: () => import(/* webpackChunkName: "chartjs" */ '@/common/components/PieChart'),
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
        type: 'CATEGORIZED_OPTION_SEGMENT',
        hasData: false,
      }
    },

    segments() {
      return this.resultReportData.segmentsData[0].sort((a, b) => b.value - a.value);
    },

    setting() {
      return this.report.setting;
    },

    style() {
      return this.report.style;
    },

    displaySegments() {
      let refControl = this.controlsMap.get(this.setting.basedControlId);
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
            return textValue ? {option: textValue, value: segment.value, color: this.style.colors[index]} : null;
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
          if (this.setting.addressPrecisionType === 'PROVINCE') {
            return this.segments.filter(segment => {
              return !segment.option.includes('/');
            }).map((segment, index) => {
              return {option: segment.option, value: segment.value, color: this.style.colors[index]};
            });
          }

          if (this.setting.addressPrecisionType === 'DISTRICT') {
            return this.segments.filter(segment => {
              return (segment.option.match(/\//g) || []).length === 2;
            }).map((segment, index) => {
              let split = segment.option.split('/');
              return {option: `${split[1]}/${split[2]}`, value: segment.value, color: this.style.colors[index]};
            });
          }

          return this.segments.filter(segment => {
            return (segment.option.match(/\//g) || []).length === 1;
          }).map((segment, index) => {
            return {option: segment.option.split('/')[1], value: segment.value, color: this.style.colors[index]};
          });
        }

        case 'MULTI_LEVEL_SELECTION': {
          if (this.setting.multiLevelSelectionPrecisionType === 'LEVEL1') {
            return this.segments.filter(segment => {
              return !segment.option.includes('/');
            }).map((segment, index) => {
              return {option: segment.option, value: segment.value, color: this.style.colors[index]};
            });
          }

          if (this.setting.multiLevelSelectionPrecisionType === 'LEVEL2') {
            return this.segments.filter(segment => {
              return (segment.option.match(/\//g) || []).length === 1;
            }).map((segment, index) => {
              return {option: segment.option, value: segment.value, color: this.style.colors[index]};
            });
          }

          return this.segments.filter(segment => {
            return (segment.option.match(/\//g) || []).length === 2;
          }).map((segment, index) => {
            return {option: segment.option, value: segment.value, color: this.style.colors[index]};
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
      if (this.style.max >= this.displaySegments.length) {
        return this.displaySegments;
      }

      let toBeDisplayed = this.displaySegments.slice(0, this.style.max);
      let others = this.displaySegments.slice(this.style.max, this.displaySegments.length);

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

    pieData() {
      return {
        labels: this.labels,
        datasets: [{
          data: this.datas,
          backgroundColor: this.colors,
        }]
      }
    },

    chartOptions() {
      let _this = this;
      return {
        aspectRatio: isMobileBrowser() ? 1.2 : 1 / (this.report.aspectRatio / 100),
        plugins: {
          'doughnut-center-label': this.style.showCenterTotal,
          legend: {
            position: isMobileBrowser() ? 'top' : 'right',
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
              if (this.style.showLabels) {
                labelText = this.labels[ctx.dataIndex];
              }

              let valueText = null;
              if (this.style.showValue) {
                valueText = value;
              }

              let percentageText = null;
              if (this.style.showPercentage) {
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
                let percentageText = _this.style.showPercentage ? ` (${(value * 100 / _this.sum).toFixed(2)}%)` : '';
                let label = context.label ? context.label + ': ' : '';

                return label + value + percentageText;
              }
            }
          },
        }
      }
    },
  },

  methods: {
    reloadData() {
      this.$emit('requestReloadData');
    }
  }

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

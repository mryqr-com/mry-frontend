<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">
    <PieChart v-if="isComplete"
              :key="chartKey"
              :class="$style.theChart"
              :data="chartData"
              :options="chartOptions"
              :style="chartStyle"
              :title="theTitle">
    </PieChart>

    <div v-else :class="$style.placeholderText">
      <i class="el-icon-warning-outline"> 请完善统计项设置</i>
    </div>
  </div>
</template>

<script>
import uuid from "short-uuid";
import {createNamespacedHelpers} from "vuex";
import {randomColors} from '@/common/utils/common-utils';

const appEditStore = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: ['control', 'tabletView', "controlIndex"],

  data() {
    return {
      internalKey: uuid.generate(),
      randomData: [...Array(10).keys()].map(() => {
        return Math.ceil(Math.random() * 100);
      }).sort(((a, b) => b - a))
    }
  },

  watch: {
    chartData: function () {
      this.internalKey = uuid.generate();
    },

    chartOptions: function () {
      this.internalKey = uuid.generate();
    },
  },

  components: {
    PieChart: () => import(/* webpackChunkName: "chartjs" */ '@/common/components/PieChart'),
  },

  computed: {
    ...appEditStore.mapGetters([
      'controlOf',
      'pageNameOf',
      'controlNameOf',
    ]),

    theTitle() {
      if (this.isComplete) {
        let targetControlName = this.control.targetControlId ? `目标控件：${this.controlNameOf(this.control.targetControlId)}` : '';
        let pageName = `统计项：\n页面：${this.pageNameOf(this.control.pageId)}`;
        let baseControlName = this.control.basedControlId ? `基准控件：${this.controlNameOf(this.control.basedControlId)}` : '';
        return [pageName, targetControlName, baseControlName].filter(name => !!name).join('；');
      }
    },

    chartKey() {
      return this.internalKey + this.controlIndex;
    },

    refBasedControl() {
      if (!this.control.basedControlId) {
        return null;
      }

      return this.controlOf(this.control.basedControlId);
    },

    refBasedControlType() {
      if (!this.refBasedControl) {
        return null;
      }
      return this.refBasedControl.type;
    },

    isComplete() {
      if (this.control.segmentType === 'SUBMIT_COUNT_SUM') {
        return this.control.pageId && this.control.basedControlId;
      }
      return this.control.pageId && this.control.basedControlId && this.control.targetControlId;
    },

    chartStyle() {
      return {
        width: `${this.control.sizeRatio}%`
      }
    },

    labels() {
      let alias = '选项';
      if (!this.refBasedControlType) {
        return alias;
      }

      switch (this.refBasedControlType) {
        case ('POINT_CHECK'): {
          return ['正常', "异常"];
        }

        case ('RADIO'):
        case ('DROPDOWN'):
        case ('ITEM_STATUS'):
        case ('CHECKBOX'): {
          return this.refBasedControl.options.map(option => option.name).slice(0, this.control.max);
        }

        case ('GEOLOCATION'):
        case ('ADDRESS'): {
          if (this.control.addressPrecisionType === 'PROVINCE') {
            alias = '省份';
            break;
          } else if (this.control.addressPrecisionType === 'CITY') {
            alias = '城市';
            break;
          }
          alias = '区县';
          break;
        }
        default: {
        }
      }
      return [...Array(this.control.max).keys()].map(index => {
        return `${alias}${index + 1}`;
      });
    },

    datas() {
      if (!this.refBasedControlType) {
        return [];
      }

      return this.randomData.slice(0, this.labels.length);
    },

    sum() {
      return this.datas.reduce((a, b) => +a + +b, 0);
    },

    colors() {
      if (this.refBasedControlType === 'ITEM_STATUS') {
        return this.refBasedControl.options.map((option, index) => {
          return option.color ? option.color : randomColors()[index];
        });
      }

      if (this.refBasedControlType === 'POINT_CHECK') {
        return ['#10b01b', '#ea0000'];
      }

      return this.control.colors;
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

    chartOptions() {
      let _this = this;
      return {
        animation: {
          duration: 0
        },
        plugins: {
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

  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.theChart {
  position: relative;
  margin-left: auto;
  margin-right: auto;
}

.placeholderText {
  color: $warningYellow;
}

</style>

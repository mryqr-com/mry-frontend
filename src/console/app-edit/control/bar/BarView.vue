<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">
    <BarChart v-if="isComplete"
              :key="chartKey"
              :class="$style.theChart"
              :data="chartData"
              :options="chartOptions"
              :style="chartStyle"
              :title="theTitle">
    </BarChart>

    <div v-else :class="$style.placeholderText">
      <i class="el-icon-warning-outline"> 请完善统计项设置</i>
    </div>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import uuid from 'short-uuid';

const appEditStore = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: ['control', 'tabletView', "controlIndex"],

  components: {
    BarChart: () => import(/* webpackChunkName: "chartjs" */ '@/common/components/BarChart')
  },

  data() {
    return {
      internalKey: uuid.generate(),
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

  computed: {
    ...appEditStore.mapGetters([
      'controlOf',
      'pageNameOf',
      'controlNameOf',
      'controlFieldNameOf',
    ]),

    theTitle() {
      if (this.isComplete) {
        let targetControlName = this.targetControlsName;
        let pageName = `统计项：\n页面：${this.pageNameOf(this.control.pageId)}`;
        let baseControlName = this.control.basedControlId ? `基准控件：${this.controlNameOf(this.control.basedControlId)}` : '';
        return [pageName, targetControlName, baseControlName].filter(name => !!name).join('；');
      }
    },

    targetControlsName() {
      return this.control.targetControlIds.length > 0 ? `目标控件：${this.control.targetControlIds.map(controlId => this.controlNameOf(controlId)).join(',')}` : '';
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
      return this.control.pageId && this.control.basedControlId && this.control.targetControlIds.length > 0;
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

    generateRandomData1() {
      return [...Array(20).keys()].map(() => Math.ceil(Math.random() * 100)).sort(((a, b) => b - a));
    },

    generateRandomData2() {
      return [...Array(20).keys()].map(() => Math.ceil(Math.random() * 100));
    },

    datas() {
      if (!this.refBasedControlType) {
        return [];
      }

      return [this.generateRandomData1.slice(0, this.labels.length), this.generateRandomData2.slice(0, this.labels.length)];
    },

    barCount() {
      if (this.control.segmentType === 'SUBMIT_COUNT_SUM') {
        return 1;
      }

      return this.control.targetControlIds.length;
    },

    chartData() {
      let datasets = [...Array(this.barCount).keys()].map(index => {
        return {
          label: this.control.targetControlIds.length > 0 ? this.controlFieldNameOf(this.control.targetControlIds[index]) : '',
          maxBarThickness: 60,
          data: this.datas[index],
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
        labels: this.labels,
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
        animation: {
          duration: 0
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
            display: this.barCount > 1,//只有多余1套数据时才显示
            position: 'right',
            grid: {
              display: false,
            },
          }
        },
        indexAxis: this.control.horizontal ? 'y' : 'x',
        plugins: {
          legend: {
            display: this.barCount > 1,
            position: 'top',
          },
          datalabels: {
            display: this.control.showNumber,
            color: this.control.horizontal ? 'white' : '#606266',
          }
        }
      }
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
}

.placeholderText {
  color: $warningYellow;
}

.theChart {
  position: relative;
  margin-left: auto;
  margin-right: auto;
}
</style>

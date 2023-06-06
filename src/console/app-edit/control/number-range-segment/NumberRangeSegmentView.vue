<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">
    <LineChart v-if="isComplete"
               :key="chartKey"
               :class="$style.theChart"
               :data="chartData"
               :options="chartOptions"
               :style="chartStyle"
               :title="theTitle">
    </LineChart>

    <div v-else :class="$style.placeholderText">
      <i class="el-icon-warning-outline"> 请完善统计项设置</i>
    </div>
  </div>
</template>

<script>
import uuid from 'short-uuid';
import {createNamespacedHelpers} from "vuex";

const appEditStore = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: ['control', 'tabletView', "controlIndex"],

  components: {
    LineChart: () => import(/* webpackChunkName: "chartjs" */ '@/common/components/LineChart')
  },

  data() {
    return {
      internalKey: uuid.generate(),
      randomData: [...Array(20).keys()].map(() => {
        return Math.ceil(Math.random() * 100);
      }),
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

    numberRanges() {
      if (!this.control.numberRangesString) {
        return [];
      }
      const splits = this.control.numberRangesString.split(/[，,]+/);
      let filter = splits.map(str => str.trim())
          .filter(str => {
            return str !== '' && !isNaN(str);//获取可转换为数字的分段
          });

      return [...new Set(filter)]//通过Set消重
          .sort(function (a, b) {
            return a - b;
          }).slice(0, 20);
    },

    labels() {
      let result = [];
      for (let index = 0; index < this.numberRanges.length - 1; index++) {
        result.push(`[${this.numberRanges[index]}-${this.numberRanges[index + 1]})`);
      }
      return result;
    },

    isComplete() {
      if (this.control.segmentType === 'SUBMIT_COUNT_SUM') {
        return this.control.pageId && this.control.basedControlId && this.numberRanges.length >= 2;
      }
      return this.control.pageId && this.control.basedControlId && this.control.targetControlId && this.numberRanges.length >= 2;
    },

    chartStyle() {
      return {
        width: `${this.control.sizeRatio}%`
      }
    },

    datas() {
      return this.randomData.slice(0, this.labels.length);
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
        animation: {
          duration: 0
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
              padding: {top: 0, left: 0, right: 10, bottom: 10}
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

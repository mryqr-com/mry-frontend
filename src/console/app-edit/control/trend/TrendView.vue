<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">
    <LineChart v-if="validItems.length > 0"
               :key="chartKey"
               :class="$style.theChart"
               :data="chartData"
               :options="chartOptions"
               :style="chartStyle"
               :title="theTitle">
    </LineChart>

    <div v-if="hasNoTrendItems" :class="$style.placeholderText">
      <i class="el-icon-warning-outline">请添加统计项</i>
    </div>

    <div v-else-if="invalidItemNames.length > 0" :class="$style.placeholderText">
      <i class="el-icon-warning-outline">请完成统计项设置：【{{ invalidItemNames.join('，') }}】</i>
    </div>
  </div>
</template>

<script>
import uuid from "short-uuid";
import {formatDateToDate} from '@/common/utils/common-utils';
import {createNamespacedHelpers} from "vuex";

const appEditStore = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: ['control', 'tabletView', "controlIndex"],

  data() {
    return {
      internalKey: uuid.generate(),

      //x轴使用最近5天的日期
      labels: [...Array(5)].map((_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        return formatDateToDate(date);
      }),

      //预先准备2套数据
      dataPool: [[...Array(5).keys()].map(() => {
        return Math.ceil(Math.random() * 100);
      }), [...Array(5).keys()].map(() => {
        return Math.ceil(Math.random() * 10);
      })],
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
    LineChart: () => import(/* webpackChunkName: "chartjs" */ '@/common/components/LineChart')
  },

  computed: {
    ...appEditStore.mapGetters([
      'pageNameOf',
      'controlNameOf'
    ]),

    theTitle() {
      return this.validItems.map((item, index) => {
        let pageName = this.pageNameOf(item.pageId);
        pageName = pageName ? pageName : '无';

        let baseControlName = this.controlNameOf(item.basedControlId);
        baseControlName = baseControlName ? baseControlName : '无';

        let targetControlName = this.controlNameOf(item.targetControlId);
        targetControlName = targetControlName ? targetControlName : '无';

        return `统计项${index + 1}：名称:${item.name}；页面:${pageName}；基准控件:${baseControlName}；目标控件:${targetControlName}`;
      }).join('\n\n');
    },

    chartKey() {
      return this.internalKey + this.controlIndex;
    },

    validItems() {
      return this.control.trendItems.filter(item => this.isComplete(item));
    },

    hasNoTrendItems() {
      return this.control.trendItems.length === 0;
    },

    invalidItemNames() {
      return this.control.trendItems.filter(it => !this.isComplete(it)).map(it => it.name);
    },

    datas() {
      return this.validItems.map((item, index) => {
        return {
          datalabels: {
            align: 'end',
            anchor: 'end'
          },
          data: this.dataPool[index],
          label: item.name,
          yAxisID: 'y' + index,
          tension: this.control.bezier ? 0.3 : 0,
          borderColor: this.control.colors[index]
        };
      });
    },

    chartStyle() {
      return {
        width: `${this.control.sizeRatio}%`
      }
    },

    chartData() {
      return {
        labels: this.labels,
        datasets: this.datas,
      }
    },

    chartOptions() {
      return {
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
            display: this.datas.length > 1,//只有多余1套数据时才显示
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
          }
        }
      }
    },
  },

  methods: {
    isComplete(item) {
      let pageComplete = !!item.pageId;
      let targetComplete = !!item.targetControlId;

      let basedComplete = true;
      if (item.basedType !== 'CREATED_AT') {
        basedComplete = !!item.basedControlId;
      }

      return pageComplete && targetComplete && basedComplete;
    }
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

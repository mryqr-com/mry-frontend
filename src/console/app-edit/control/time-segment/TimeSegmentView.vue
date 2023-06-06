<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">
    <BarChart v-if="validSettings.length > 0"
              :key="chartKey"
              :class="$style.theChart"
              :data="chartData"
              :options="chartOptions"
              :style="chartStyle"
              :title="theTitle">
    </BarChart>

    <div v-if="hasNoSettings" :class="$style.placeholderText">
      <i class="el-icon-warning-outline">请添加统计项</i>
    </div>

    <div v-else-if="invalidSettingNames.length > 0" :class="$style.placeholderText">
      <i class="el-icon-warning-outline">请完成统计项设置：【{{ invalidSettingNames.join('，') }}】</i>
    </div>
  </div>
</template>

<script>
import uuid from 'short-uuid';
import {recentMonths, recentSeasons, recentYears} from "@/common/utils/common-utils";
import {createNamespacedHelpers} from "vuex";

const appEditStore = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: ['control', 'tabletView', "controlIndex"],

  components: {
    BarChart: () => import(/* webpackChunkName: "chartjs" */ '@/common/components/BarChart')
  },

  data() {
    return {
      internalKey: uuid.generate(),
      randomData1: [...Array(20).keys()].map(() => Math.ceil(Math.random() * 100)).sort(((a, b) => b - a)),
      randomData2: [...Array(20).keys()].map(() => Math.ceil(Math.random() * 100)),
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
      'controlNameOf'
    ]),

    theTitle() {
      return this.validSettings.map((item, index) => {
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

    validSettings() {
      return this.control.segmentSettings.filter(it => this.isComplete(it));
    },

    hasNoSettings() {
      return this.control.segmentSettings.length === 0;
    },

    invalidSettingNames() {
      return this.control.segmentSettings.filter(it => !this.isComplete(it)).map(it => it.name);
    },

    chartStyle() {
      return {
        width: `${this.control.sizeRatio}%`
      }
    },

    labels() {
      switch (this.control.interval) {
        case 'PER_MONTH': {
          let months = recentMonths(this.control.max);
          return months.map(month => {
            return `${month.year}-${month.month}月`;
          });
        }

        case 'PER_SEASON': {
          let seasons = recentSeasons(this.control.max);
          return seasons.map(season => {
            return `${season.year}-${season.season}季度`;
          });
        }

        case 'PER_YEAR': {
          let years = recentYears(this.control.max);
          return years.map(year => {
            return `${year}年`;
          });
        }
      }
    },

    datas() {
      return [this.randomData1.slice(0, this.labels.length), this.randomData2.slice(0, this.labels.length)];
    },

    chartData() {
      let datasets = this.validSettings.map((it, index) => {
        return {
          label: it.name,
          maxBarThickness: 80,
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
            display: this.validSettings.length > 1,//只有多余1套数据时才显示
            position: 'right',
            grid: {
              display: false,
            },
          }
        },
        indexAxis: this.control.horizontal ? 'y' : 'x',
        plugins: {
          legend: {
            display: this.validSettings.length > 1,
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

  methods: {
    isComplete(segmentSetting) {
      let pageComplete = !!segmentSetting.pageId;

      let targetComplete = true;
      if (segmentSetting.segmentType !== 'SUBMIT_COUNT_SUM') {
        targetComplete = !!segmentSetting.targetControlId;
      }

      let basedComplete = true;
      if (segmentSetting.basedType !== 'CREATED_AT') {
        basedComplete = !!segmentSetting.basedControlId;
      }

      return pageComplete && targetComplete && basedComplete;
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

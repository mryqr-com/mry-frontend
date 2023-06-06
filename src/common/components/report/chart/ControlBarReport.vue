<template>
  <div :class="$style.wrapper">
    <BarChart :key="chartKey + index"
              :class="$style.theChart"
              :data="chartData"
              :options="chartOptions">
    </BarChart>
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
import {isEqual} from 'lodash-es';
import uuid from 'short-uuid';
import {controlFieldName, isMobileBrowser} from "@/common/utils/common-utils";

export default {
  props: ['report', 'controlsMap', 'reportData', 'index', 'loadFailed'],

  components: {
    BarChart: () => import(/* webpackChunkName: "chartjs" */ '@/common/components/BarChart')
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

    segmentsData() {
      return this.resultReportData.segmentsData;
    },

    setting() {
      return this.report.setting;
    },

    style() {
      return this.report.style;
    },

    cleanedSegmentsData() {
      let refControl = this.controlsMap.get(this.setting.basedControlId);
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
            if (this.setting.addressPrecisionType === 'PROVINCE') {//省份
              return segments.filter(segment => {
                return !segment.option.includes('/');
              });
            }
            if (this.setting.addressPrecisionType === 'DISTRICT') {//区县
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
            if (this.setting.multiLevelSelectionPrecisionType === 'LEVEL1') {
              return segments.filter(segment => {
                return !segment.option.includes('/');
              });
            }

            if (this.setting.multiLevelSelectionPrecisionType === 'LEVEL2') {
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
      let primarySegments = this.cleanedSegmentsData[0].sort((a, b) => b.value - a.value).slice(0, this.style.max);
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

    chartData() {
      let datasets = this.finalSegmentsData.map((segments, index) => {
        return {
          label: this.setting.targetControlIds.length > 0 ? controlFieldName(this.controlsMap.get(this.setting.targetControlIds[index])) : '',
          maxBarThickness: 60,
          data: segments.map(segment => segment.value),
          backgroundColor: this.style.colors[index],
          yAxisID: 'y' + index,
          datalabels: {
            anchor: 'end',
            align: this.style.horizontal ? 'start' : 'end',
            offset: this.style.horizontal ? 5 : 0,
          }
        };
      });

      return {
        labels: this.finalSegmentsData.length > 0 ? this.finalSegmentsData[0].map(segment => segment.option) : [],
        datasets: datasets,
      };
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
              display: !this.style.hideGrid
            },
            title: {
              display: this.style.xTitle,
              color: '#909399',
              text: this.style.xTitle,
              padding: {top: 10, left: 0, right: 0, bottom: 0}
            }
          },

          y0: {
            ticks: {
              stepSize: 1,
            },
            grid: {
              display: !this.style.hideGrid
            },
            title: {
              display: this.style.yTitle,
              color: '#909399',
              text: this.style.yTitle,
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

        aspectRatio: isMobileBrowser() ? 1.2 : 1 / (this.report.aspectRatio / 100),
        indexAxis: this.style.horizontal ? 'y' : 'x',
        plugins: {
          legend: {
            display: this.finalSegmentsData.length > 1,
            position: 'top',
          },
          datalabels: {
            display: this.style.showNumber,
            color: this.style.horizontal ? 'white' : '#606266',
          }
        }
      }
    },
  },

  methods: {
    reloadData() {
      this.$emit('requestReloadData');
    }
  },
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

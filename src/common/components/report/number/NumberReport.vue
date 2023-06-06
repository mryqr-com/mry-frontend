<template>
  <div :class="$style.wrapper" :style="wrapperStyle">
    <div :class="$style.reportNumber" :style="reportNumberStyle">
      <template v-if="loading">
        <div :class="$style.iconContainer">
          <i :class="$style.loadingIcon" class="el-icon-loading"></i>加载中...
        </div>
      </template>
      <template v-else-if="loadFailed">
        <div :class="$style.iconContainer">
          加载失败
          <el-button :class="$style.reloadButton" type="text" @click="fetchReport">重新加载</el-button>
        </div>
      </template>
      <template v-else>
        {{ number }}<span v-if="report.suffix" :class="$style.suffix">({{ report.suffix }})</span>
      </template>
    </div>
    <div :class="$style.reportName" :style="reportNameStyle">{{ report.name }}</div>
  </div>
</template>

<script>
import reportApi from '@/common/api/report-api';

export default {
  props: {
    report: {
      type: Object,
      required: true
    },

    appId: {
      type: String,
      required: true
    },

    groupId: {
      type: String,
    },

    height: {
      type: Number,
      default: 70
    },

    numberFontSize: {
      type: Number,
      default: 30
    },

    nameFontSize: {
      type: Number,
      default: 14
    }
  },

  data() {
    return {
      number: null,
      loading: false,
      loadFailed: false,
    }
  },

  created() {
    this.fetchReport();
  },

  computed: {
    wrapperStyle() {
      return {
        height: this.height + 'px',
      }
    },

    reportNumberStyle() {
      return {
        fontSize: this.numberFontSize + 'px',
      }
    },

    reportNameStyle() {
      return {
        fontSize: this.nameFontSize + 'px',
      }
    }
  },

  watch: {
    report: {
      handler(newValue) {
        this.fetchReport();
      },
      deep: true,
    }
  },

  methods: {
    fetchReport() {
      this.loading = true;
      this.loadFailed = false;

      let query = {
        appId: this.appId,
        groupId: this.groupId,
        report: this.report
      };
      return reportApi.fetchNumberReport(query).then((response) => {
        if (response.data.number === null) {
          this.number = "无数据";
        } else {
          this.number = response.data.number;
        }
        this.loading = false;
        this.loadFailed = false;
      }).catch(_ => {
        this.loading = false;
        this.loadFailed = true;
      });
    },
  }

}
</script>

<style lang="scss" module>
.wrapper {
  background-color: white;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
}

.reportNumber {
  font-weight: 500;
  color: $primaryTextColor;
  min-height: 30px;
}

.iconContainer {
  color: $secondaryTextColor;
  font-weight: normal;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loadingIcon {
  font-weight: normal;
  font-size: 20px;
  margin-right: 5px;
}

.reloadButton {
  margin-left: 5px;
  padding: 0;
}

.reportName {
  margin-top: 5px;
  color: $secondaryTextColor;
}

.suffix {
  font-size: 13px;
  font-weight: normal;
  color: $secondaryTextColor;
}
</style>

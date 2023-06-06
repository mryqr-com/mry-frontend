<template>
  <div :class="$style.wrapper">
    <ReportingList @reportSaved="onReportSaved"></ReportingList>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import ReportingList from '@/console/app-operation/report/ReportingList';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');
const reportingStore = createNamespacedHelpers('REPORTING_STORE');

export default {
  components: {
    ReportingList,
  },

  created() {
    document.title = `统计报表 - ${this.currentAppName}`;
    this.$watch('reportSetting', function () {
          this.markUnsaved();
          window.addEventListener('beforeunload', this.callToSaveHandler);
        },
        {
          deep: true,
        });
  },

  beforeDestroy() {
    this.cancelCallToSave();
  },

  beforeRouteLeave(to, from, next) {
    if (this.isSaved || to.name === 'login') {
      next();
      return;
    }

    this.$confirm('报表设置尚未保存，确认离开？', '提示', {
      confirmButtonText: '是的，离开',
      cancelButtonText: '留在本页',
      type: 'warning'
    }).then(() => {
      next();
    }).catch(() => {
      next(false);
    });
  },

  computed: {
    ...appOperationStore.mapGetters([
      'reportSetting',
    ]),

    ...reportingStore.mapGetters([
      'isSaved',
    ]),

    ...appOperationStore.mapGetters([
      'currentAppName'
    ]),
  },

  methods: {
    ...reportingStore.mapMutations([
      'markUnsaved',
    ]),

    callToSaveHandler(event) {
      event.preventDefault();
      event.returnValue = '';
    },

    cancelCallToSave() {
      window.removeEventListener('beforeunload', this.callToSaveHandler);
    },

    onReportSaved() {
      this.cancelCallToSave();
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>

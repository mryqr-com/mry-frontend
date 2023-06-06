<template>
  <ClientReportList :class="$style.wrapper" upperLinkName="app-home"></ClientReportList>
</template>

<script>
import ClientReportList from '@/client/operations/app/report/ClientReportList';

export default {
  components: {
    ClientReportList,
  },

  created() {
    document.title = '统计报表';
  },
};
</script>

<style lang="scss" module>
.wrapper {
}
</style>

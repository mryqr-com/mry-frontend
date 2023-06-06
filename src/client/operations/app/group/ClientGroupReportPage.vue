<template>
  <ClientReportList :class="$style.wrapper"
                    :groupId="groupId"
                    upperLinkName="client-group-operation-home">
  </ClientReportList>
</template>

<script>
import ClientReportList from '@/client/operations/app/report/ClientReportList';

export default {
  props: {
    groupId: {
      type: String,
      required: true
    },
  },

  components: {
    ClientReportList,
  },


  created() {
    document.title = '统计报表';
  },
}
</script>

<style lang="scss" module>
.wrapper {

}
</style>

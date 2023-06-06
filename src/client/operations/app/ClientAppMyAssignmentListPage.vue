<template>
  <ClientMyAssignmentList groupId="ALL"
                          upperLinkName="app-home">
  </ClientMyAssignmentList>
</template>

<script>
import ClientMyAssignmentList from '@/client/operations/app/assignment/mine/ClientMyAssignmentList';

export default {
  components: {
    ClientMyAssignmentList,
  },

  created() {
    document.title = '我的任务';
  },
};
</script>

<style lang="scss" module>

</style>

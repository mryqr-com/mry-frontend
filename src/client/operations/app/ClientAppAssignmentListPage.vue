<template>
  <ClientAssignmentList groupId="ALL"
                        upperLinkName="app-home">
  </ClientAssignmentList>
</template>

<script>
import ClientAssignmentList from '@/client/operations/app/assignment/list/ClientAssignmentList';

export default {
  components: {
    ClientAssignmentList,
  },

  created() {
    document.title = '任务列表';
  },
};
</script>

<style lang="scss" module>

</style>

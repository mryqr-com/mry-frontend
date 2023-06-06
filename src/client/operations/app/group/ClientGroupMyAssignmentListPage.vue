<template>
  <ClientMyAssignmentList :groupId="groupId"
                          upperLinkName="client-group-operation-home">
  </ClientMyAssignmentList>
</template>

<script>
import ClientMyAssignmentList from '@/client/operations/app/assignment/mine/ClientMyAssignmentList';

export default {
  props: {
    groupId: {
      type: String,
      required: true
    },
  },

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

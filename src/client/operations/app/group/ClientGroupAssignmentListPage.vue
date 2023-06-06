<template>
  <ClientAssignmentList :groupId="groupId"
                        upperLinkName="client-group-operation-home">
  </ClientAssignmentList>
</template>

<script>
import ClientAssignmentList from '@/client/operations/app/assignment/list/ClientAssignmentList';

export default {
  props: {
    groupId: {
      type: String,
      required: true
    },
  },

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

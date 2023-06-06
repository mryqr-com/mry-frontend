<template>
  <ClientAssignmentQrList :assignmentId="assignmentId"
                          upperLinkName="client-group-assignment-list">
  </ClientAssignmentQrList>
</template>

<script>
import ClientAssignmentQrList from '@/client/operations/app/assignment/qrs/ClientAssignmentQrList';

export default {
  props: {
    assignmentId: {
      type: String,
      required: true,
    }
  },

  components: {
    ClientAssignmentQrList,
  },

};
</script>

<style lang="scss" module>

</style>

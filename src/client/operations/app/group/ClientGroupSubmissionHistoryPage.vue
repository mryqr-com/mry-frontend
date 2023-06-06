<template>
  <ClientSubmissionList :groupId="groupId"
                        :initPageId="pageId"
                        :selectablePages="allableManagablePages"
                        type="ALL_SUBMIT_HISTORY"
                        upperLinkName="client-group-operation-home">
  </ClientSubmissionList>
</template>

<script>
import ClientSubmissionList from '@/client/operations/app/submissions/ClientSubmissionList';
import {createNamespacedHelpers} from "vuex";

const clientAppOperationStore = createNamespacedHelpers('CLIENT_APP_OPERATION_STORE');

export default {
  props: {
    groupId: {
      type: String,
      required: true
    },

    pageId: {
      type: String,
      required: true
    },
  },

  components: {
    ClientSubmissionList,
  },

  created() {
    document.title = this.operationMenuNameOf('ALL_SUBMIT_HISTORY', this.pageId);
  },

  computed: {
    ...clientAppOperationStore.mapGetters([
      'allableManagablePages',
      'operationMenuNameOf',
    ]),
  }
};
</script>

<style lang="scss" module>

</style>

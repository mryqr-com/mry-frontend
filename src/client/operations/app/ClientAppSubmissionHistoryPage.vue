<template>
  <ClientSubmissionList :initPageId="pageId"
                        :selectableGroups="allableManagableGroups"
                        :selectablePages="allableManagablePages"
                        groupId="ALL"
                        type="ALL_SUBMIT_HISTORY"
                        upperLinkName="app-home">
  </ClientSubmissionList>
</template>

<script>
import ClientSubmissionList from '@/client/operations/app/submissions/ClientSubmissionList';
import {createNamespacedHelpers} from "vuex";

const clientAppOperationStore = createNamespacedHelpers('CLIENT_APP_OPERATION_STORE');

export default {
  props: ['pageId'],

  components: {
    ClientSubmissionList,
  },

  created() {
    document.title = this.operationMenuNameOf('ALL_SUBMIT_HISTORY', this.pageId);
  },

  computed: {
    ...clientAppOperationStore.mapGetters([
      'allableManagableGroups',
      'allableManagablePages',
      'operationMenuNameOf',
    ]),
  }
};
</script>

<style lang="scss" module>

</style>

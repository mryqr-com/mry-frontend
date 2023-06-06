<template>
  <ClientSubmissionList :initPageId="pageId"
                        :selectableGroups="allableViewableGroups"
                        :selectablePages="allableViewablePages"
                        groupId="ALL"
                        type="SUBMITTER_SUBMISSION"
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
    document.title = this.operationMenuNameOf('SUBMITTER_SUBMISSION', this.pageId);
  },

  computed: {
    ...clientAppOperationStore.mapGetters([
      'allableViewablePages',
      'allableViewableGroups',
      'operationMenuNameOf',
    ]),
  }
};
</script>

<style lang="scss" module>

</style>

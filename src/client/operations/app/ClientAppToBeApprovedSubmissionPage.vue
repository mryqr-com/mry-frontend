<template>
  <ClientSubmissionList :initPageId="pageId"
                        :selectableGroups="allableApprovableGroups"
                        :selectablePages="allableApprovablePages"
                        groupId="ALL"
                        type="TO_BE_APPROVED"
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
    document.title = this.operationMenuNameOf('TO_BE_APPROVED', this.pageId);
  },

  computed: {
    ...clientAppOperationStore.mapGetters([
      'allableApprovablePages',
      'allableApprovableGroups',
      'operationMenuNameOf',
    ]),
  }
};
</script>

<style lang="scss" module>

</style>

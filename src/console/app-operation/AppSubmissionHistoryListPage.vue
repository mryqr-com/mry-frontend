<template>
  <SubmissionList :pageId="pageId"
                  :selectableGroups="allableManagableGroups"
                  :selectablePages="allableManagablePages"
                  groupId="ALL"
                  type="ALL_SUBMIT_HISTORY">
  </SubmissionList>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import SubmissionList from '@/console/app-operation/submissions/SubmissionList';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: ['pageId'],

  components: {
    SubmissionList
  },

  created() {
    document.title = `${this.submissionTitle} - ${this.currentAppName}`;
  },

  computed: {
    ...appOperationStore.mapGetters([
      'allableManagableGroups',
      'allableManagablePages',
      'operationMenuNameOf',
      'currentAppName'
    ]),

    submissionTitle() {
      return this.operationMenuNameOf('ALL_SUBMIT_HISTORY', this.pageId);
    },

  },
}
</script>


<style lang="scss" module>

</style>

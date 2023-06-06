<template>
  <SubmissionList :pageId="pageId"
                  :selectableGroups="allableViewableGroups"
                  :selectablePages="allableViewablePages"
                  groupId="ALL"
                  type="SUBMITTER_SUBMISSION">
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
      'allableViewableGroups',
      'allableViewablePages',
      'operationMenuNameOf',
      'currentAppName'
    ]),

    submissionTitle() {
      return this.operationMenuNameOf('SUBMITTER_SUBMISSION', this.pageId);
    },
  },
}
</script>


<style lang="scss" module>

</style>

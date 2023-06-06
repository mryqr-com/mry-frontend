<template>
  <SubmissionList :pageId="pageId"
                  :selectableGroups="allableApprovableGroups"
                  :selectablePages="allableApprovablePages"
                  groupId="ALL"
                  type="TO_BE_APPROVED">
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
      'allableApprovableGroups',
      'allableApprovablePages',
      'operationMenuNameOf',
      'currentAppName'
    ]),


    submissionTitle() {
      return this.operationMenuNameOf('TO_BE_APPROVED', this.pageId);
    },
  },
}
</script>

<style lang="scss" module>

</style>

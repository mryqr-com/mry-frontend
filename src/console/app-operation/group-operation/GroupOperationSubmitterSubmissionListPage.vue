<template>
  <SubmissionList :groupId="groupId"
                  :pageId="pageId"
                  :selectablePages="allableViewablePages"
                  type="SUBMITTER_SUBMISSION">
  </SubmissionList>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import SubmissionList from '@/console/app-operation/submissions/SubmissionList';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

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
    SubmissionList
  },

  created() {
    document.title = `${this.submissionTitle} - ${this.groupNameOf(this.groupId)}`;
  },

  computed: {
    ...appOperationStore.mapGetters([
      'allableViewablePages',
      'groupNameOf',
      'operationMenuNameOf'
    ]),

    submissionTitle() {
      return this.operationMenuNameOf('SUBMITTER_SUBMISSION', this.pageId);
    },

  },
}
</script>


<style lang="scss" module>

</style>

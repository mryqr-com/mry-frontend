<template>
  <SubmissionList :groupId="groupId"
                  :pageId="pageId"
                  :selectablePages="allableManagablePages"
                  type="ALL_SUBMIT_HISTORY">
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
      'allableManagablePages',
      'groupNameOf',
      'operationMenuNameOf'
    ]),

    submissionTitle() {
      return this.operationMenuNameOf('ALL_SUBMIT_HISTORY', this.pageId);
    },
  },
}
</script>


<style lang="scss" module>

</style>

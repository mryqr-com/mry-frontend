<template>
  <SubmissionList :groupId="groupId"
                  :pageId="pageId"
                  :selectablePages="allableApprovablePages"
                  type="TO_BE_APPROVED">
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
      'allableApprovablePages',
      'groupNameOf',
      'operationMenuNameOf'
    ]),

    submissionTitle() {
      return this.operationMenuNameOf('TO_BE_APPROVED', this.pageId);
    },
  },
}
</script>

<style lang="scss" module>

</style>

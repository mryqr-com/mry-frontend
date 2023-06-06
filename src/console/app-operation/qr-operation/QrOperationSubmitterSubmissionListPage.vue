<template>
  <SubmissionList :pageId="pageId"
                  :qrId="qrId"
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
    qrId: {
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
    document.title = `${this.currentQrName} : ${this.submissionTitle}`;
  },

  computed: {
    ...appOperationStore.mapGetters([
      'allableViewablePages',
      'operationMenuNameOf',
    ]),

    ...appOperationStore.mapState(['currentQrName']),

    submissionTitle() {
      return this.operationMenuNameOf('SUBMITTER_SUBMISSION', this.pageId);
    },
  },
}
</script>


<style lang="scss" module>

</style>

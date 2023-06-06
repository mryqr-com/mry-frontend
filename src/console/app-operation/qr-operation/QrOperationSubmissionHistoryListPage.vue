<template>
  <SubmissionList :pageId="pageId"
                  :qrId="qrId"
                  :selectablePages="allableManagablePages"
                  type="ALL_SUBMIT_HISTORY">
  </SubmissionList>
</template>

<script>
import SubmissionList from '@/console/app-operation/submissions/SubmissionList';
import {createNamespacedHelpers} from "vuex";

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
      'allableManagablePages',
      'operationMenuNameOf',
    ]),

    ...appOperationStore.mapState(['currentQrName']),

    submissionTitle() {
      return this.operationMenuNameOf('ALL_SUBMIT_HISTORY', this.pageId);
    },
  },
}
</script>


<style lang="scss" module>

</style>

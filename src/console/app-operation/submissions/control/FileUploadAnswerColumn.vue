<template>
  <el-table-column
      :column-key="control.id"
      :label="labelName"
      :show-overflow-tooltip="true"
      min-width="150">
    <template slot-scope="scope">
      <FileDownloadPopover :files="answers(scope.row.id)" :title="popoverTitle(scope.row.qrName)"></FileDownloadPopover>
    </template>
  </el-table-column>
</template>

<script>
import FileDownloadPopover from '@/console/common/components/FileDownloadPopover';
import {createNamespacedHelpers} from "vuex";
import {controlFieldName} from "@/common/utils/common-utils";

const submissionListStore = createNamespacedHelpers('SUBMISSION_LIST_STORE');

export default {
  props: ['control'],

  components: {
    FileDownloadPopover
  },

  computed: {
    ...submissionListStore.mapGetters([
      'answerOf'
    ]),

    labelName() {
      return controlFieldName(this.control);
    }
  },

  methods: {
    answers(submissionId) {
      let answer = this.answerOf(submissionId, this.control.id);
      if (!answer) {
        return [];
      }
      return answer.files;
    },

    popoverTitle(qrName) {
      return `${this.labelName} -  ${qrName}`;
    }
  }
}
</script>

<style lang="scss" module>

</style>

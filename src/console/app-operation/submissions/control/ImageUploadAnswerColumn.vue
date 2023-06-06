<template>
  <el-table-column
      :column-key="control.id"
      :label="labelName"
      :show-overflow-tooltip="false"
      min-width="150">
    <template slot-scope="scope">
      <ImageListThumbnailViewer :images="answers(scope.row.id)"></ImageListThumbnailViewer>
    </template>
  </el-table-column>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import {controlFieldName} from "@/common/utils/common-utils";

const submissionListStore = createNamespacedHelpers('SUBMISSION_LIST_STORE');

export default {
  props: ['control'],

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
  }
}
</script>

<style lang="scss" module>

</style>

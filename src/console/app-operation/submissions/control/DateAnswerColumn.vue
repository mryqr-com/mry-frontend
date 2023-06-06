<template>
  <el-table-column
      :column-key="control.id"
      :label="labelName"
      :show-overflow-tooltip="true"
      min-width="150"
      sortable="custom">
    <template slot-scope="scope">
      {{ answers(scope.row.id) }}
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
        return null;
      }
      return answer.text;
    },
  }
}
</script>

<style lang="scss" module>

</style>

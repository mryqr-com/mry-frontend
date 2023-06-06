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
      let rawName = controlFieldName(this.control);
      return this.control.suffix ? `${rawName}(${this.control.suffix})` : rawName;
    }
  },

  methods: {
    answers(submissionId) {
      let answer = this.answerOf(submissionId, this.control.id);
      if (!answer) {
        return null;
      }

      return (Math.round(answer.number * 100) / 100).toFixed(this.control.precision);
    },
  }
}
</script>

<style lang="scss" module>

</style>

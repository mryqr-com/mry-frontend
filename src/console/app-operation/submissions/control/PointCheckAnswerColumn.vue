<template>
  <el-table-column
      :column-key="control.id"
      :filters="filters"
      :label="labelName"
      :show-overflow-tooltip="true"
      :sortable="false"
      min-width="150">
    <template slot-scope="scope">
      <span v-html="answers(scope.row.id)"></span>
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

    filters() {
      return [{text: '正常', value: 'YES'}, {text: '异常', value: 'NO'}];
    },

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

      return answer.pass ? '<span style="color: #10b01b" >正常</span>' : '<span style="color: #ea0000" >异常</span>';
    },

  }
}
</script>

<style lang="scss" module>

</style>

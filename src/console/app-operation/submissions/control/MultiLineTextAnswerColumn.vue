<template>
  <el-table-column
      :column-key="control.id"
      :label="labelName"
      :show-overflow-tooltip="true"
      min-width="150">
    <template slot-scope="scope">
      <el-button v-if="answers(scope.row.id)" size="mini"
                 @click="viewContent(scope.row.id, scope.row.qrName)">
        查看
      </el-button>
    </template>
  </el-table-column>
</template>

<script>

import {createNamespacedHelpers} from "vuex";
import eventBus from "@/common/utils/event-bus";
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
    viewContent(submissionId, qrName) {
      let content = this.answers(submissionId);
      eventBus.$emit('view-markdown', {title: `${this.labelName} - ${qrName}`, content: content});
    },

    answers(submissionId) {
      let answer = this.answerOf(submissionId, this.control.id);
      if (!answer) {
        return null;
      }
      return answer.text;
    }
  }
}
</script>

<style lang="scss" module>

</style>

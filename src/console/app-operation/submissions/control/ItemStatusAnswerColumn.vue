<template>
  <el-table-column
      :column-key="control.id"
      :filters="filters"
      :label="labelName"
      :show-overflow-tooltip="true"
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

    optionMap() {
      return new Map(this.control.options.map(it => [it.id, it]));
    },

    filters() {
      return this.control.options.map(option => {
        return {text: option.name, value: option.id};
      })
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
      let option = this.optionMap.get(answer.optionId);
      if (!option) {
        return null;
      }

      let name = option.name;
      let color = option.color;
      return `<span style="color: ${color}" >${name}</span>`;
    },

  }
}
</script>

<style lang="scss" module>

</style>

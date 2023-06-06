<template>
  <el-table-column
      :column-key="control.id"
      :filters="filters"
      :label="labelName"
      :show-overflow-tooltip="true"
      min-width="150">
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

    optionNameMap() {
      return new Map(this.control.options.map(it => [it.id, it.name]));
    },

    filters() {
      return this.control.options.map(option => {
        return {text: option.name, value: option.id};
      })
    },

    labelName() {
      return controlFieldName(this.control);
    },
  },

  methods: {
    answers(submissionId) {
      let answer = this.answerOf(submissionId, this.control.id);
      if (!answer) {
        return null;
      }
      return answer.items.map(item => {
        let name = this.optionNameMap.get(item.optionId);
        return name ? `${name} x${item.number}` : null;
      }).filter(result => !!result).join(", ");
    }
  }
}
</script>

<style lang="scss" module>

</style>

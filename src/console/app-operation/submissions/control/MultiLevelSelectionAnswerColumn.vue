<template>
  <el-table-column
      :column-key="control.id"
      :filters="filters"
      :label="labelName"
      :show-overflow-tooltip="true"
      :sortable="false"
      min-width="150">
    <template slot-scope="scope">
      {{ answers(scope.row.id) }}
    </template>
  </el-table-column>
</template>

<script>
import {controlFieldName} from "@/common/utils/common-utils";

import {createNamespacedHelpers} from "vuex";

const submissionListStore = createNamespacedHelpers('SUBMISSION_LIST_STORE');

export default {
  props: ['control'],

  computed: {
    ...submissionListStore.mapGetters([
      'answerOf'
    ]),

    labelName() {
      return controlFieldName(this.control);
    },

    filters() {
      let options = [];
      this.control.option.options.forEach(level1 => {
        options.push({text: level1.name, value: level1.name});
      });

      this.control.option.options.forEach(level1 => {
        level1.options.forEach(level2 => {
          options.push({text: `${level1.name}/${level2.name}`, value: `${level1.name}/${level2.name}`});
        });
      });

      this.control.option.options.forEach(level1 => {
        level1.options.forEach(level2 => {
          level2.options.forEach(level3 => {
            options.push({
              text: `${level1.name}/${level2.name}/${level3.name}`,
              value: `${level1.name}/${level2.name}/${level3.name}`
            });
          });
        });
      });
      return options;
    }
  },

  methods: {
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

<template>
  <el-table-column
      :class-name="control.id"
      :column-key="control.id"
      :filters="memberFilters"
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

import {createNamespacedHelpers} from "vuex";
import memberApi from "@/common/api/member-api";
import {controlFieldName} from "@/common/utils/common-utils";

const submissionListStore = createNamespacedHelpers('SUBMISSION_LIST_STORE');

export default {
  props: ['control'],

  data() {
    return {
      memberFilters: [],
    }
  },

  created() {
    this.$nextTick(() => {
      let header = document.querySelector("." + this.control.id);
      let filterIcon = document.querySelector("." + this.control.id + " .el-table__column-filter-trigger");
      header.addEventListener('click', this.loadMemberFilters);
      filterIcon.addEventListener('click', this.loadMemberFilters);
    });
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
        return null;
      }
      return answer.text;
    },

    loadMemberFilters() {
      if (this.memberFilters.length > 0) {
        return;
      }

      return memberApi.memberColumnFilters().then((value) => {
        this.memberFilters = value;
      });
    },
  }
}
</script>

<style lang="scss" module>

</style>

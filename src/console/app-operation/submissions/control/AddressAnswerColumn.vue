<template>
  <el-table-column
      :class-name="control.id"
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
import {addressFilters, controlFieldName} from "@/common/utils/common-utils";

import {createNamespacedHelpers} from "vuex";

const submissionListStore = createNamespacedHelpers('SUBMISSION_LIST_STORE');

export default {
  props: ['control'],

  data() {
    return {
      filters: [],
    }
  },

  created() {
    this.$nextTick(() => {
      let header = document.querySelector("." + this.control.id);
      let filterIcon = document.querySelector("." + this.control.id + " .el-table__column-filter-trigger");
      header.addEventListener('click', this.loadAllAddressFilters);
      filterIcon.addEventListener('click', this.loadAllAddressFilters);
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
      switch (this.control.precision) {
        case 1: {
          return answer.address.province;
        }

        case 2: {
          return (answer.address.province || "") +
              (answer.address.city || "")
        }

        case 3: {
          return (answer.address.province || "") +
              (answer.address.city || "") +
              (answer.address.district || "")
        }

        case 4: {
          return (answer.address.province || "") +
              (answer.address.city || "") +
              (answer.address.district || "") +
              (answer.address.address || "");
        }
      }
    },

    loadAllAddressFilters() {
      if (this.filters.length > 0) {
        return;
      }

      return addressFilters().then(filers => {
        this.filters = filers
      });
    },
  }
}
</script>

<style lang="scss" module>

</style>

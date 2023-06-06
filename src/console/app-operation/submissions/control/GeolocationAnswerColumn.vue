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
      <span class="underLinedLink" @click="viewGeolocation(scope.row.id, scope.row.qrName)">
        {{ addressText(scope.row.id) }}
      </span>
    </template>
  </el-table-column>
</template>

<script>
import {addressFilters, controlFieldName, displayAddress} from '@/common/utils/common-utils';
import {viewGeoLocation} from '@/common/utils/geolocation-utils'

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
    answer(submissionId) {
      return this.answerOf(submissionId, this.control.id);
    },

    addressText(submissionId) {
      let answer = this.answer(submissionId);
      if (!answer) {
        return null;
      }

      let rawAddress = displayAddress(answer.geolocation.address);
      if (answer.geolocation.note) {
        return `${rawAddress}（${answer.geolocation.note}）`
      }
      return rawAddress;
    },

    rawAddressText(submissionId) {
      let answer = this.answer(submissionId);
      if (!answer) {
        return null;
      }

      return displayAddress(answer.geolocation.address);
    },

    viewGeolocation(submissionId, qrName) {
      let answer = this.answer(submissionId);
      if (!answer) {
        return null;
      }

      viewGeoLocation({
        name: this.rawAddressText(submissionId),
        geolocation: answer.geolocation,
      });
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

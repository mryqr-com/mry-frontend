<template>
  <el-table-column
      :column-key="attribute.id"
      :label="attribute.name"
      :show-overflow-tooltip="true"
      min-width="150"
      sortable="custom">
    <template slot-scope="scope">
      {{ getAttributeValue(scope.row.id) }}
    </template>
  </el-table-column>
</template>

<script>

import {createNamespacedHelpers} from "vuex";
import {formatEpochToMinute} from '@/common/utils/common-utils';

const qrListStore = createNamespacedHelpers('QR_LIST_STORE');

export default {
  props: ['attribute'],

  computed: {
    ...qrListStore.mapGetters([
      'attributeValueOf'
    ]),
  },

  methods: {
    getAttributeValue(qrId) {
      let value = this.attributeValueOf(qrId, this.attribute.id);
      if (!value) {
        return null;
      }
      return formatEpochToMinute(value.timestamp);
    }
  }
}
</script>

<style lang="scss" module>

</style>

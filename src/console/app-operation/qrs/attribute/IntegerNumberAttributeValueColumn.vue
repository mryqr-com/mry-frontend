<template>
  <el-table-column
      :column-key="attribute.id"
      :label="labelName"
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

const qrListStore = createNamespacedHelpers('QR_LIST_STORE');

export default {
  props: ['attribute'],

  computed: {
    ...qrListStore.mapGetters([
      'attributeValueOf'
    ]),

    labelName() {
      return this.attribute.suffix ? `${this.attribute.name}(${this.attribute.suffix})` : this.attribute.name;
    }
  },

  methods: {
    getAttributeValue(qrId) {
      let value = this.attributeValueOf(qrId, this.attribute.id);
      if (!value) {
        return null;
      }

      return value.number;
    }
  }
}
</script>

<style lang="scss" module>

</style>

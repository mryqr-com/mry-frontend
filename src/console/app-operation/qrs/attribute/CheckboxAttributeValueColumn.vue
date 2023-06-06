<template>
  <el-table-column
      :column-key="attribute.id"
      :filters="filters"
      :label="attribute.name"
      :show-overflow-tooltip="true"
      min-width="150">
    <template slot-scope="scope">
      {{ getAttributeValue(scope.row.id) }}
    </template>
  </el-table-column>
</template>

<script>

import {createNamespacedHelpers} from "vuex";

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

const qrListStore = createNamespacedHelpers('QR_LIST_STORE');

export default {
  props: ['attribute'],

  computed: {
    ...appOperationStore.mapGetters([
      'controlOf',
    ]),
    ...qrListStore.mapGetters([
      'attributeValueOf'
    ]),

    optionNameMap() {
      return new Map(this.controlOf(this.attribute.controlId).options.map(it => [it.id, it.name]));
    },

    filters() {
      return this.controlOf(this.attribute.controlId).options.map(option => {
        return {text: option.name, value: option.id};
      })
    },
  },

  methods: {
    getAttributeValue(qrId) {
      let value = this.attributeValueOf(qrId, this.attribute.id);
      if (!value) {
        return null;
      }
      return value.optionIds.map(id => this.optionNameMap.get(id)).filter(name => !!name).join(", ");
    }
  }
}
</script>

<style lang="scss" module>

</style>

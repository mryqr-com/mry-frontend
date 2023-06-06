<template>
  <el-table-column
      :column-key="attribute.id"
      :filters="filters"
      :label="attribute.name"
      :show-overflow-tooltip="true"
      min-width="150">
    <template slot-scope="scope">
      <span v-html="getAttributeValue(scope.row.id)"></span>
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

    optionMap() {
      return new Map(this.controlOf(this.attribute.controlId).options.map(it => [it.id, it]));
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

      let option = this.optionMap.get(value.optionId);
      if (!option) {
        return null;
      }

      let name = option.name;
      let color = option.color;
      return `<span style="color: ${color}" >${name}</span>`;
    }
  }
}
</script>

<style lang="scss" module>

</style>

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

const qrListStore = createNamespacedHelpers('QR_LIST_STORE');
const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: ['attribute'],

  computed: {
    ...qrListStore.mapGetters([
      'attributeValueOf'
    ]),

    ...appOperationStore.mapGetters([
      'allCirculationStatuses'
    ]),

    optionMap() {
      return new Map(this.allCirculationStatuses.map(it => [it.id, it]));
    },

    filters() {
      return this.allCirculationStatuses.map(it => {
        return {text: it.name, value: it.id,};
      });
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
    },

  }
}
</script>

<style lang="scss" module>

</style>

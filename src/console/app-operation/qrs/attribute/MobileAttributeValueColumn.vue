<template>
  <el-table-column
      :column-key="attribute.id"
      :label="attribute.name"
      :show-overflow-tooltip="true"
      min-width="150">
    <template slot-scope="scope">
      <MobileLinkViewer :mobile="getAttributeValue(scope.row.id)"></MobileLinkViewer>
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
  },

  methods: {
    getAttributeValue(qrId) {
      let value = this.attributeValueOf(qrId, this.attribute.id);

      if (!value) {
        return null;
      }
      return value.text;
    },
  }
}
</script>

<style lang="scss" module>

</style>

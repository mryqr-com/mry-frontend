<template>
  <el-table-column
      :column-key="attribute.id"
      :label="attribute.name"
      :show-overflow-tooltip="true"
      min-width="150">
    <template slot-scope="scope">
      <ImageListThumbnailViewer :images="getAttributeValue(scope.row.id)"></ImageListThumbnailViewer>
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
        return [];
      }
      return value.files;
    },
  }
}
</script>

<style lang="scss" module>

</style>

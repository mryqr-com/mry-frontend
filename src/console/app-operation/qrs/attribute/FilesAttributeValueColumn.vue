<template>
  <el-table-column
      :column-key="attribute.id"
      :label="attribute.name"
      :show-overflow-tooltip="true"
      min-width="150">
    <template slot-scope="scope">
      <FileDownloadPopover :files="getAttributeValue(scope.row.id)"
                           :title="popoverTitle(scope.row.name)">
      </FileDownloadPopover>
    </template>
  </el-table-column>
</template>

<script>
import FileDownloadPopover from '@/console/common/components/FileDownloadPopover';

import {createNamespacedHelpers} from "vuex";

const qrListStore = createNamespacedHelpers('QR_LIST_STORE');

export default {
  props: ['attribute'],

  components: {
    FileDownloadPopover
  },
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

    popoverTitle(qrName) {
      return `${this.attribute.name} -  ${qrName}`;
    }
  }
}
</script>

<style lang="scss" module>

</style>

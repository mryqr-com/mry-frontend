<template>
  <el-table-column
      :column-key="attribute.id"
      :label="attribute.name"
      :show-overflow-tooltip="true"
      min-width="150">
    <template slot-scope="scope">
      <el-button v-if="getAttributeValue(scope.row.id)"
                 size="mini"
                 @click="viewContent(scope.row.id, scope.row.name)">
        查看
      </el-button>
    </template>
  </el-table-column>
</template>

<script>

import {createNamespacedHelpers} from "vuex";
import eventBus from "@/common/utils/event-bus";

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

    viewContent(qrId, qrName) {
      let content = this.getAttributeValue(qrId);
      eventBus.$emit('view-rich-text', {title: `${this.attribute.name} - ${qrName}`, content: content});
    },
  }
}
</script>

<style lang="scss" module>

</style>

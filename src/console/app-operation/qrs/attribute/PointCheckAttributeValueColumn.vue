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

export default {
  props: ['attribute'],

  computed: {
    ...qrListStore.mapGetters([
      'attributeValueOf'
    ]),

    filters() {
      return [{text: '正常', value: 'YES'}, {text: '异常', value: 'NO'}];
    },

  },

  methods: {
    getAttributeValue(qrId) {
      let value = this.attributeValueOf(qrId, this.attribute.id);
      if (!value) {
        return null;
      }

      return value.pass ? '<span style="color: #10b01b" >正常</span>' : '<span style="color: #ea0000" >异常</span>';
    },

  }
}
</script>

<style lang="scss" module>

</style>

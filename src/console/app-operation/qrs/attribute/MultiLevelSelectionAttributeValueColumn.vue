<template>
  <el-table-column
      :column-key="attribute.id"
      :filters="filters"
      :label="attribute.name"
      :show-overflow-tooltip="true"
      :sortable="false"
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

    control() {
      return this.controlOf(this.attribute.controlId);
    },

    filters() {
      let options = [];
      this.control.option.options.forEach(level1 => {
        options.push({text: level1.name, value: level1.name});
      });

      this.control.option.options.forEach(level1 => {
        level1.options.forEach(level2 => {
          options.push({text: `${level1.name}/${level2.name}`, value: `${level1.name}/${level2.name}`});
        });
      });

      this.control.option.options.forEach(level1 => {
        level1.options.forEach(level2 => {
          level2.options.forEach(level3 => {
            options.push({
              text: `${level1.name}/${level2.name}/${level3.name}`,
              value: `${level1.name}/${level2.name}/${level3.name}`
            });
          });
        });
      });
      return options;
    }
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

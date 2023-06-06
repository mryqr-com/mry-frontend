<template>
  <el-table-column
      :class-name="attribute.id"
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
import {addressFilters, displayAddress} from "@/common/utils/common-utils";

const qrListStore = createNamespacedHelpers('QR_LIST_STORE');

export default {
  props: ['attribute'],

  data() {
    return {
      filters: [],
    }
  },

  created() {
    this.$nextTick(() => {
      let header = document.querySelector("." + this.attribute.id);
      let filterIcon = document.querySelector("." + this.attribute.id + " .el-table__column-filter-trigger");
      header.addEventListener('click', this.loadAllAddressFilters);
      filterIcon.addEventListener('click', this.loadAllAddressFilters);
    });
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
        return null;
      }
      return displayAddress(value.address);
    },

    loadAllAddressFilters() {
      if (this.filters.length > 0) {
        return;
      }

      return addressFilters().then(filers => {
        this.filters = filers
      });
    },
  }
}
</script>

<style lang="scss" module>

</style>

<template>
  <el-table-column
      :class-name="attribute.id"
      :column-key="attribute.id"
      :filters="filters"
      :label="attribute.name"
      :show-overflow-tooltip="true"
      min-width="150">
    <template slot-scope="scope">
       <span class="underLinedLink" @click="openGeolocation(scope.row.id, scope.row.name)">
        {{ addressText(scope.row.id) }}
      </span>
    </template>
  </el-table-column>
</template>

<script>

import {createNamespacedHelpers} from "vuex";
import {addressFilters, displayAddress} from "@/common/utils/common-utils";
import {viewGeoLocation} from '@/common/utils/geolocation-utils'

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
      return this.attributeValueOf(qrId, this.attribute.id);
    },

    addressText(qrId) {
      let value = this.getAttributeValue(qrId);
      if (!value) {
        return null;
      }

      let rawAddress = displayAddress(value.geolocation.address);
      if (value.geolocation.note) {
        return `${rawAddress}（${value.geolocation.note}）`;
      }
      return rawAddress;
    },

    rawAddressText(qrId) {
      let value = this.getAttributeValue(qrId);
      if (!value) {
        return null;
      }

      return displayAddress(value.geolocation.address);
    },

    openGeolocation(qrId, qrName) {
      let value = this.getAttributeValue(qrId);
      if (!value) {
        return null;
      }

      viewGeoLocation({
        name: this.rawAddressText(qrId),
        geolocation: value.geolocation,
      });
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

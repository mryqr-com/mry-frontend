<template>
  <el-table-column
      :class-name="attribute.id"
      :column-key="attribute.id"
      :filters="memberFilters"
      :label="attribute.name"
      :show-overflow-tooltip="true"
      :sortable="false"
      min-width="150">
    <template slot-scope="scope">
      <MemberWithEmailLinkViewer :member="memberOf(scope.row.id)"></MemberWithEmailLinkViewer>
    </template>
  </el-table-column>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import memberApi from "@/common/api/member-api";

const qrListStore = createNamespacedHelpers('QR_LIST_STORE');

export default {
  props: ['attribute'],

  data() {
    return {
      memberFilters: [],
    }
  },

  created() {
    this.$nextTick(() => {
      let header = document.querySelector("." + this.attribute.id);
      let filterIcon = document.querySelector("." + this.attribute.id + " .el-table__column-filter-trigger");
      header.addEventListener('click', this.loadMemberFilters);
      filterIcon.addEventListener('click', this.loadMemberFilters);
    });
  },

  computed: {
    ...qrListStore.mapGetters([
      'attributeValueOf'
    ]),

  },

  methods: {
    memberOf(qrId) {
      let value = this.attributeValueOf(qrId, this.attribute.id);
      if (!value) {
        return null;
      }

      return value.member;
    },

    loadMemberFilters() {
      if (this.memberFilters.length > 0) {
        return;
      }

      return memberApi.memberColumnFilters().then((value) => {
        this.memberFilters = value;
      });
    }
  }
}
</script>

<style lang="scss" module>

</style>

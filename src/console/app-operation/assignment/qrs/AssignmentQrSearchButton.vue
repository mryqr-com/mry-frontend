<template>
  <el-input v-model="theSearch"
            :class="$style.searchInput"
            :maxlength="50"
            :spellcheck="false"
            clearable
            placeholder="搜索..."
            size="medium"
            @clear="doSearch"
            @keyup.enter.native="doSearch">
    <el-button slot="append"
               :class="$style.searchButton"
               icon="el-icon-search"
               type="primary"
               @click="doSearch">
    </el-button>
  </el-input>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import ASSIGNMENT_QR_LIST_ACTIONS from "@/console/app-operation/assignment/qrs/store/assignment-qr-list-actions";

const assignmentQrListStore = createNamespacedHelpers('ASSIGNMENT_QR_LIST_STORE');

export default {
  methods: {
    ...assignmentQrListStore.mapActions([
      ASSIGNMENT_QR_LIST_ACTIONS.LIST_ASSIGNMENT_QRS
    ]),

    ...assignmentQrListStore.mapMutations([
      'updateSearch',
      'resetPageIndex',
      'goToTableTop',
    ]),

    doSearch() {
      this.resetPageIndex();
      return this[ASSIGNMENT_QR_LIST_ACTIONS.LIST_ASSIGNMENT_QRS]().then(() => {
        this.goToTableTop();
      });
    },
  },

  computed: {
    ...assignmentQrListStore.mapState(['search']),

    theSearch: {
      get() {
        return this.search;
      },

      set(value) {
        this.updateSearch(value);
      }
    }
  }
}
</script>

<style lang="scss" module>
.searchInput {
  width: 250px;
}

.searchButton {
  color: $regularTextColor !important;
}
</style>

<template>
  <el-input v-model="theSearchTerm"
            :class="$style.searchInput"
            :maxlength="50"
            :spellcheck="false"
            clearable
            placeholder="搜索..."
            size="medium"
            @clear="search"
            @keyup.enter.native="search">

    <el-button slot="append"
               :class="$style.searchButton"
               icon="el-icon-search"
               type="primary"
               @click="search">
    </el-button>

  </el-input>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import ACTIONS from '@/console/app-operation/platebatch/store/platebatch-list-actions';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');
const plateBatchListStore = createNamespacedHelpers('PLATE_BATCH_LIST_STORE');

export default {
  methods: {
    ...plateBatchListStore.mapMutations(['updateSearchTerm']),
    ...plateBatchListStore.mapActions([ACTIONS.LIST_MY_MANAGED_PLATE_BATCHES]),

    search() {
      return this[ACTIONS.LIST_MY_MANAGED_PLATE_BATCHES](this.currentAppId);
    },
  },

  computed: {
    ...plateBatchListStore.mapState(['searchTerm']),
    ...appOperationStore.mapGetters(['currentAppId']),

    theSearchTerm: {
      get() {
        return this.searchTerm;
      },

      set(value) {
        this.updateSearchTerm(value);
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

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
import ACTIONS from '@/console/management/order/store/order-list-actions';

const orderListStore = createNamespacedHelpers('ORDER_LIST_STORE');

export default {
  methods: {
    ...orderListStore.mapMutations(['updateSearchTerm', 'resetPageIndex']),
    ...orderListStore.mapActions([ACTIONS.LIST_ORDERS]),

    search() {
      this.resetPageIndex();
      return this[ACTIONS.LIST_ORDERS]();
    },
  },

  computed: {
    ...orderListStore.mapState(['searchTerm']),

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

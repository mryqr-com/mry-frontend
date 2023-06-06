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
import ACTIONS from '@/console/management/app/list/store/app-list-actions';

const appListStore = createNamespacedHelpers('APP_LIST_STORE');

export default {
  methods: {
    ...appListStore.mapMutations(['updateSearchTerm', 'resetPageIndex']),
    ...appListStore.mapActions([ACTIONS.LIST_MY_MANAGED_APPS]),

    search() {
      this.resetPageIndex();
      return this[ACTIONS.LIST_MY_MANAGED_APPS]();
    },
  },

  computed: {
    ...appListStore.mapState(['searchTerm']),

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

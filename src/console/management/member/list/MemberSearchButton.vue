<template>
  <el-input v-model="theSearchTerm"
            :class="$style.searchInput"
            :maxlength="20"
            :spellcheck="false"
            clearable
            placeholder="搜索：姓名/手机号/邮箱..."
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
import MEMBER_LIST_ACTIONS from '@/console/management/member/list/store/member-list-actions';

const memberListStore = createNamespacedHelpers('MEMBER_LIST_STORE');

export default {
  methods: {
    ...memberListStore.mapActions([
      MEMBER_LIST_ACTIONS.LIST_MY_MANAGED_MEMBERS,
    ]),
    ...memberListStore.mapMutations(['updateSearchTerm', 'resetPageIndex']),

    search() {
      this.resetPageIndex();
      return this[MEMBER_LIST_ACTIONS.LIST_MY_MANAGED_MEMBERS]();
    },
  },

  computed: {
    ...memberListStore.mapState(['searchTerm']),

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

<template>
  <div :class="$style.wrapper">
    <el-table ref="listTable"
              :class="$style.theTable"
              :data="members"
              :height="height"
              highlight-current-row
              @sort-change="onSortChange">
      <el-table-column :class-name="$style.nameColumn"
                       column-key="name"
                       label="姓名"
                       min-width="180"
                       sortable="custom">
        <template slot-scope="scope">
          <div :class="$style.nameContainer">
            <Avatar :avatar="scope.row.avatar" :class="$style.theAvatar"></Avatar>
            <span :class="$style.memberName">{{ scope.row.name }}</span>
            <span v-if="isNew(scope.row)" class="tableTag greenTableTag">新</span>
            <span v-if="scope.row.role === 'TENANT_ADMIN'" class="tableTag yellowTableTag">系统管理员</span>
            <span v-if="isCurrentDeptManager(scope.row)" class="tableTag blueTableTag">部门管理员</span>
            <span v-if="!scope.row.active" class="tableTag redTableTag">禁用</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column column-key="mobile"
                       label="电话"
                       min-width="100">
        <template slot-scope="scope">
          <a :class="$style.mobileLink" :href="`tel:${scope.row.mobile}`">{{ scope.row.mobile }}</a>
        </template>
      </el-table-column>

      <el-table-column column-key="email"
                       label="邮箱"
                       min-width="120">
        <template slot-scope="scope">
          <a :class="$style.emailLink" :href="`mailto:${scope.row.email}`">{{ scope.row.email }}</a>
        </template>
      </el-table-column>

      <el-table-column :show-overflow-tooltip="true"
                       column-key="role"
                       label="部门"
                       min-width="120">
        <template slot-scope="scope">
          {{ departmentNamesFor(scope.row) }}
        </template>
      </el-table-column>

      <el-table-column label="操作"
                       width="130">
        <template slot="header" slot-scope="scope">
          <div :class="$style.tableOperationContainer">
            操作
            <MemberTableOperationButtons></MemberTableOperationButtons>
          </div>
        </template>

        <template slot-scope="scope">
          <MemberOperationButtons :member="scope.row"></MemberOperationButtons>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import MemberOperationButtons from '@/console/management/member/list/MemberOperationButtons';
import {isNew} from '@/common/utils/common-utils';
import eventBus from '@/common/utils/event-bus';
import MEMBER_LIST_ACTIONS from "@/console/management/member/list/store/member-list-actions";
import MemberTableOperationButtons from '@/console/management/member/list/MemberTableOperationButtons';

const memberListStore = createNamespacedHelpers('MEMBER_LIST_STORE');

export default {
  props: ['height'],

  components: {MemberOperationButtons, MemberTableOperationButtons},

  created() {
    eventBus.$on('member-list-fetched', this.goToTableTop);
    eventBus.$on('members-sorting-reset', this.resetTableSort);
  },

  beforeDestroy() {
    eventBus.$off('member-list-fetched');
    eventBus.$off('members-sorting-reset');
  },

  methods: {
    ...memberListStore.mapActions([
      MEMBER_LIST_ACTIONS.LIST_MY_MANAGED_MEMBERS,
    ]),

    ...memberListStore.mapMutations(['resetPageIndex', 'updateSorting']),
    isNew: isNew,

    goToTableTop() {
      this.$refs.listTable.bodyWrapper.scrollTop = 0;
    },

    resetTableSort() {
      this.$refs.listTable.clearSort();
    },

    departmentNamesFor(member) {
      return member.departmentIds.map(id => this.departmentFullNameOf(id)).filter(it => !!it).join(', ');
    },

    wxStatus(wxUnionId) {
      if (wxUnionId) {
        return {
          color: '#10b01b'
        }
      }
    },

    wxTitle(member) {
      if (member.wxNickName) {
        return member.wxUnionId ? `已绑定到[${member.wxNickName}]` : `未绑定`;
      } else {
        return member.wxUnionId ? `已绑定` : `未绑定`;
      }
    },

    onSortChange(sort) {
      let sortedBy = sort.order ? sort.column.columnKey : null;
      let ascSort = sort.order === 'ascending';
      this.updateSorting({sortedBy, ascSort});
      this.resetPageIndex();
      return this[MEMBER_LIST_ACTIONS.LIST_MY_MANAGED_MEMBERS]();
    },

    isCurrentDeptManager(member) {
      return this.currentDepartment && this.currentDepartment.managers.includes(member.id);
    },
  },

  computed: {
    ...memberListStore.mapState(['members']),
    ...memberListStore.mapGetters(['currentDepartment', 'departmentFullNameOf']),
  }
}
</script>


<style lang="scss" module>
.wrapper {
}

.theTable {
  width: 100%;
  background-color: $whiteBackgroundColor;

  :global {
    th {
      color: $primaryTextColor;
    }
  }
}

.nameColumn {
  padding: 0 !important;
  padding-left: 16px !important;

  :global {
    .cell {
      display: flex;
      align-items: center;
    }
  }
}

.nameContainer {
  display: inline-flex;
  align-items: center;
}

.theAvatar {
  width: 36px;
  height: 36px;
  margin-right: 10px;
}

.memberName {
  line-height: 1.3em;
  margin-right: 5px;
}

.icon {
  margin-left: 2px;
  margin-right: 2px;
  font-size: 12px;
  padding: 4px 4px;
  display: flex;
  align-items: center;
  line-height: 1.1em;
  flex-shrink: 0;
}

.mobileLink {
  color: $regularTextColor;
  text-decoration: underline;
}

.mobileLink:visited {
  color: $regularTextColor;
}

.mobileLink:hover {
  color: $primaryThemeColor;
}

.emailLink {
  color: $regularTextColor;
  text-decoration: underline;
}

.emailLink:visited {
  color: $regularTextColor;
}

.emailLink:hover {
  color: $primaryThemeColor;
}

.deactivatedText {
  color: $rejectRed;
}

.activatedText {
  color: $passGreen;
}

.tableOperationContainer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

</style>

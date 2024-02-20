<template>
  <div :class="$style.wrapper">
    <div :class="$style.titleBar">
      <span :class="$style.title">成员列表</span>
      <el-button v-if="currentGroupId && !isGroupSynced(currentGroupId)"
                 :class="$style.addMemberButton"
                 icon="el-icon-plus"
                 title="添加成员"
                 type="text"
                 @click="openAddMembersDialog">
      </el-button>
    </div>

    <div v-if="memberReferencesLoaded" :class="$style.listContent">
      <div v-if="groupMembersLoading" :class="$style.loading">
        <i class="el-icon-loading"></i>
      </div>
      <template v-else>
        <template v-if="sortedMembers.length > 0">
          <div v-for="memberId in sortedMembers" :class="$style.memberRow">
            <span :class="$style.memberName">
              {{ memberNameOf(memberId) }}
              <span v-if="isGroupManager(memberId)" class="tableTag blueTableTag">管理员</span>
            </span>

            <el-dropdown v-if="currentGroupId && !isGroupSynced(currentGroupId)"
                         :class="$style.opsDropdown"
                         trigger="click"
                         @command="handleDropdownCommand">
              <el-button :class="$style.dropdownButton"
                         icon="el-icon-more"
                         title="操作"
                         type="text"
                         @click.stop>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="!isGroupManager(memberId)"
                                  :command="{command:'addGroupManager',parameters:memberId}">
                  设为管理员
                </el-dropdown-item>

                <el-dropdown-item v-if="isGroupManager(memberId)"
                                  :command="{command:'removeGroupManager',parameters:memberId}">
                  取消管理员
                </el-dropdown-item>

                <el-dropdown-item :command="{command:'removeMember',parameters:memberId}">
                  移除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
        <div v-else :class="$style.noMember">
          无成员
        </div>
      </template>
    </div>

    <AddGroupMembersDialog :groupId="currentGroupId"
                           :selectableMembers="addSelectableMembers"
                           :show.sync="addMemberDialogVisible">
    </AddGroupMembersDialog>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import memberApi from "@/common/api/member-api";
import Vue from "vue";
import groupApi from "@/common/api/group-api";
import AddGroupMembersDialog from '@/console/app-operation/group-manage/AddGroupMembersDialog';
import {cloneDeep} from 'lodash-es';

const groupManageStore = createNamespacedHelpers('GROUP_MANAGE_STORE');
const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  components: {
    AddGroupMembersDialog,
  },

  data() {
    return {
      addMemberDialogVisible: false,
      memberNames: {},
      allMembers: [],
      memberReferencesLoaded: false,

      groupMembersLoading: false,
    }
  },

  created() {
    return memberApi.listMemberReferences().then((members) => {
      this.allMembers = members;
      members.forEach(member => {
        Vue.set(this.memberNames, member.id, member.showName);
      });
      this.memberReferencesLoaded = true;
    });
  },

  watch: {
    currentGroupId(groupId) {
      this.resetCurrentGroupMembers();

      if (!groupId) {
        return;
      }

      this.groupMembersLoading = true;
      return groupApi.listGroupMembers(groupId).then((response) => {
        this.loadCurrentGroupMembers({memberIds: response.data.memberIds, managerIds: response.data.managerIds});
      }).finally(() => {
        this.groupMembersLoading = false;
      });
    }
  },

  computed: {
    ...groupManageStore.mapGetters([
      'currentGroupId',
      'currentGroupMemberIds',
      'currentGroupManagerIds',
      'groupNameOf',
      'isGroupManager',
      'isGroupSynced',
    ]),
    ...appOperationStore.mapMutations(['markGroupAsDirty']),

    addSelectableMembers() {
      return this.allMembers.filter(member => !this.currentGroupMemberIds.includes(member.id));
    },

    sortedMembers() {
      let managerIds = cloneDeep(this.currentGroupManagerIds);
      let memberIds = cloneDeep(this.currentGroupMemberIds);
      managerIds.sort((id1, id2) => this.memberNameOf(id1).localeCompare(this.memberNameOf(id2), 'zh-CN'));
      memberIds.sort((id1, id2) => this.memberNameOf(id1).localeCompare(this.memberNameOf(id2), 'zh-CN'));
      return managerIds.concat(memberIds).filter((value, index, self) => self.indexOf(value) === index);
    },
  },

  methods: {
    ...groupManageStore.mapMutations([
      'loadCurrentGroupMembers',
      'resetCurrentGroupMembers',
      'addManagerToCurrentGroup',
      'removeManagerFromGroup',
      'removeMemberFromGroup',
    ]),

    openAddMembersDialog() {
      this.addMemberDialogVisible = true;
    },

    memberNameOf(memberId) {
      return this.memberNames[memberId];
    },

    handleDropdownCommand(command) {
      return this[command.command](command.parameters);
    },

    addGroupManager(memberId) {
      return groupApi.addGroupManager(this.currentGroupId, memberId).then(() => {
        this.addManagerToCurrentGroup(memberId);
        this.markGroupAsDirty();
        this.$message({
          type: 'success',
          message: `成功设置为管理员。`,
          center: true
        });
      });
    },

    removeGroupManager(memberId) {
      return groupApi.removeGroupManager(this.currentGroupId, memberId).then(() => {
        this.removeManagerFromGroup(memberId);
        this.markGroupAsDirty();
        this.$message({
          type: 'success',
          message: `成功取消管理员。`,
          center: true
        });
      });
    },

    removeMember(memberId) {
      return this.$confirm(`确认从【${this.groupNameOf(this.currentGroupId)}】中移除成员【${this.memberNameOf(memberId)}】？`, '提示', {
        confirmButtonText: '是的，移除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return groupApi.removeGroupMember(this.currentGroupId, memberId).then(() => {
          this.removeMemberFromGroup(memberId);
          this.markGroupAsDirty();
          this.$message({
            type: 'success',
            message: `成功移除成员。`,
            center: true
          });
        });
      });
    },
  }
}
</script>

<style lang="scss" module>
$titleBarHeight: 60px;

.wrapper {
  background-color: white;
  padding-top: 0;
  padding-bottom: 15px;
}

.titleBar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: $titleBarHeight;
  padding-right: 15px;
  padding-left: 15px;
}

.title {
  font-weight: 500;
  color: $primaryTextColor;
}

.addMemberButton {
  font-size: 16px;
  padding: 7px;

  :global {
    .el-icon-plus:before {
      font-weight: 600;
    }
  }
}

.addMemberButton:hover {
  background-color: rgba(0, 191, 255, 0.1);
}

.listContent {
  padding-left: 15px;
  padding-right: 15px;
  height: calc(100% - #{$titleBarHeight});
  overflow-y: auto;
}

.memberRow {
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 5px;
  padding-right: 5px;
  cursor: pointer;
}

.memberRow:hover {
  background-color: rgba(0, 191, 255, 0.1);
}

.opsDropdown {
  display: none;
}

.memberRow:hover .opsDropdown {
  display: block;
}

.memberName {
  display: flex;
  align-items: center;
}

.dropdownButton {
  color: $regularTextColor;
  padding: 5px;
  margin-left: 5px;
  margin-right: 5px;
}

.dropdownButton:hover {
  color: $primaryThemeColor;
  background-color: $primaryBackgroundColor;
}

.loading {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $secondaryTextColor;
  font-size: 16px;
}

.noMember {
  color: $secondaryTextColor;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>

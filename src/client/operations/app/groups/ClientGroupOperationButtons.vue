<template>
  <div :class="$style.wrapper">
    <el-dropdown trigger="click" @command="handleCommand">
      <span :class="$style.dropdownButton">...</span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="gotoGroup">进入</el-dropdown-item>

        <template v-if="canManageApp && !isAppGroupSynced">
          <el-dropdown-item command="addGroupMembers">添加成员</el-dropdown-item>

          <el-dropdown-item command="addGroupManagers">添加管理员</el-dropdown-item>

          <el-dropdown-item v-if="canCreateSubGroup"
                            command="openCreateGroupDialog">
            {{ addSubGroupButtonText }}
          </el-dropdown-item>

          <el-dropdown-item command="deleteGroup">删除</el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </el-dropdown>

    <ClientCreateGroupDialog :parentGroupId="group.id"
                             :show.sync="createGroupDialogVisible">
    </ClientCreateGroupDialog>

    <ClientAddGroupMembersDialog :group="group"
                                 :show.sync="addGroupMemberDialogVisible">
    </ClientAddGroupMembersDialog>

    <ClientAddGroupManagersDialog :group="group"
                                  :show.sync="addGroupManagerDialogVisible">
    </ClientAddGroupManagersDialog>
  </div>
</template>

<script>
import {createNamespacedHelpers, mapMutations} from "vuex";
import ClientCreateGroupDialog from '@/client/operations/app/groups/ClientCreateGroupDialog';
import ClientAddGroupMembersDialog from '@/client/operations/app/groups/ClientAddGroupMembersDialog';
import ClientAddGroupManagersDialog from '@/client/operations/app/groups/ClientAddGroupManagersDialog';

import groupApi from "@/common/api/group-api";

const clientAppOperationStore = createNamespacedHelpers('CLIENT_APP_OPERATION_STORE');

export default {
  props: ['group'],

  components: {
    ClientCreateGroupDialog,
    ClientAddGroupMembersDialog,
    ClientAddGroupManagersDialog,
  },

  data() {
    return {
      createGroupDialogVisible: false,
      addGroupMemberDialogVisible: false,
      addGroupManagerDialogVisible: false,
    }
  },

  computed: {
    ...clientAppOperationStore.mapGetters([
      'canManageApp',
      'instanceDesignation',
      'groupDesignation',
      'isAppGroupSynced',
    ]),

    canCreateSubGroup() {
      let level = (this.group.name.match(/\//g) || []).length + 1;
      return level < 5;
    },

    addSubGroupButtonText() {
      let level = (this.group.name.match(/\//g) || []).length + 1;
      if (level >= 4 && this.groupDesignation !== '分组') {
        return `新建${this.groupDesignation}`;
      }

      return this.groupDesignation === '分组' ? '新建子分组' : `新建${this.groupDesignation}或子分组`;
    },
  },

  methods: {
    ...mapMutations(['refreshClientHomePage']),
    ...clientAppOperationStore.mapMutations(['deleteGroupById']),

    handleCommand(command) {
      return this[command]();
    },

    gotoGroup() {
      this.$router.push({name: 'client-group-operation-home', params: {groupId: this.group.id}});
    },

    addGroupMembers() {
      this.addGroupMemberDialogVisible = true;
    },

    addGroupManagers() {
      this.addGroupManagerDialogVisible = true;
    },

    openCreateGroupDialog() {
      this.createGroupDialogVisible = true;
    },

    deleteGroup() {
      return this.$confirm(`确认删除:【${this.group.name}】？删除后，其下（包括各级子分组下）所有的${this.instanceDesignation}将被同时删除，且无法恢复。`, '提示', {
        confirmButtonText: '是的，删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return groupApi.deleteGroup(this.group.id).then(() => {
          this.$message({
            type: 'success',
            message: `成功删除【${this.group.name}】。`,
            center: true
          });
          this.refreshClientHomePage();
        });
      });
    },

  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.dropdownButton {
  color: $secondaryTextColor;
  font-weight: 600;
  font-size: 20px;
  padding: 0 8px 10px;
  cursor: pointer;
}

.dropdownButton:hover {
  color: $primaryThemeColor;
}
</style>

<template>
  <div v-if="groupHierarchyLoaded" :class="$style.wrapper">
    <section :class="$style.leftSection">
      <section :class="$style.leftTopSection">
        <div :class="$style.groupTitleBar">
          <span :class="$style.groupTitle">
            所有{{ groupDesignation }}
            <el-dropdown v-if="!departmentSynced"
                         size="medium"
                         trigger="click"
                         @command="handleConfigCommand">
              <i :class="$style.configButton" class="el-icon-s-tools" title="设置部门同步"></i>
              <el-dropdown-menu slot="dropdown">
                 <el-dropdown-item command="syncDepartment">
                   保持与部门层级同步
                 </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
          <div v-if="departmentSynced" :class="$style.departmentSyncTip" class="tableTag blueTableTag">
            已设置从部门自动同步
          </div>
          <el-button v-else :class="$style.addFirstLevelGroupButton"
                     :title="addFirstLevelGroupTitle"
                     icon="el-icon-plus"
                     type="text"
                     @click="openAddGroupDialog({ groups:groupData, parentNode:null})">
          </el-button>
        </div>
        <el-input v-model="groupFilterText"
                  :clearable="true"
                  placeholder="搜索..."
                  size="medium">
        </el-input>
      </section>

      <section :class="$style.groupTreeSection">
        <el-tree ref="tree"
                 :allow-drop="allowDrop"
                 :class="$style.groupTree"
                 :data="groupData"
                 :draggable="!departmentSynced"
                 :expand-on-click-node="false"
                 :filter-node-method="filterGroup"
                 :highlight-current="true"
                 :props="groupTreeProps"
                 node-key="id"
                 @node-drag-start="handleDragStart"
                 @node-drop="handleNodeDrop"
                 @node-click="handleNodeClick">
          <div slot-scope="{ node, data }" :class="$style.groupTreeRow">
            <span :class="[$style.groupName,{[$style.syncedGroupName]:isGroupSynced(data.id)}]"
                  :title="isGroupSynced(data.id)?`${groupNameOf(data.id)}（来自部门同步）`:groupNameOf(data.id)">
              {{ groupNameOf(data.id) }}
              <span v-if="!isGroupActive(data.id)" class="tableTag redTableTag">已禁用</span>
              <span v-if="isGroupArchived(data.id)" class="tableTag yellowTableTag">已归档</span>
            </span>

            <el-dropdown :class="$style.groupDropdown" trigger="click" @command="handleGroupCommand">
              <el-button :class="$style.dropdownButton"
                         icon="el-icon-more"
                         title="操作"
                         type="text"
                         @click.stop>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="node.level < 5 && isGroupVisible(data.id) && !departmentSynced"
                                  :command="{command:'openAddGroupDialog',parameters:{groups:data.children, parentNode:node}}">
                  {{ addSubGroupButtonText(node) }}
                </el-dropdown-item>

                <el-dropdown-item v-if="!isGroupSynced(data.id)"
                                  :command="{command:'openRenameGroupDialog',parameters:data.id}">
                  重命名
                </el-dropdown-item>

                <el-dropdown-item v-if="isGroupActive(data.id)"
                                  :command="{command:'deactivate',parameters:node}">
                  禁用
                </el-dropdown-item>

                <el-dropdown-item v-if="!isGroupActive(data.id)" :command="{command:'activate',parameters:node}">
                  启用
                </el-dropdown-item>

                <el-dropdown-item v-if="isGroupArchived(data.id)"
                                  :command="{command:'unArchive',parameters:node}">
                  取消归档
                </el-dropdown-item>

                <el-dropdown-item v-if="!isGroupArchived(data.id)" :command="{command:'archive',parameters:node}">
                  归档
                </el-dropdown-item>

                <el-dropdown-item v-if="!isGroupSynced(data.id)"
                                  :command="{command:'openDeleteGroupDialog',parameters:node}">
                  删除
                </el-dropdown-item>

                <el-dropdown-item v-if="isGroupVisible(data.id)"
                                  :command="{command:'goToGroupOperationPage',parameters:data.id}">
                  进入运营页
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-tree>
      </section>
    </section>

    <section :class="$style.rightSection">
      <div :class="$style.groupTopBar">
        <span :class="$style.groupNameText">
          {{ groupNameText }}
          <HelpDocLinker url="//docs.mryqr.com/console-app-operation/group-management/"></HelpDocLinker>
        </span>
        <el-button v-if="currentGroupId && isGroupVisible(currentGroupId)"
                   size="medium"
                   @click="goToGroupOperationPage(currentGroupId)">
          进入运营页
        </el-button>
      </div>
      <div :class="$style.groupContentContainer">
        <GroupQrList :class="$style.qrListSection" :groupData="groupData"></GroupQrList>
        <GroupMemberList :key="qrsPageIndex" :class="$style.memberListSection"></GroupMemberList>
      </div>
    </section>

    <AddGroupDialog :groupContainer="addGroupContainer"
                    :parentNode="addGroupParentNode"
                    :show.sync="addGroupDialogVisible">
    </AddGroupDialog>

    <RenameGroupDialog :groupId="renameGroupId"
                       :show.sync="renameGroupDialogVisible">
    </RenameGroupDialog>

    <DeleteGroupDialog :node="deleteGroupNode"
                       :show.sync="deleteGroupDialogVisible">
    </DeleteGroupDialog>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import {cloneDeep, isEqual} from 'lodash-es';

import groupHierarchyApi from '@/common/api/group-hierarchy-api';
import AddGroupDialog from '@/console/app-operation/group-manage/AddGroupDialog';
import RenameGroupDialog from '@/console/app-operation/group-manage/RenameGroupDialog';
import groupApi from "@/common/api/group-api";
import appApi from "@/common/api/app-api";
import DeleteGroupDialog from '@/console/app-operation/group-manage/DeleteGroupDialog';
import GroupMemberList from '@/console/app-operation/group-manage/GroupMemberList';
import GroupQrList from '@/console/app-operation/group-manage/GroupQrList';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');
const groupManageStore = createNamespacedHelpers('GROUP_MANAGE_STORE');

export default {
  components: {
    AddGroupDialog,
    RenameGroupDialog,
    DeleteGroupDialog,
    GroupMemberList,
    GroupQrList,
  },

  data() {
    return {
      groupData: null,
      groupHierarchyLoaded: false,
      groupFilterText: null,
      groupTreeProps: {
        children: 'children',
        label: 'id',
      },

      addGroupDialogVisible: false,
      addGroupParentNode: null,
      addGroupContainer: null,

      renameGroupDialogVisible: false,
      renameGroupId: null,

      deleteGroupDialogVisible: false,
      deleteGroupNode: null,

      dragTempGroupData: null,
    };
  },

  created() {
    document.title = `${this.groupDesignation}管理`;
    this.resetState();
    return groupHierarchyApi.fetchGroupHierarchy(this.currentAppId).then(response => {
      this.groupData = response.data.idTree.nodes;
      let allGroups = response.data.allGroups.reduce((obj, item) => Object.assign(obj, {[item.id]: item}), {});
      this.loadGroupHierarchy({groups: allGroups, departmentSynced: response.data.sync});
      this.groupHierarchyLoaded = true;
    });
  },

  watch: {
    groupFilterText(val) {
      this.$refs.tree.filter(val);
    }
  },

  computed: {
    ...appOperationStore.mapGetters([
      'currentAppId',
      'groupDesignation',
      'instanceDesignation',
    ]),

    ...groupManageStore.mapGetters([
      'groupNameOf',
      'isGroupActive',
      'isGroupArchived',
      'isGroupSynced',
      'currentGroupId',
      'isGroupVisible',
      'departmentSynced',
      'qrsPageIndex',
    ]),

    addFirstLevelGroupTitle() {
      return this.groupDesignation === '分组' ? '新建分组' : `新建${this.groupDesignation}或分组`;
    },

    groupNameText() {
      return this.currentGroupId ? this.groupNameOf(this.currentGroupId) : `${this.groupDesignation}详情`;
    },
  },

  methods: {
    ...appOperationStore.mapMutations(['markGroupAsDirty']),
    ...groupManageStore.mapMutations([
      'resetState',
      'loadGroupHierarchy',
      'deactivateGroupById',
      'activateGroupById',
      'archiveGroupById',
      'unArchiveGroupById',
      'setCurrentGroupId',
      'enableDepartmentSync',
    ]),

    handleConfigCommand(command) {
      return this[command]();
    },

    syncDepartment() {
      return this.$confirm(`同步后，系统将自动保持部门到${this.groupDesignation}的一对一数据同步，包括部门下的成员和管理员，同步功能启用后无法取消。确认启用部门同步功能？`, '提示', {
        confirmButtonText: '是的，启用',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return appApi.enableGroupSync(this.currentAppId).then(() => {
          this.enableDepartmentSync();
        }).then(() => {
          this.$confirm(`部门同步功能已启用，系统后台可能需要几分钟时间完成数据同步，到时您可刷新当前页面查看同步结果。`, '提示', {
            confirmButtonText: '好的',
            cancelButtonText: '取消',
            type: 'success'
          })
        });
      });
    },

    addSubGroupButtonText(node) {
      if (node.level >= 4 && this.groupDesignation !== '分组') {
        return `新建${this.groupDesignation}`;
      }

      return this.groupDesignation === '分组' ? '新建子分组' : `新建${this.groupDesignation}或子分组`;
    },

    openAddGroupDialog({groups, parentNode}) {
      this.addGroupParentNode = parentNode;
      this.addGroupContainer = groups;
      this.addGroupDialogVisible = true;
    },

    openRenameGroupDialog(groupId) {
      this.renameGroupId = groupId;
      this.renameGroupDialogVisible = true;
    },

    openDeleteGroupDialog(node) {
      this.deleteGroupNode = node;
      this.deleteGroupDialogVisible = true;
    },

    deactivate(node) {
      let groupId = node.data.id;
      let confirmMessage = node.isLeaf ?
          `禁用后，其下所有的${this.instanceDesignation}将无法正常访问，确认禁用【${this.groupNameOf(groupId)}】？` :
          `禁用后，其下（包括各级子分组下）所有的${this.instanceDesignation}将无法正常访问，确认禁用【${this.groupNameOf(groupId)}】？`;

      return this.$confirm(confirmMessage, '提示', {
        confirmButtonText: '是的，禁用',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return groupApi.deactivateGroup(groupId).then(() => {
          this.$message({
            type: 'success',
            message: `成功禁用【${this.groupNameOf(groupId)}】。`,
            center: true
          });
          node.expanded = false;
          this.deactivateGroupById(node.data);
          this.markGroupAsDirty();
        });
      });
    },

    activate(node) {
      let groupId = node.data.id;
      return this.$confirm(`确认启用【${this.groupNameOf(groupId)}】？`, '提示', {
        confirmButtonText: '是的，启用',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return groupApi.activateGroup(groupId).then(() => {
          this.$message({
            type: 'success',
            message: `成功启动【${this.groupNameOf(groupId)}】。`,
            center: true
          });
          this.activateGroupById(node.data);
          this.markGroupAsDirty();
        });
      });
    },

    unArchive(node) {
      let groupId = node.data.id;
      return this.$confirm(`确认取消归档【${this.groupNameOf(groupId)}】？`, '提示', {
        confirmButtonText: '是的，取消归档',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return groupApi.unArchiveGroup(groupId).then(() => {
          this.$message({
            type: 'success',
            message: `成功取消归档【${this.groupNameOf(groupId)}】。`,
            center: true
          });
          this.unArchiveGroupById(node.data);
          this.markGroupAsDirty();
        });
      });
    },

    archive(node) {
      let groupId = node.data.id;
      let confirmMessage = node.isLeaf ?
          `归档后，其下所有的${this.instanceDesignation}在电脑端和手机端的运营页面将不再可见，但可单独访问，确认归档【${this.groupNameOf(groupId)}】？` :
          `归档后，其下（包括各级子分组下）所有的${this.instanceDesignation}在电脑端和手机端的运营页面将不再可见，但可单独访问，确认归档【${this.groupNameOf(groupId)}】？`;

      return this.$confirm(confirmMessage, '提示', {
        confirmButtonText: '是的，归档',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return groupApi.archiveGroup(groupId).then(() => {
          this.$message({
            type: 'success',
            message: `成功归档【${this.groupNameOf(groupId)}】。`,
            center: true
          });
          node.expanded = false;
          this.archiveGroupById(node.data);
          this.markGroupAsDirty();
        });
      });
    },

    handleNodeClick(data, node) {
      if (this.isGroupVisible(data.id) && !node.expanded) {
        node.expanded = true;
      }

      if (data && data.id) {
        this.setCurrentGroupId(data.id);
      }
    },

    filterGroup(value, data) {
      if (!value) return true;
      return this.groupNameOf(data.id).indexOf(value) !== -1;
    },

    allowDrop(draggingNode, dropNode, type) {
      let parentDepth = type === 'inner' ? dropNode.level : dropNode.level - 1;
      return parentDepth + this.depthOf(draggingNode) <= 5;
    },

    depthOf(node) {
      if (!node.childNodes || node.childNodes.length === 0) {
        return 1;
      }

      let children = node.childNodes;

      let max = 0;
      for (const child of children) {
        let number = this.depthOf(child);
        if (number > max) {
          max = number;
        }
      }
      return max + 1;
    },

    handleDragStart() {
      this.dragTempGroupData = cloneDeep(this.groupData);
    },

    handleNodeDrop(before, after, position) {
      if (isEqual(this.dragTempGroupData, this.groupData)) {
        return;
      }

      let command = {
        idTree: {
          nodes: this.groupData,
        }
      };

      let confirmMessage = position === 'inner' ?
          `确认将【${this.groupNameOf(before.data.id)}】移动到【${this.groupNameOf(after.data.id)}】之下？` :
          `确认移动【${this.groupNameOf(before.data.id)}】？`;

      return this.$confirm(confirmMessage, '提示', {
        confirmButtonText: '是的',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return groupHierarchyApi.updateGroupHierarchy(this.currentAppId, command).then(() => {
          this.$message({
            type: 'success',
            message: `移动成功。`,
            center: true,
          });
          this.markGroupAsDirty();
        });
      }).catch(ex => {
        this.groupData = this.dragTempGroupData;
        throw ex;
      });
    },

    handleGroupCommand(command) {
      return this[command.command](command.parameters);
    },

    goToGroupOperationPage(groupId) {
      this.$router.push({name: 'group-operation-qr-list', params: {groupId: groupId}});
    },
  }
}
</script>

<style lang="scss" module>
$contentPadding: 24px;
$opsBarHeight: 60px;
$sectionGutter: 15px;
$paginationHeight: 48px;
$leftTopSectionHeight: 95px;
$sectionPadding: 15px;

.wrapper {
  height: calc(100vh - #{$consoleTopBarHeight});
  padding: $contentPadding;
  display: flex;

  :global {
    .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
      background-color: rgba(0, 191, 255, 0.1) !important;
      color: $primaryThemeColor !important;
    }

    .el-tree-node.is-drop-inner > .el-tree-node__content {
      background-color: $primaryThemeColor !important;
      color: white !important;
    }
  }
}

.leftSection {
  width: 280px;
  height: 100%;
  background-color: white;
  flex-grow: 0;
  flex-shrink: 0;
  padding-top: $sectionPadding;
  padding-bottom: $sectionPadding;
}

.leftTopSection {
  padding-left: $sectionPadding;
  padding-right: $sectionPadding;
  height: $leftTopSectionHeight;
}

.groupTitleBar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.groupTitle {
  font-size: 16px;
  font-weight: 500;
  color: $primaryTextColor;
}

.configButton {
  font-weight: normal;
  color: $regularTextColor;
  font-size: 14px;
  padding: 5px;
}

.configButton:hover {
  cursor: pointer;
  background-color: $lightBackgroundColor;
}

.departmentSyncTip {
  margin-top: 8px;
  margin-bottom: 8px;
  padding: 5px;
  font-size: 13px;
}

.addFirstLevelGroupButton {
  font-size: 18px;
  padding: 8px;

  :global {
    .el-icon-plus:before {
      font-weight: 600;
    }
  }
}

.addFirstLevelGroupButton:hover {
  background-color: rgba(0, 191, 255, 0.1);
}

.groupTreeSection {
  height: calc(100% - #{$leftTopSectionHeight});
  overflow-y: auto;
  padding-left: $sectionPadding;
  padding-right: $sectionPadding;
}

.groupTree {
  :global {
    .el-tree-node__content {
      height: 40px;
    }
  }
}

.groupTreeRow {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
}

.groupName {
  overflow-x: auto;
  height: 40px;
  display: flex;
  align-items: center;
}

.syncedGroupName {
  color: #318CE7;
}

.groupDropdown {
  display: none;
}

.groupTreeRow:hover .groupDropdown {
  display: block;
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

.rightSection {
  flex-grow: 1;
  flex-shrink: 0;
  margin-left: $sectionGutter;
  height: 100%;
}

.groupTopBar {
  height: $opsBarHeight;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  margin-bottom: $sectionGutter;
  padding-left: 15px;
  padding-right: 15px;
}

.groupNameText {
  font-size: 15px;
  font-weight: 500;
  color: $primaryTextColor;
}

.groupContentContainer {
  height: calc(100% - #{$opsBarHeight} - #{$sectionGutter});
  display: flex;
}

.qrListSection {
  flex-grow: 1;
  flex-shrink: 1;
}

.memberListSection {
  margin-left: 15px;
  width: 280px;
  flex-grow: 0;
  flex-shrink: 0;
}

</style>

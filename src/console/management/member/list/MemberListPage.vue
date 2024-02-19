<template>
  <div v-if="listLoaded" :class="$style.wrapper">
    <section :class="$style.departmentSection">
      <div :class="$style.deptTopContainer">
        <div :class="$style.deptTopBar">
          <span :class="$style.deptTopBarTitle">部门列表</span>
          <el-button :class="$style.addDeptButton"
                     icon="el-icon-plus"
                     title="新建部门"
                     type="text"
                     @click=" openCreateDeptDialog({departmentContainer:departmentData, parentNode:null})">
          </el-button>
        </div>
        <el-input v-model="filterText"
                  :clearable="true"
                  placeholder="搜索..."
                  size="medium">
        </el-input>
        <div :class="[$style.allDeptRow,{[$style.currentDept]:isCurrentDept('ALL')}]" @click="activateDept('ALL')">
          所有部门
        </div>
      </div>

      <div :class="$style.deptListContainer">
        <el-tree ref="tree"
                 :allow-drop="allowDrop"
                 :class="$style.theTree"
                 :data="departmentData"
                 :draggable="true"
                 :expand-on-click-node="false"
                 :filter-node-method="filterDept"
                 :highlight-current="true"
                 :props="treeProps"
                 empty-text="暂无部门"
                 node-key="id"
                 @node-drag-start="handleDragStart"
                 @node-drop="handleNodeDrop"
                 @node-click="handleNodeClick">
          <div slot-scope="{ node, data }" :class="$style.treeRow">
            <span :class="$style.deptName">{{ departmentNameOf(data.id) }}</span>
            <el-dropdown :class="$style.deptDropdown"
                         trigger="click"
                         @command="handleDeptCommand">
              <el-button :class="$style.dropdownButton"
                         icon="el-icon-more"
                         title="操作"
                         type="text"
                         @click.stop>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="node.level < 5"
                                  :command="{command:'openCreateDeptDialog',parameters:{departmentContainer:data.children, parentNode:node}}">
                  新建子部门
                </el-dropdown-item>
                <el-dropdown-item :command="{command:'renameDept',parameters:data.id}">重命名</el-dropdown-item>
                <el-dropdown-item :command="{command:'deleteDept',parameters:node}">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-tree>
      </div>

      <CreateDepartmentDialog :departmentContainer="createDeptContainer"
                              :parentNode="createDeptParentNode"
                              :show.sync="createDeptDialogVisible">
      </CreateDepartmentDialog>

      <RenameDepartmentDialog :departmentId="currentOpsDeptId"
                              :show.sync="renameDeptDialogVisible">
      </RenameDepartmentDialog>
    </section>

    <section :class="$style.memberSection">
      <div :class="$style.opsBar">
        <div :class="$style.theTitle">{{ memberSectionTitle }}</div>

        <div :class="$style.opsButtons">
          <MemberSearchButton></MemberSearchButton>
          <MemberAddButton :class="$style.addButton"></MemberAddButton>
        </div>
      </div>

      <MemberListTable ref="listTable" :height="tableHeight"></MemberListTable>

      <el-pagination v-if="hasPagination"
                     :class="$style.pagination"
                     :current-page.sync="thePageIndex"
                     :page-size.sync="thePageSize"
                     :page-sizes="[10, 20, 30, 50]"
                     :total="totalNumber"
                     layout="total,prev,pager,next,sizes"
                     @current-change="onPageIndexChanged"
                     @size-change="onPageSizeChanged">
      </el-pagination>
    </section>
  </div>
</template>

<script>
import {createNamespacedHelpers, mapGetters} from 'vuex';
import MEMBER_LIST_ACTIONS from '@/console/management/member/list/store/member-list-actions';
import MemberAddButton from '@/console/management/member/list/MemberAddButton';
import MemberListTable from '@/console/management/member/list/MemberListTable';
import MemberSearchButton from '@/console/management/member/list/MemberSearchButton';
import CreateDepartmentDialog from '@/console/management/member/list/CreateDepartmentDialog';
import RenameDepartmentDialog from '@/console/management/member/list/RenameDepartmentDialog';
import departmentApi from '@/common/api/department-api';
import departmentHierarchyApi from '@/common/api/department-hierarchy-api';
import {cloneDeep, isEqual} from 'lodash-es';

const memberListStore = createNamespacedHelpers('MEMBER_LIST_STORE');

export default {
  components: {
    MemberAddButton,
    MemberListTable,
    MemberSearchButton,
    CreateDepartmentDialog,
    RenameDepartmentDialog,
  },

  data() {
    return {
      listLoaded: false,

      createDeptDialogVisible: false,
      createDeptParentNode: null,
      createDeptContainer: null,

      renameDeptDialogVisible: false,
      currentOpsDeptId: null,

      filterText: null,
      treeProps: {
        children: 'children',
        label: 'id',
      },

      departmentData: null,
      dragTempDeptData: null,
    }
  },

  created() {
    document.title = `成员管理 - ${this.tenantName}`;

    this.resetState();
    return departmentHierarchyApi.fetchDepartmentHierarchy().then(response => {
      let departmentData = response.data.idTree.nodes;
      this.departmentData = departmentData;
      let allDepartments = response.data.allDepartments.reduce((obj, item) => Object.assign(obj, {[item.id]: item}), {});
      this.loadDepartmentHierarchy({departmentData, allDepartments});
      return this[MEMBER_LIST_ACTIONS.LIST_MY_MANAGED_MEMBERS]().then(() => {
        this.listLoaded = true;
      });
    });
  },

  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },

    departmentData: {
      handler(newValue) {
        this.updateDepartmentData(cloneDeep(newValue));
      },
      deep: true
    },
  },

  methods: {
    ...memberListStore.mapActions([
      MEMBER_LIST_ACTIONS.LIST_MY_MANAGED_MEMBERS,
    ]),

    ...memberListStore.mapMutations([
      'clearSearchTerm',
      'resetSorting',
      'resetPageIndex',
      'updatePageIndex',
      'updatePageSize',
      'activateDepartment',
      'resetState',
      'loadDepartmentHierarchy',
      'updateDepartmentData',
      'removeDepartment',
    ]),

    openCreateDeptDialog({departmentContainer, parentNode}) {
      this.createDeptParentNode = parentNode;
      this.createDeptContainer = departmentContainer;
      this.createDeptDialogVisible = true;
    },

    isCurrentDept(deptId) {
      return deptId === this.currentDepartmentId;
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

    filterDept(value, data) {
      if (!value) return true;
      return this.departmentNameOf(data.id).indexOf(value) !== -1;
    },

    handleDragStart() {
      this.dragTempDeptData = cloneDeep(this.departmentData);
    },

    handleNodeDrop() {
      if (isEqual(this.dragTempDeptData, this.departmentData)) {
        return;
      }

      let command = {
        idTree: {
          nodes: this.departmentData,
        }
      };

      return departmentHierarchyApi.updateDepartmentHierarchy(command).catch(ex => {
        this.departmentData = this.dragTempDeptData;
        this.activateDept('ALL');
        throw ex;
      });
    },

    handleNodeClick(data, node) {
      if (!node.expanded) {
        node.expanded = true;
      }

      if (data && data.id) {
        this.activateDept(data.id);
      }
    },

    activateDept(deptId) {
      if (deptId === 'ALL') {
        this.$refs.tree.setCurrentKey(null);
      }

      this.activateDepartment(deptId);
      this.clearSearchTerm();
      this.resetPageIndex();
      this.resetSorting();
      return this[MEMBER_LIST_ACTIONS.LIST_MY_MANAGED_MEMBERS]();
    },

    handleDeptCommand(command) {
      return this[command.command](command.parameters);
    },

    renameDept(id) {
      this.currentOpsDeptId = id;
      this.renameDeptDialogVisible = true;
    },

    deleteDept(node) {
      let id = node.data.id;
      return this.$confirm(`确认删除部门【${this.departmentNameOf(id)}】？`, '提示', {
        confirmButtonText: '是的，删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return departmentApi.deleteDepartment(id).then(() => {
          this.$message({
            type: 'success',
            message: `成功删除。`,
            center: true,
            duration: 1000,
          });
          this.removeDepartment(node.data);
          this.removeDeptNode(node);
          if (id === this.currentDepartmentId) {
            this.activateDept('ALL');
          }
        })
      });
    },

    removeDeptNode(node) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === node.data.id);
      children.splice(index, 1);
    },

    onPageIndexChanged() {
      return this[MEMBER_LIST_ACTIONS.LIST_MY_MANAGED_MEMBERS]();
    },

    onPageSizeChanged() {
      this.resetPageIndex();
      return this[MEMBER_LIST_ACTIONS.LIST_MY_MANAGED_MEMBERS]();
    },
  },

  computed: {
    ...mapGetters([
      'tenantName'
    ]),

    ...memberListStore.mapState([
      'currentDepartmentId',
      'totalNumber',
      'pageIndex',
      'pageSize',
    ]),

    ...memberListStore.mapGetters([
      'currentDepartment',
      'departmentNameOf',
    ]),

    memberSectionTitle() {
      return this.currentDepartment ? this.currentDepartment.name : '所有部门';
    },

    hasPagination() {
      return this.totalNumber > this.pageSize;
    },

    tableHeight() {
      if (this.hasPagination) {
        return window.innerHeight - 60 - 24 - 60 - 5 - 24 - 48;
      } else {
        return window.innerHeight - 60 - 24 - 60 - 5 - 24;
      }
    },

    thePageIndex: {
      get() {
        return this.pageIndex;
      },

      set(value) {
        this.updatePageIndex(value);
      }
    },

    thePageSize: {
      get() {
        return this.pageSize;
      },

      set(value) {
        this.updatePageSize(value);
      }
    }
  }
}
</script>


<style lang="scss" module>
$content-padding: 24px;
$ops-bar-height: 60px;
$ops-bar-margin-bottom: 5px;
$pagination-height: 48px;
$sectionPadding: 15px;
$dept-top-height: 100px;

.wrapper {
  height: calc(100vh - #{$consoleTopBarHeight});
  padding: $content-padding;
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

.departmentSection {
  width: 300px;
  height: 100%;
  background-color: white;
  flex-grow: 0;
  flex-shrink: 0;
  padding-top: $sectionPadding;
  padding-bottom: $sectionPadding;
  border-right: $primary1pxBorder;
}

.deptTopContainer {
  padding-left: $sectionPadding;
  padding-right: $sectionPadding;
}

.deptTopBar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  margin-bottom: 15px;
}

.deptTopBarTitle {
  font-size: 16px;
  font-weight: 500;
  color: $primaryTextColor;
}

.addDeptButton {
  font-size: 18px;
  padding: 8px;

  :global {
    .el-icon-plus:before {
      font-weight: 600;
    }
  }
}

.addDeptButton:hover {
  background-color: rgba(0, 191, 255, 0.1);
}

.deptListContainer {
  height: calc(100% - 95px - 36px - 10px);
  overflow-y: auto;
  padding-left: $sectionPadding;
  padding-right: $sectionPadding;
}

.theTree {
  :global {
    .el-tree-node__content {
      height: 40px;
    }
  }
}

.treeRow {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
}

.deptName {
  overflow-x: auto;
  height: 40px;
  display: flex;
  align-items: center;
}

.deptDropdown {
  display: none;
}

.treeRow:hover .deptDropdown {
  display: block;
}

.allDeptRow {
  margin-top: 10px;
  display: flex;
  align-items: center;
  height: 40px;
  cursor: pointer;
  padding-left: $sectionPadding;
  padding-right: $sectionPadding;
}

.allDeptRow:hover {
  background-color: $lightBackgroundColor;
}

.currentDept {
  color: $primaryThemeColor;
  background-color: rgba(0, 191, 255, 0.1);
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

.memberSection {
  flex-grow: 1;
  flex-shrink: 1;
}

.opsBar {
  padding: 0 16px;
  height: $ops-bar-height;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: $whiteBackgroundColor;
  margin-bottom: $ops-bar-margin-bottom;
}

.theTitle {
  font-size: 15px;
  font-weight: 500;
}

.opsButtons {
  display: flex;
  align-items: center;
}

.addButton {
  margin-left: 16px;
}

.pagination {
  height: $pagination-height;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
}

</style>

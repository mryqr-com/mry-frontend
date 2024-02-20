<template>
  <div :class="$style.wrapper">
    <div :class="$style.titleBar">
      <span :class="$style.title">{{ instanceDesignation }}列表</span>
      <div>
        <el-dropdown v-if="batchSelectedQrs.length > 1"
                     trigger="click"
                     @command="handleBatchCommand">

          <el-button :class="$style.batchButton"
                     size="small"
                     type="plain">
            批量操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="batchChangeQrsGroup">
              {{ changeGroupTitle }}
            </el-dropdown-item>

            <el-dropdown-item command="batchDeleteQrs">
              删除
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-input v-if="currentGroupId"
                  v-model="theSearch"
                  :class="$style.searchInput"
                  :maxlength="50"
                  :spellcheck="false"
                  clearable
                  placeholder="搜索..."
                  size="small"
                  @clear="doSearch"
                  @keyup.enter.native="doSearch">
          <el-button slot="append"
                     :class="$style.searchButton"
                     icon="el-icon-search"
                     type="primary"
                     @click="doSearch">
          </el-button>
        </el-input>

        <el-button v-if="currentGroupId && isGroupActive(currentGroupId)"
                   :class="$style.addQrButton"
                   :title="`新增${instanceDesignation}`"
                   icon="el-icon-plus"
                   type="text"
                   @click="openAddQrsDialog">
        </el-button>
      </div>
    </div>

    <div :class="$style.tableContainer">
      <el-table ref="listTable"
                :key="thePageIndex"
                :class="$style.theTable"
                :data="displayQrs"
                :height="tableHeight"
                highlight-current-row
                @sort-change="onSortChange"
                @selection-change="onSelectionChange">
        <div slot="empty">
          <span v-if="qrsLoading"><i :class="$style.loadingIcon" class="el-icon-loading"></i></span>
          <span v-else>无数据</span>
        </div>

        <el-table-column fixed="left"
                         type="selection"
                         width="36">
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true"
                         column-key="name"
                         label="名称"
                         min-width="100"
                         sortable="custom">
          <template slot-scope="scope">
            <span :class="[$style.qrName,{[$style.inacriveQr]:!canOpenQr(scope.row)}]" @click="openQr(scope.row)">
              <QrIcon :class="$style.qrIcon" :length="30" :qr="scope.row"></QrIcon>
              {{ scope.row.name }}
              <span v-if="isNew(scope.row)" class="tableTag greenTableTag">新</span>
            </span>
          </template>
        </el-table-column>

        <el-table-column column-key="createdAt"
                         label="创建时间"
                         min-width="80"
                         sortable="custom">
          <template slot-scope="scope">
            {{ formatEpochToMinute(scope.row.createdAt) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="handleQrDropdownCommand">
              <el-button :class="$style.dropdownButton"
                         icon="el-icon-more"
                         title="操作"
                         type="text"
                         @click.stop>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{command:'openChangeQrGroupDialog',parameters:scope.row}">
                  {{ changeGroupTitle }}
                </el-dropdown-item>

                <el-dropdown-item :command="{command:'deleteQr',parameters:scope.row}">
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-if="hasPagination"
                     :class="$style.pagination"
                     :current-page.sync="thePageIndex"
                     :page-size.sync="thePageSize"
                     :page-sizes="[10, 20, 30, 50, 100]"
                     :total="qrsTotalNumber"
                     layout="total,prev,pager,next,sizes"
                     @current-change="onPageIndexChanged"
                     @size-change="onPageSizeChanged">
      </el-pagination>
    </div>

    <DrawerBrowser :show.sync="showDrawerBrowser"
                   :src="drawerQrSrc"
                   :title="drawerQrName"
                   :wrapperClosableReferenceKey="'qrs_'+currentAppId">
    </DrawerBrowser>

    <AddQrDialog :groupId="currentGroupId"
                 :show.sync="addQrDialogVisible">
    </AddQrDialog>

    <ChangeQrsGroupDialog :groupData="groupData"
                          :qrs="tobeChangeGroupQrs"
                          :show.sync="changeQrsGroupDialogVisible"
                          :title="changeGroupTitle"
                          @qrsGroupChanged="onQrsGroupChanged">
    </ChangeQrsGroupDialog>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import groupApi from "@/common/api/group-api";
import {formatEpochToMinute, isNew, qrUrlWithPage} from "@/common/utils/common-utils";
import DrawerBrowser from '@/common/components/DrawerBrowser';
import AddQrDialog from '@/console/app-operation/group-manage/AddQrDialog';
import qrApi from "@/common/api/qr-api";
import QrIcon from '@/common/components/QrIcon';
import ChangeQrsGroupDialog from '@/console/app-operation/group-manage/ChangeQrsGroupDialog';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');
const groupManageStore = createNamespacedHelpers('GROUP_MANAGE_STORE');

export default {
  props: ['groupData'],

  components: {
    DrawerBrowser,
    AddQrDialog,
    QrIcon,
    ChangeQrsGroupDialog,
  },

  data() {
    return {
      changeQrsGroupDialogVisible: false,
      tobeChangeGroupQrs: [],
      addQrDialogVisible: false,
      showDrawerBrowser: false,
      qrsLoading: false,
      drawerQrName: '',
      drawerQrSrc: '',
    }
  },

  watch: {
    currentGroupId(groupId) {
      this.resetCurrentGroupQrs();

      if (!groupId) {
        return;
      }

      return this.fetchQrs();
    }
  },

  computed: {
    ...appOperationStore.mapGetters([
      'instanceDesignation',
      'groupDesignation',
      'currentAppId',
      'currentAppHomePageId'
    ]),

    ...groupManageStore.mapGetters([
      'currentGroupId',
      'listQrQuery',
      'currentGroupQrs',
      'isGroupActive',
      'batchSelectedQrs',
      'qrsTotalNumber',
      'qrsPageSize',
      'qrsPageIndex',
      'qrsSearch',
    ]),

    displayQrs() {
      return this.currentGroupQrs.filter(qr => qr.groupId === this.currentGroupId);
    },

    tableHeight() {
      return this.hasPagination ? 'calc(100% - 48px)' : 'calc(100%)';
    },

    hasPagination() {
      return this.qrsTotalNumber > this.qrsPageSize;
    },

    changeGroupTitle() {
      return this.groupDesignation === '分组' ? '移动到其他分组' : `移动到其他${this.groupDesignation}或分组`;
    },

    thePageIndex: {
      get() {
        return this.qrsPageIndex;
      },

      set(value) {
        this.updatePageIndex(value);
      }
    },

    thePageSize: {
      get() {
        return this.qrsPageSize;
      },

      set(value) {
        this.updatePageSize(value);
      }
    },

    theSearch: {
      get() {
        return this.qrsSearch;
      },

      set(value) {
        this.updateSearch(value);
      }
    },

  },

  methods: {
    ...groupManageStore.mapMutations([
      'resetCurrentGroupQrs',
      'loadCurrentGroupQrs',
      'updateBatchSelectedQrs',
      'updateSorting',
      'resetPageIndex',
      'clearCurrentGroupQrs',
      'resetBatchSelectedQrs',
      'deleteQrsById',
      'updatePageSize',
      'updatePageIndex',
      'updateSearch',
    ]),

    formatEpochToMinute,
    isNew,

    fetchQrs() {
      this.clearCurrentGroupQrs();
      this.qrsLoading = true;
      return groupApi.listGroupQrs(this.currentGroupId, this.listQrQuery).then((response) => {
        this.loadCurrentGroupQrs(response.data);
      }).finally(() => {
        this.qrsLoading = false;
      });
    },

    onSelectionChange(qrs) {
      this.updateBatchSelectedQrs(qrs);
    },

    onSortChange(sort) {
      let sortedBy = sort.order ? sort.column.columnKey : null;
      let ascSort = sort.order === 'ascending';
      this.updateSorting({sortedBy, ascSort});
      this.resetPageIndex();
      return this.fetchQrs();
    },

    openAddQrsDialog() {
      this.addQrDialogVisible = true;
    },

    canOpenQr(qr) {
      return qr.active && this.isGroupActive(qr.groupId);
    },

    openQr(qr) {
      if (this.canOpenQr(qr)) {
        this.drawerQrSrc = qrUrlWithPage(qr.plateId, this.currentAppHomePageId);
        this.drawerQrName = qr.name;
        this.showDrawerBrowser = true;
      }
    },

    onPageIndexChanged() {
      return this.fetchQrs();
    },

    onPageSizeChanged() {
      this.resetPageIndex();
      return this.fetchQrs();
    },

    doSearch() {
      this.resetPageIndex();
      return this.fetchQrs();
    },

    handleBatchCommand(command) {
      return this[command]();
    },

    batchChangeQrsGroup() {
      this.tobeChangeGroupQrs = this.batchSelectedQrs;
      this.changeQrsGroupDialogVisible = true;
    },

    batchDeleteQrs() {
      return this.$confirm(`确认删除所选${this.instanceDesignation}？`, '提示', {
        confirmButtonText: '是的，删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let command = {
          qrIds: this.batchSelectedQrs.map(q => q.id),
        };
        return qrApi.deleteQrs(command).then(() => {
          this.$message({
            type: 'success',
            message: `删除成功。`,
            center: true
          });
          this.resetBatchSelectedQrs();
          this.deleteQrsById(command.qrIds);
        })
      });
    },

    onQrsGroupChanged() {
      this.$refs.listTable.clearSelection();
    },

    handleQrDropdownCommand(command) {
      return this[command.command](command.parameters);
    },

    deleteQr(qr) {
      return this.$confirm(`确认删除【${qr.name}】？`, '提示', {
        confirmButtonText: '是的，删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return qrApi.deleteQr(qr.id).then(() => {
          this.$message({
            type: 'success',
            message: `删除成功。`,
            center: true
          });
          this.deleteQrsById([qr.id]);
        })
      });
    },

    openChangeQrGroupDialog(qr) {
      this.tobeChangeGroupQrs = [qr];
      this.changeQrsGroupDialogVisible = true;
    },
  }
}
</script>

<style lang="scss" module>
$titleBarHeight: 60px;

.wrapper {
  background-color: white;
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

.batchButton {
  font-weight: normal;
  margin-right: 15px;
}

.searchInput {
  width: 200px;
  margin-right: 15px;
}

.searchButton {
  color: $regularTextColor !important;
}

.addQrButton {
  font-size: 16px;
  padding: 7px;

  :global {
    .el-icon-plus:before {
      font-weight: 600;
    }
  }
}

.addQrButton:hover {
  background-color: rgba(0, 191, 255, 0.1);
}

.tableContainer {
  height: calc(100% - #{$titleBarHeight});
  padding-right: 15px;
  padding-left: 15px;
}

.theTable {
  :global {
    th {
      color: $primaryTextColor;
    }

    .el-table-column--selection .cell {
      text-align: center;
    }

    .el-table__empty-text {
      padding-bottom: 63px;
    }
  }
}

.qrName {
  color: $regularTextColor;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.inacriveQr {
  color: $secondaryTextColor;
  cursor: default;
}

.qrIcon {
  margin-right: 10px;
  flex-shrink: 0;
}

.loadingIcon {
  color: $secondaryTextColor;
  font-size: 16px
}


.pagination {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
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

</style>

<template>
  <div v-if="listLoaded" :class="$style.wrapper">
    <div :class="$style.opsBar">
      <div :class="$style.opsTitle">
        {{ instanceDesignation }}列表
        <HelpDocLinker url="//docs.mryqr.com/console-app-operation/qr-management/"></HelpDocLinker>
        <span v-if="templateOnly" :class="$style.statusIcon">
          <i class="el-icon-film" title="当前仅显示模板"></i>
        </span>
        <span v-if="inactiveOnly" :class="$style.statusIcon">
          <i :class="$style.inactiveIcon" class="el-icon-remove-outline" title="当前仅显示禁用状态"></i>
        </span>
        <span v-if="nearestPointEnabled" :class="$style.statusIcon">
          <i class="el-icon-place" title="按定位由近到远显示"></i>
        </span>
        <span v-if="startDate || endDate" :class="$style.statusIcon">
          <i class="el-icon-time" title="按创建时间范围过滤"></i>
        </span>
      </div>

      <div :class="$style.opsButtons">
        <BatchedQrsOperationButton></BatchedQrsOperationButton>

        <div v-if="shouldShowGroupSelect" :class="$style.marginLeft16">
          {{ groupDesignation }}:
          <QrGroupSelect :class="$style.groupSelect" :groups="selectableGroups"></QrGroupSelect>
        </div>

        <el-input v-model="theSearch"
                  :class="[$style.searchInput,$style.marginLeft16]"
                  :maxlength="50"
                  :spellcheck="false"
                  clearable
                  placeholder="搜索..."
                  size="medium"
                  @clear="doSearch"
                  @keyup.enter.native="doSearch">

          <el-button slot="append"
                     :class="$style.searchButton"
                     icon="el-icon-search"
                     type="primary"
                     @click="doSearch">
          </el-button>
        </el-input>

        <QrAddButton v-if="shouldShowQrAddButton"></QrAddButton>
      </div>
    </div>

    <QrListTable :key="tableKey" :height="tableHeight"></QrListTable>

    <el-pagination v-if="hasPagination"
                   :class="$style.pagination"
                   :current-page.sync="thePageIndex"
                   :page-size.sync="thePageSize"
                   :page-sizes="[10, 20, 30, 50, 100]"
                   :total="totalNumber"
                   layout="total,prev,pager,next,sizes"
                   @current-change="onPageIndexChanged"
                   @size-change="onPageSizeChanged">
    </el-pagination>
  </div>
</template>

<script>
import QrListTable from '@/console/app-operation/qrs/QrListTable';
import {createNamespacedHelpers, mapMutations} from 'vuex';
import QR_LIST_ACTIONS from "@/console/app-operation/qrs/store/qr-list-actions";
import BatchedQrsOperationButton from '@/console/app-operation/qrs/BatchedQrsOperationButton';
import QrGroupSelect from '@/console/app-operation/qrs/QrGroupSelect';
import QrAddButton from '@/console/app-operation/qrs/QrAddButton';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');
const qrListStore = createNamespacedHelpers('QR_LIST_STORE');

export default {
  props: {
    groupId: {
      type: String,
    },

    selectableGroups: {
      type: Array,
    },
  },

  components: {
    QrListTable,
    BatchedQrsOperationButton,
    QrGroupSelect,
    QrAddButton,
  },

  data() {
    return {
      listLoaded: false,
    }
  },

  created() {
    document.addEventListener('visibilitychange', this.onVisible);

    if (this.groupDirty) {
      this.refreshConsoleHomePage();
      return;
    }

    this.init();
    return this.refreshQrList().then(() => {
      this.listLoaded = true;
    });
  },


  beforeDestroy() {
    document.removeEventListener('visibilitychange', this.onVisible);
  },

  computed: {
    ...appOperationStore.mapState(['groupDirty']),
    ...qrListStore.mapState([
      'totalNumber',
      'pageIndex',
      'pageSize',
      'search',
      'templateOnly',
      'inactiveOnly',
      'nearestPointEnabled',
      'tableKey',
      'startDate',
      'endDate',
    ]),

    ...appOperationStore.mapGetters([
      'currentAppId',
      'viewableGroupIds',
      'managableGroupIds',
      'canManageGroup',
      'groupDesignation',
      'instanceDesignation',
    ]),

    derivedGroupId() {
      if (this.viewableGroupIds.length === 1 && this.groupId === 'ALL') {
        return this.viewableGroupIds[0];
      }
      return this.groupId;
    },

    shouldShowGroupSelect() {
      return this.derivedGroupId === 'ALL';
    },

    shouldShowQrAddButton() {
      if (this.groupId === 'ALL') {
        return this.managableGroupIds.length > 0;
      } else {
        return this.canManageGroup(this.groupId);
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
    },

    theSearch: {
      get() {
        return this.search;
      },

      set(value) {
        this.updateSearch(value);
      }
    },

    hasPagination() {
      return this.totalNumber > this.pageSize;
    },

    tableHeight() {
      if (this.hasPagination) {
        return window.innerHeight - 60 - 24 - 60 - 5 - 48;
      } else {
        return window.innerHeight - 60 - 24 - 60 - 5 - 24;
      }
    },
  },

  methods: {
    ...mapMutations(['refreshConsoleHomePage']),
    ...qrListStore.mapActions([
      QR_LIST_ACTIONS.LIST_MY_VIEWABLE_QRS,
      QR_LIST_ACTIONS.FETCH_WORKING_QR,
    ]),

    ...qrListStore.mapMutations([
      'resetState',
      'initState',
      'resetPageIndex',
      'updatePageIndex',
      'updatePageSize',
      'updateSearch',
      'goToTableTop',
    ]),

    init() {
      this.resetState();
      this.initState({
        appId: this.currentAppId,
        groupId: this.derivedGroupId,
      });
    },

    fetchQrList() {
      return this[QR_LIST_ACTIONS.LIST_MY_VIEWABLE_QRS]();
    },

    refreshQrList() {
      return this.fetchQrList().then(() => {
        this.goToTableTop();
      });
    },

    doSearch() {
      this.resetPageIndex();
      return this.refreshQrList();
    },

    onPageIndexChanged() {
      return this.refreshQrList();
    },

    onPageSizeChanged() {
      this.resetPageIndex();
      return this.refreshQrList();
    },

    onVisible() {
      if (document.visibilityState === 'visible') {
        this[QR_LIST_ACTIONS.FETCH_WORKING_QR]();
      }
    },
  }
}
</script>

<style lang="scss" module>
$content-margin: 24px;
$ops-bar-height: 60px;
$ops-bar-margin-bottom: 5px;
$pagination-height: 48px;

.wrapper {
  height: calc(100vh - #{$consoleTopBarHeight} - #{$content-margin});
  margin: $content-margin;
}

.groupSelect {
  width: 200px;
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

.opsTitle {
  font-size: 15px;
  font-weight: 500;
}

.statusIcon {
  color: $oppositeThemeColor;
  font-weight: normal;
}

.inactiveIcon {
  color: $rejectRed;
}

.opsButtons {
  display: flex;
  align-items: center;
}

.marginLeft16 {
  margin-left: 16px;
}

.searchInput {
  width: 250px;
}

.searchButton {
  color: $regularTextColor !important;
}

.pagination {
  height: $pagination-height;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>

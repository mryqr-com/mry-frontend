<template>
  <div v-if="listLoaded" :class="$style.wrapper">
    <div :class="$style.opsBar">
      <div :class="$style.theTitle">
        {{ operationMenuNameOf(type, pageId) }}
        <HelpDocLinker url="//docs.mryqr.com/console-app-operation/operation-menu/"></HelpDocLinker>

        <span v-if="startDate || endDate" :class="$style.statusIcon">
          <i :title="`按${submitAtDesignation}范围过滤`" class="el-icon-time"></i>
        </span>
      </div>

      <div :class="$style.opsButtons">
        <div v-if="shouldShowGroupSelect" :class="$style.marginLeft16">
          {{ groupDesignation }}:
          <SubmissionGroupSelect :class="$style.groupSelect" :groups="selectableGroups"></SubmissionGroupSelect>
        </div>

        <div v-if="shouldShowMemberSelect" :class="$style.marginLeft16">
          {{ submitterDesignation }}:
          <SubmissionSubmitterSelect :class="$style.width150"></SubmissionSubmitterSelect>
        </div>

        <div v-if="shouldShowPageSelect" :class="$style.marginLeft16">
          表单:
          <SubmissionPageSelect :class="$style.width150" :pages="selectablePages"></SubmissionPageSelect>
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
      </div>
    </div>

    <SubmissionListTable :key="tableKey" :height="tableHeight"></SubmissionListTable>

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
import {createNamespacedHelpers, mapMutations} from 'vuex';
import SUBMISSION_LIST_ACTIONS from "@/console/app-operation/submissions/store/submission-list-actions";
import SubmissionGroupSelect from '@/console/app-operation/submissions/SubmissionGroupSelect';
import SubmissionSubmitterSelect from '@/console/app-operation/submissions/SubmissionSubmitterSelect';
import SubmissionPageSelect from '@/console/app-operation/submissions/SubmissionPageSelect';
import SubmissionListTable from '@/console/app-operation/submissions/SubmissionListTable';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');
const submissionListStore = createNamespacedHelpers('SUBMISSION_LIST_STORE');

export default {
  props: {
    selectableGroups: {
      type: Array,
    },

    selectablePages: {
      type: Array,
    },

    groupId: {
      type: String,
    },

    qrId: {
      type: String,
    },

    pageId: {
      type: String,
    },

    type: {
      type: String,
      required: true
    },
  },

  components: {
    SubmissionGroupSelect,
    SubmissionSubmitterSelect,
    SubmissionPageSelect,
    SubmissionListTable
  },

  data() {
    return {
      listLoaded: false,
    }
  },

  created() {
    document.addEventListener('visibilitychange', this.refetchActiveSubmission);

    if (this.groupDirty) {
      this.refreshConsoleHomePage();
      return;
    }

    this.init();
    return this.refreshSubmissionList().then(() => {
      this.listLoaded = true;
    });
  },

  beforeDestroy() {
    document.removeEventListener('visibilitychange', this.refetchActiveSubmission);
  },

  computed: {
    ...appOperationStore.mapState(['groupDirty']),
    ...appOperationStore.mapGetters([
      'currentAppId',
      'operationMenuNameOf',
      'viewableGroupIds',
      'viewablePageIds',
      'managableGroupIds',
      'managablePageIds',
      'approvableGroupIds',
      'approvablePageIds',
      'groupDesignation',
      'submitterDesignationOf',
      'submitAtDesignationOf',
    ]),

    ...submissionListStore.mapState([
      'totalNumber',
      'pageIndex',
      'pageSize',
      'search',
      'tableKey',
      'startDate',
      'endDate',
    ]),

    submitterDesignation() {
      return this.submitterDesignationOf(this.pageId);
    },

    submitAtDesignation() {
      return this.submitAtDesignationOf(this.pageId);
    },

    shouldShowGroupSelect() {
      return this.qrId ? false : this.derivedGroupId === 'ALL';
    },

    shouldShowMemberSelect() {
      return this.type !== 'SUBMITTER_SUBMISSION';
    },

    shouldShowPageSelect() {
      return this.derivedPageId === 'ALL';
    },

    derivedGroupId() {//如果只有一个可看的group，则直接设置为该group
      switch (this.type) {
        case 'SUBMITTER_SUBMISSION': {
          if (this.viewableGroupIds.length === 1 && this.groupId === 'ALL') {
            return this.viewableGroupIds[0];
          }
          return this.groupId;
        }

        case 'ALL_SUBMIT_HISTORY': {
          if (this.managableGroupIds.length === 1 && this.groupId === 'ALL') {
            return this.managableGroupIds[0];
          }
          return this.groupId;
        }

        case 'TO_BE_APPROVED': {
          if (this.approvableGroupIds.length === 1 && this.groupId === 'ALL') {
            return this.approvableGroupIds[0];
          }
          return this.groupId;
        }
      }
    },

    derivedPageId() {//如果只有一个可看page，则直接设置为该page
      switch (this.type) {
        case 'SUBMITTER_SUBMISSION': {
          if (this.viewablePageIds.length === 1 && this.pageId === 'ALL') {
            return this.viewablePageIds[0];
          }
          return this.pageId;
        }

        case 'ALL_SUBMIT_HISTORY': {
          if (this.managablePageIds.length === 1 && this.pageId === 'ALL') {
            return this.managablePageIds[0];
          }
          return this.pageId;
        }

        case 'TO_BE_APPROVED': {
          if (this.approvablePageIds.length === 1 && this.pageId === 'ALL') {
            return this.approvablePageIds[0];
          }
          return this.pageId;
        }
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
  },

  methods: {
    ...mapMutations(['refreshConsoleHomePage']),
    ...submissionListStore.mapActions([
      SUBMISSION_LIST_ACTIONS.LIST_SUBMISSIONS,
      SUBMISSION_LIST_ACTIONS.RE_FETCH_ACTIVE_SUBMISSION,
    ]),

    ...submissionListStore.mapMutations([
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
        qrId: this.qrId,
        pageId: this.derivedPageId,
        type: this.type
      });
    },

    listSubmissions() {
      return this[SUBMISSION_LIST_ACTIONS.LIST_SUBMISSIONS]();
    },

    refreshSubmissionList() {
      return this.listSubmissions().then(() => {
        this.goToTableTop();
      });
    },

    onPageIndexChanged() {
      return this.refreshSubmissionList();
    },

    onPageSizeChanged() {
      this.resetPageIndex();
      return this.refreshSubmissionList();
    },

    doSearch() {
      this.resetPageIndex();
      return this.refreshSubmissionList();
    },

    refetchActiveSubmission() {
      if (document.visibilityState === 'visible') {
        this[SUBMISSION_LIST_ACTIONS.RE_FETCH_ACTIVE_SUBMISSION]();
      }
    }
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

.statusIcon {
  color: $oppositeThemeColor;
  font-weight: normal;
}

.marginLeft16 {
  margin-left: 16px;
}

.groupSelect {
  width: 200px;
}

.width150 {
  width: 150px;
}

.pagination {
  height: $pagination-height;
  display: flex;
  align-items: center;
  justify-content: center;
}

.searchInput {
  width: 250px;
}

.searchButton {
  color: $regularTextColor !important;
}

</style>

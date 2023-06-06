<template>
  <div :class="$style.wrapper">
    <template v-if="isAssignmentAllowed">
      <template v-if="listLoaded">
        <div :class="$style.opsBar">
          <div :class="$style.theTitle">
            任务列表
            <HelpDocLinker url="//docs.mryqr.com/collaboration/assignments/"></HelpDocLinker>
          </div>
          <div :class="$style.opsButtons">
            <div v-if="shouldShowGroupSelect" :class="$style.marginLeft20">
              {{ groupDesignation }}:
              <AssignmentGroupSelect :class="$style.width180" :groups="selectableGroups"></AssignmentGroupSelect>
            </div>

            <div :class="$style.marginLeft20">
              任务 :
              <AssignmentPlanSelect :assignmentPlans="selectableAssignmentPlans"
                                    :class="$style.width180">
              </AssignmentPlanSelect>
            </div>

            <div :class="$style.marginLeft20">
              执行人 :
              <AssignmentOperatorSelect :class="$style.width180"></AssignmentOperatorSelect>
            </div>

            <div :class="$style.marginLeft20">
              状态 :
              <AssignmentStatusSelect :class="$style.width180"></AssignmentStatusSelect>
            </div>
          </div>
        </div>

        <AssignmentListTable :height="tableHeight"></AssignmentListTable>

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
      </template>
    </template>
    <div v-else :class="$style.packageWarning">
      <el-alert :closable="false"
                effect="dark"
                type="warning">
                <span slot="title">{{ planWarningText }}
                  <template v-if="isTenantAdmin">如需使用请前往
                     <router-link :class="$style.purchaseLink" :to="{name:'purchase-packages'}">
                        套餐购买页面
                    </router-link>完成套餐升级或续费。
                  </template>
                  <template v-else>如需使用请联系系统管理员完成套餐升级或续费。</template>
                </span>
      </el-alert>
    </div>
  </div>
</template>

<script>
import {createNamespacedHelpers, mapGetters, mapMutations} from 'vuex';
import AssignmentGroupSelect from '@/console/app-operation/assignment/assignments/AssignmentGroupSelect';
import AssignmentPlanSelect from '@/console/app-operation/assignment/assignments/AssignmentPlanSelect';
import AssignmentStatusSelect from '@/console/app-operation/assignment/assignments/AssignmentStatusSelect';
import AssignmentOperatorSelect from '@/console/app-operation/assignment/assignments/AssignmentOperatorSelect';
import ASSIGNMENT_LIST_ACTIONS from "@/console/app-operation/assignment/assignments/store/assignment-list-actions";
import AssignmentListTable from '@/console/app-operation/assignment/assignments/AssignmentListTable';
import assignmentPlanApi from '@/common/api/assignment-plan-api';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');
const assignmentListStore = createNamespacedHelpers('ASSIGNMENT_LIST_STORE');

export default {
  props: {
    groupId: {
      type: String,
    },

    initAssignmentPlanId: {
      type: String,
    },
  },

  components: {
    AssignmentGroupSelect,
    AssignmentPlanSelect,
    AssignmentStatusSelect,
    AssignmentOperatorSelect,
    AssignmentListTable,
  },

  data() {
    return {
      listLoaded: false,
      assignmentPlans: [],
    }
  },

  created() {
    if (this.groupDirty) {
      this.refreshConsoleHomePage();
      return;
    }

    if (!this.isAssignmentAllowed) {
      return;
    }

    if (this.groupId === 'ALL') {
      return assignmentPlanApi.listAssignmentPlanSummaries(this.currentAppId).then(response => {
        this.assignmentPlans = response.data;
        this.init();

        return this.refreshAssignmentList().then(() => {
          this.listLoaded = true;
        });
      });
    } else {
      return assignmentPlanApi.listAssignmentPlanSummariesForGroup(this.groupId).then(response => {
        this.assignmentPlans = response.data;
        this.init();

        return this.refreshAssignmentList().then(() => {
          this.listLoaded = true;
        });
      });
    }
  },

  computed: {
    ...mapGetters([
      'currentPlanName',
      'isCurrentPlanExpired',
      'isTenantAdmin',
      'isAssignmentAllowed',
    ]),

    ...appOperationStore.mapState(['groupDirty']),
    ...appOperationStore.mapGetters([
      'currentAppId',
      'managableGroupIds',
      'allableManagableGroups',
      'groupDesignation',
    ]),

    ...assignmentListStore.mapState([
      'totalNumber',
      'pageIndex',
      'pageSize',
    ]),

    derivedGroupId() {
      if (this.managableGroupIds.length === 1 && this.groupId === 'ALL') {
        return this.managableGroupIds[0];
      }
      return this.groupId;
    },

    shouldShowGroupSelect() {
      return this.derivedGroupId === 'ALL';
    },

    selectableGroups() {
      return this.allableManagableGroups;
    },

    derivedInitAssignmentPlanId() {
      if (!this.initAssignmentPlanId) {
        return 'ALL';
      }

      if (this.assignmentPlans.some(plan => plan.id === this.initAssignmentPlanId)) {
        return this.initAssignmentPlanId;
      }

      return 'ALL';
    },

    selectableAssignmentPlans() {
      return [...[{id: 'ALL', name: '全部'}], ...this.assignmentPlans];
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

    planWarningText() {
      if (this.isCurrentPlanExpired) {
        return `您当前的${this.currentPlanName}套餐已过期，有效套餐已降为免费版，无法使用任务管理功能；`;
      }

      return `您当前是${this.currentPlanName}套餐，无法使用任务管理功能；`
    },
  },

  methods: {
    ...assignmentListStore.mapActions([
      ASSIGNMENT_LIST_ACTIONS.LIST_ASSIGNMENTS
    ]),

    ...mapMutations(['refreshConsoleHomePage']),
    ...assignmentListStore.mapMutations([
      'resetState',
      'initState',
      'goToTableTop',
      'resetPageIndex',
      'updatePageIndex',
      'updatePageSize',
    ]),

    init() {
      this.resetState();
      this.initState({
        appId: this.currentAppId,
        originGroupId: this.groupId,
        groupId: this.derivedGroupId,
        assignmentPlanId: this.derivedInitAssignmentPlanId,
      });
    },

    onPageIndexChanged() {
      return this.refreshAssignmentList();
    },

    onPageSizeChanged() {
      this.resetPageIndex();
      return this.refreshAssignmentList();
    },

    refreshAssignmentList() {
      return this[ASSIGNMENT_LIST_ACTIONS.LIST_ASSIGNMENTS]().then(() => {
        this.goToTableTop();
      });
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

.marginLeft20 {
  margin-left: 20px;
}

.width180 {
  width: 180px;
}

.opsButtons {
  display: flex;
  align-items: center;
}

.pagination {
  height: $pagination-height;
  display: flex;
  align-items: center;
  justify-content: center;
}

.packageWarning {
  margin-top: 24px;
}

.purchaseLink {
  color: white;
  text-decoration: underline;
}

.purchaseLink:visited {
  color: white;
}

</style>

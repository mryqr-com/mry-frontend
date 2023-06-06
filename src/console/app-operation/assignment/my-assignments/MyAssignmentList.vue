<template>
  <div :class="$style.wrapper">
    <template v-if="isAssignmentAllowed">
      <template v-if="listLoaded">
        <div :class="$style.opsBar">
          <div :class="$style.theTitle">
            我的任务
            <HelpDocLinker url="//docs.mryqr.com/collaboration/assignments/"></HelpDocLinker>
          </div>
          <div :class="$style.opsButtons">
            <div v-if="groupId ==='ALL'" :class="$style.marginLeft20">
              {{ groupDesignation }}:
              <MyAssignmentGroupSelect :class="$style.width180"></MyAssignmentGroupSelect>
            </div>

            <div :class="$style.marginLeft20">
              任务状态 :
              <MyAssignmentStatusSelect :class="$style.width180"></MyAssignmentStatusSelect>
            </div>
          </div>
        </div>

        <MyAssignmentListTable :height="tableHeight"></MyAssignmentListTable>

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
import MY_ASSIGNMENT_LIST_ACTIONS
  from "@/console/app-operation/assignment/my-assignments/store/my-assignment-list-actions";
import MyAssignmentListTable from '@/console/app-operation/assignment/my-assignments/MyAssignmentListTable';
import MyAssignmentStatusSelect from '@/console/app-operation/assignment/my-assignments/MyAssignmentStatusSelect';
import MyAssignmentGroupSelect from '@/console/app-operation/assignment/my-assignments/MyAssignmentGroupSelect';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');
const myAssignmentListStore = createNamespacedHelpers('MY_ASSIGNMENT_LIST_STORE');

export default {
  props: {
    groupId: {
      type: String,
    },
  },

  components: {
    MyAssignmentListTable,
    MyAssignmentGroupSelect,
    MyAssignmentStatusSelect,
  },

  data() {
    return {
      listLoaded: false,
    }
  },

  created() {
    if (this.groupDirty) {
      this.refreshConsoleHomePage();
      return;
    }

    this.init();

    if (!this.isAssignmentAllowed) {
      return;
    }

    return this.refreshMyAssignmentList().then(() => {
      this.listLoaded = true;
    });
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
      'groupDesignation',
    ]),

    ...myAssignmentListStore.mapState([
      'totalNumber',
      'pageIndex',
      'pageSize',
    ]),

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
    ...myAssignmentListStore.mapActions([
      MY_ASSIGNMENT_LIST_ACTIONS.LIST_MY_ASSIGNMENTS
    ]),

    ...mapMutations(['refreshConsoleHomePage']),
    ...myAssignmentListStore.mapMutations([
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
        groupId: this.groupId,
        originGroupId: this.groupId,
      });
    },

    onPageIndexChanged() {
      return this.refreshMyAssignmentList();
    },

    onPageSizeChanged() {
      this.resetPageIndex();
      return this.refreshMyAssignmentList();
    },

    refreshMyAssignmentList() {
      return this[MY_ASSIGNMENT_LIST_ACTIONS.LIST_MY_ASSIGNMENTS]().then(() => {
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

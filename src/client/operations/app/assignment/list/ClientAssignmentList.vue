<template>
  <div :class="$style.wrapper">
    <template v-if="isAssignmentAllowed">
      <template v-if=" initialised">
        <header :class="$style.headerBar">
          <div :class="$style.iconButtonContainer">
            <button :class="$style.headerButton"
                    class="majoricon i-left plainButton"
                    title="返回上级"
                    @click="goToUpperLink">
            </button>
          </div>

          <section :class="$style.statusSection">
            <el-select v-model="theStatus"
                       :class="$style.statusInput"
                       size="small"
                       @change="onStatusChanged">
              <el-option v-for="status in allStatuses"
                         :key="status.key"
                         :label="status.name"
                         :value="status.key">
              </el-option>
            </el-select>
          </section>

          <div :class="$style.iconButtonContainer">
            <button :class="[$style.headerButton,{[$style.hasFilterButton]:hasFilter}]"
                    class="majoricon i-filter plainButton"
                    title="筛选"
                    @click="openFilterDrawer">
            </button>
          </div>
        </header>

        <main :class="$style.mainContent">
          <div v-for="assignment in assignments"
               :class="$style.assignmentContainer"
               :style="assignmentStyle(assignment)">
            <section :class="$style.assignmentContentSection" @click="goToAssignmentQrs(assignment)">
              <div :class="$style.assignmentName">{{ assignment.name }}</div>
              <div :class="$style.assignmentContentContainer">
                <div :class="$style.fieldRow">
                  <div :class="$style.fieldName"> {{ groupDesignation }}：</div>
                  <span :class="$style.fieldValue">{{ groupNameOf(assignment.groupId) }}</span>
                </div>

                <div :class="$style.fieldRow">
                  <div :class="$style.fieldName"> 周期：</div>
                  <span :class="$style.fieldValue">
                    {{ formatEpochToMinute(assignment.startAt) }} 至 {{ formatEpochToMinute(assignment.expireAt) }}
                  </span>
                </div>

                <div :class="$style.fieldRow">
                  <div :class="$style.fieldName"> 完成度：</div>
                  <span :class="$style.fieldValue">
                    {{ percentage(assignment) }}%（{{ assignment.finishedQrCount }}/{{ assignment.allQrCount }}）
                  </span>
                </div>

                <div :class="$style.fieldRow">
                  <div :class="$style.fieldName"> 执行人：</div>
                  <span :class="$style.fieldValue">{{ assignment.operatorNames.join(', ') }}</span>
                </div>

                <div :class="$style.fieldRow">
                  <div :class="$style.fieldName"> 任务状态：</div>
                  <span :class="$style.fieldValue" :style="statusStyle(assignment)">
                    {{ statusTextOf(assignment.status) }}
                  </span>
                </div>
              </div>
            </section>

            <section :class="$style.assignmentDropdownSection">
              <ClientAssignmentOperationButtons :assignment="assignment"></ClientAssignmentOperationButtons>
            </section>
          </div>

          <InfiniteLoading :key="infiniteKey"
                           spinner="spiral"
                           @infinite="infiniteHandler">
            <div slot="no-more" :class="$style.infiniteMessage">
              <span v-if="assignments.length > 20">没有了</span>
            </div>
            <div slot="no-results" :class="$style.infiniteMessage">无数据</div>
          </InfiniteLoading>
        </main>

        <ClientAssignmentListFilterDrawer :assignmentPlans="selectableAssignmentPlans"
                                          :shouldShowGroupSelect="shouldShowGroupSelect"
                                          :show.sync="filterDrawerVisible">
        </ClientAssignmentListFilterDrawer>
      </template>
    </template>

    <template v-else>
      <div :class="$style.packageNotAllowedText">
        您当前的套餐版本过低或者已经过期，无法使用任务管理功能，请联系您的系统管理员在码如云官网进行套餐升级或续费。
        <el-button :class="$style.backButton" size="medium" type="primary" @click="goToUpperLink">返回</el-button>
      </div>
    </template>
  </div>
</template>

<script>
import {createNamespacedHelpers, mapGetters} from "vuex";
import ClientAssignmentListFilterDrawer from '@/client/operations/app/assignment/list/ClientAssignmentListFilterDrawer';
import assignmentStatuses from "@/common/utils/assignment-statuses";
import assignmentPlanApi from "@/common/api/assignment-plan-api";
import ACTIONS from '@/client/operations/app/assignment/list/store/client-assignment-list-actions';
import {formatEpochToMinute} from "@/common/utils/common-utils";
import ClientAssignmentOperationButtons from '@/client/operations/app/assignment/list/ClientAssignmentOperationButtons';

const clientAppOperationStore = createNamespacedHelpers('CLIENT_APP_OPERATION_STORE');
const clientAssignmentListStore = createNamespacedHelpers('CLIENT_ASSIGNMENT_LIST_STORE');

export default {
  props: {
    groupId: {
      type: String,
      required: true,
    },

    upperLinkName: {
      type: String,
      required: true,
    },
  },

  components: {
    ClientAssignmentOperationButtons,
    ClientAssignmentListFilterDrawer,
    InfiniteLoading: () => import(/* webpackChunkName: "infinite-loading" */ 'vue-infinite-loading'),
  },

  data() {
    return {
      initialised: false,
      filterDrawerVisible: false,
      assignmentPlans: [],
    }
  },

  created() {
    if (this.isAssignmentAllowed) {
      if (this.groupId === 'ALL') {
        return assignmentPlanApi.listAssignmentPlanSummaries(this.appId).then(response => {
          this.assignmentPlans = response.data;
          this.init();
          this.initialised = true;
        });
      } else {
        return assignmentPlanApi.listAssignmentPlanSummariesForGroup(this.groupId).then(response => {
          this.assignmentPlans = response.data;
          this.init();
          this.initialised = true;
        });
      }
    }
  },

  computed: {
    ...mapGetters([
      'isAssignmentAllowed',
    ]),

    ...clientAppOperationStore.mapGetters([
      'appId',
      'managableGroupIds',
      'groupDesignation',
      'groupNameOf',
    ]),

    ...clientAssignmentListStore.mapState([
      'status',
      'assignments',
      'infiniteKey',
      'originGroupId',
    ]),

    ...clientAssignmentListStore.mapGetters(['hasFilter']),

    derivedGroupId() {
      if (this.managableGroupIds.length === 1 && this.groupId === 'ALL') {
        return this.managableGroupIds[0];
      }
      return this.groupId;
    },

    shouldShowGroupSelect() {
      return this.derivedGroupId === 'ALL';
    },

    selectableAssignmentPlans() {
      return [...[{id: 'ALL', name: '全部'}], ...this.assignmentPlans];
    },

    allStatuses() {
      return [...[{key: 'ALL', name: '全部状态'}], ...assignmentStatuses];
    },

    theStatus: {
      get() {
        return this.status;
      },

      set(value) {
        return this.updateStatus(value);
      }
    }
  },

  methods: {
    ...clientAssignmentListStore.mapActions([
      ACTIONS.LIST_ASSIGNMENTS,
    ]),

    ...clientAssignmentListStore.mapMutations([
      'resetState',
      'initState',
      'updateStatus',
      'resetInfinite',
    ]),

    formatEpochToMinute: formatEpochToMinute,

    init() {
      this.resetState();
      this.initState({
        appId: this.appId,
        originGroupId: this.groupId,
        groupId: this.derivedGroupId,
      });
    },

    goToUpperLink() {
      this.$router.push({name: this.upperLinkName});
    },

    goToAssignmentQrs(assignment) {
      if (this.originGroupId === 'ALL') {
        this.$router.push({name: 'client-assignment-qr-list', params: {assignmentId: assignment.id}});
      } else {
        this.$router.push({
          name: 'client-group-assignment-qr-list',
          params: {groupId: this.originGroupId, assignmentId: assignment.id}
        });
      }
    },

    onStatusChanged() {
      this.resetInfinite();
    },

    statusColorOf(status) {
      return assignmentStatuses.find(stat => stat.key === status).color;
    },

    statusTextOf(status) {
      return assignmentStatuses.find(stat => stat.key === status).name;
    },

    assignmentStyle(assignment) {
      return {
        borderLeftColor: this.statusColorOf(assignment.status),
      }
    },

    statusStyle(assignment) {
      return {
        color: this.statusColorOf(assignment.status),
        fontWeight: 500,
      }
    },

    percentage(assignment) {
      return Math.floor(assignment.finishedQrCount / assignment.allQrCount * 100);
    },

    infiniteHandler(infiniteState) {
      return this[ACTIONS.LIST_ASSIGNMENTS](infiniteState);
    },

    openFilterDrawer() {
      this.filterDrawerVisible = true;
    },

  }
}
</script>

<style lang="scss" module>
.wrapper {
  height: 100%;
  overflow-y: auto;
}

.headerBar {
  height: $clientTopBarHeight;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: $clientPageZIndex + 1;
  background-color: white;
  display: flex;
  align-items: center;
  box-shadow: $lightShadow;
}

.headerButton {
  flex-shrink: 0;
  flex-grow: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: $clientIconButtonLength;
  height: $clientIconButtonLength;
  font-size: 20px;
  color: $regularTextColor;
}

.statusSection {
  flex-shrink: 1;
  flex-grow: 1;
  margin-left: 20px;
  margin-right: 10px;
}

.statusInput {
  width: 100%;
}

.iconButtonContainer {
  flex-shrink: 0;
  flex-grow: 0;
  padding: 10px;
}

.hasFilterButton:before {
  color: $oppositeThemeColor;
}

.mainContent {
  background-color: $primaryBackgroundColor;
  position: relative;
  z-index: $clientPageZIndex;
  margin-top: $clientTopBarHeight;
  padding: 12px 10px;
  height: calc(100vh - #{$clientTopBarHeight});
  overflow-y: auto;
}

.assignmentContainer {
  background-color: white;
  margin-bottom: 12px;
  padding: 10px;
  min-height: 80px;
  display: flex;
  border-left: 4px solid white;
}

.assignmentContentSection {
  flex-grow: 1;
  margin-right: 5px;
  cursor: pointer;
}

.assignmentName {
  font-weight: 500;
  margin-bottom: 10px;
  margin-top: 5px;
  color: $primaryTextColor;
}

.assignmentContentContainer {
  font-size: 13px;
  color: #b0b5bd;
}

.fieldRow {
  margin-bottom: 5px;
  line-height: 1.3em;
  display: flex;
}

.fieldRow:last-child {
  margin-bottom: 0;
}

.fieldName {
  width: 80px;
  overflow: hidden;
  flex-shrink: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.fieldValue {
  flex-grow: 1;
  word-break: break-all;
  color: $secondaryTextColor;
}

.assignmentDropdownSection {

}

.infiniteMessage {
  padding-bottom: 15px;
}

.packageNotAllowedText {
  padding: 15px;
  line-height: 1.8em;
  margin-top: 30vh;
}

.backButton {
  display: block;
  width: $pageButtonWidth;
  margin-left: auto;
  margin-right: auto;
  margin-top: 36px;
}

@media (min-width: $mobileScreenBreakpoint), print {
  .mainContent {
    padding: 15px 10px;
  }

  .assignmentContainer {
    margin-bottom: 15px;
  }

  .fieldName {
    width: 100px;
  }
}

</style>

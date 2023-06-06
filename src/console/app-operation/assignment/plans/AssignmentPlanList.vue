<template>
  <div :class="$style.wrapper">
    <template v-if="isAssignmentAllowed">
      <template v-if="listLoaded">
        <div :class="$style.opsBar">
          <div :class="$style.theTitle">
            任务计划
            <HelpDocLinker url="//docs.mryqr.com/collaboration/assignments/"></HelpDocLinker>
          </div>
          <AssignmentPlanAddButton v-if="isAppLevel"></AssignmentPlanAddButton>
        </div>

        <el-table :key="listKey"
                  ref="theTable"
                  :class="$style.theTable"
                  :data="assignmentPlans"
                  :height="tableHeight"
                  highlight-current-row>
          <el-table-column class-name="firstColumn"
                           column-key="name"
                           label="任务名称"
                           min-width="100">
            <template slot-scope="scope">
          <span :class="{[$style.nameClickable]:scope.row.active}" @click="onNameClicked(scope.row)">
            <span :class="[$style.theName,{[$style.nameHoverable]:scope.row.active}]">
              {{ scope.row.name }}
            </span>
            <span v-if="isNew(scope.row)" :class="$style.newIcon">新!</span>
          </span>
            </template>
          </el-table-column>

          <el-table-column column-key="frequency" label="频率">
            <template slot-scope="scope">
              {{ frequencyOf(scope.row.setting.frequency) }}
            </template>
          </el-table-column>

          <el-table-column column-key="pageId" label="表单页面">
            <template slot-scope="scope">
              {{ pageNameOf(scope.row.setting.pageId) }}
            </template>
          </el-table-column>

          <el-table-column v-if="isGroupLevel"
                           :show-overflow-tooltip="true"
                           column-key="operators"
                           label="任务执行人">
            <template slot-scope="scope">
              <span v-if="scope.row.operatorNames.length > 0">{{ scope.row.operatorNames.join(', ') }}</span>
              <span v-else :class="$style.noOperators">未设置</span>
            </template>
          </el-table-column>

          <el-table-column v-if="isAppLevel"
                           :show-overflow-tooltip="true"
                           column-key="active"
                           label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.active" :class="$style.activatedText">启用</span>
              <span v-else :class="$style.deactivatedText">禁用</span>
            </template>
          </el-table-column>

          <el-table-column column-key="frequency" label="下次任务开始时间">
            <template slot-scope="scope">
              {{ scope.row.active ? formatEpochToMinute(scope.row.nextAssignmentStartAt) : '无' }}
            </template>
          </el-table-column>

          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <AssignmentPlanOperationButtons :assignmentPlan="scope.row"></AssignmentPlanOperationButtons>
            </template>
          </el-table-column>
        </el-table>
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

import ACTIONS from '@/console/app-operation/assignment/plans/store/assignment-plan-list-actions';
import AssignmentPlanAddButton from '@/console/app-operation/assignment/plans/AssignmentPlanAddButton';
import {formatEpochToMinute, isNew} from '@/common/utils/common-utils';
import frequencies from '@/common/utils/assignment-plan-frequencies';
import AssignmentPlanOperationButtons from '@/console/app-operation/assignment/plans/AssignmentPlanOperationButtons';

const assignmentPlanStore = createNamespacedHelpers('ASSIGNMENT_PLAN_STORE');
const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: {
    groupId: {
      type: String,
    },
  },

  components: {
    AssignmentPlanAddButton,
    AssignmentPlanOperationButtons,
  },

  data() {
    return {
      listLoaded: false
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

    return this[ACTIONS.INIT]({appId: this.currentAppId, groupId: this.groupId}).then(() => {
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

    ...appOperationStore.mapGetters(['currentAppId', 'pageNameOf']),
    ...appOperationStore.mapState(['groupDirty']),
    ...assignmentPlanStore.mapState(['assignmentPlans', 'listKey']),
    ...assignmentPlanStore.mapGetters(['isAppLevel', 'isGroupLevel']),

    tableHeight() {
      return window.innerHeight - 60 - 24 - 60 - 5 - 24;
    },

    planWarningText() {
      if (this.isCurrentPlanExpired) {
        return `您当前的${this.currentPlanName}套餐已过期，有效套餐已降为免费版，无法使用任务管理功能；`;
      }

      return `您当前是${this.currentPlanName}套餐，无法使用任务管理功能；`
    }
  },

  methods: {
    formatEpochToMinute,
    isNew: isNew,
    ...mapMutations(['refreshConsoleHomePage']),
    ...assignmentPlanStore.mapActions([ACTIONS.INIT]),

    frequencyOf(frequency) {
      return frequencies.find(fre => fre.id === frequency).title;
    },

    onNameClicked(assignmentPlan) {
      if (assignmentPlan.active) {
        this.$emit('nameClicked', assignmentPlan.id);
      }
    },
  }
}
</script>

<style lang="scss" module>
$content-margin: 24px;
$ops-bar-height: 60px;
$ops-bar-margin-bottom: 5px;

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

.theTable {
  width: 100%;
  background-color: $whiteBackgroundColor;

  :global {
    th {
      color: $primaryTextColor;

      .cell {
        padding-top: 5px;
        padding-bottom: 5px;
      }
    }

    td {
      /*padding-top: 16px;*/
      /*padding-bottom: 16px;*/
    }

    .firstColumn {
      padding-left: 16px;
    }
  }
}

.nameClickable {
  cursor: pointer;
}

.theName {
  font-weight: 500;
  margin-right: 10px;
}

.nameHoverable:hover {
  color: $primaryThemeColor;
}

.newIcon {
  color: #10b01b;
}

.deactivatedText {
  color: $rejectRed;
}

.activatedText {
  color: $passGreen;
}

.noOperators {
  color: $warningYellow;
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

<template>
  <div :class="$style.wrapper">
    <el-button :class="$style.addButton"
               :disabled="isMaxReached"
               :title="buttonTitle"
               icon="el-icon-plus"
               size="medium"
               type="primary"
               @click="showDialog">
      新增任务计划
    </el-button>

    <AssignmentPlanSettingEditDialog :isNew="true"
                                     :planSetting="newPlanSetting"
                                     :show.sync="dialogVisible"
                                     @updated="createAssignmentPlan">
    </AssignmentPlanSettingEditDialog>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import AssignmentPlanSettingEditDialog from '@/console/app-operation/assignment/plans/AssignmentPlanSettingEditDialog';
import assignmentPlanApi from '@/common/api/assignment-plan-api';
import ACTIONS from '@/console/app-operation/assignment/plans/store/assignment-plan-list-actions';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');
const assignmentPlanStore = createNamespacedHelpers('ASSIGNMENT_PLAN_STORE');

export default {
  data() {
    return {
      dialogVisible: false,
      newPlanSetting: {},
    }
  },

  components: {
    AssignmentPlanSettingEditDialog,
  },

  computed: {
    ...appOperationStore.mapGetters(['currentAppId']),
    ...assignmentPlanStore.mapGetters(['isMaxReached']),

    buttonTitle() {
      if (this.isMaxReached) {
        return '任务计划数量已达单个应用所允许的最大值(5个)，无法继续新增。';
      } else {
        return '新增任务计划';
      }
    }
  },

  methods: {
    ...assignmentPlanStore.mapActions([ACTIONS.LIST_ASSIGNMENT_PLANS]),

    showDialog() {
      this.newPlanSetting = {
        name: null,
        appId: this.currentAppId,
        pageId: null,
        frequency: null,
        startTime: {
          date: null,
          time: null,
        },
        expireTime: {
          date: null,
          time: null,
        },
        nearExpireNotifyEnabled: false,
        nearExpireNotifyTime: {
          date: null,
          time: null,
        }
      };
      this.dialogVisible = true;
    },

    createAssignmentPlan(planSetting) {
      return assignmentPlanApi.createAssignmentPlan({setting: planSetting}).then(() => {
        this.$message({
          type: 'success',
          message: `任务计划创建成功。`,
          center: true,
        });
        return this[ACTIONS.LIST_ASSIGNMENT_PLANS]();
      });
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  margin-left: 16px;
}

.addButton {
  width: $pageButtonWidth;
}
</style>

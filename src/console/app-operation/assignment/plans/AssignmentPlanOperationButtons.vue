<template>
  <div :class="$style.wrapper">
    <el-button size="medium"
               type="text"
               @click.stop="viewDetail">
      详情
    </el-button>

    <el-dropdown :class="$style.opsDropdown"
                 size="medium"
                 trigger="click"
                 @command="handleMoreCommand">

      <el-button size="medium"
                 type="text">
        更多<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-if="isAppLevel" command="editAssignmentPlanSetting" title="编辑">
          编辑
        </el-dropdown-item>

        <el-dropdown-item v-if="isGroupLevel" command="setGroupOperators" title="设置任务执行人">
          设置任务执行人
        </el-dropdown-item>

        <el-dropdown-item v-if="isAppLevel" :title="`排除${groupDesignation}`" command="excludeGroups">
          排除{{ groupDesignation }}
        </el-dropdown-item>

        <el-dropdown-item v-if="isAppLevel && !assignmentPlan.active" command="activate" title="启用">
          启用
        </el-dropdown-item>

        <el-dropdown-item v-if="isAppLevel && assignmentPlan.active" command="deactivate" title="禁用">
          禁用
        </el-dropdown-item>

        <el-dropdown-item v-if="isAppLevel" command="deleteAssignmentPlan" title="删除">
          删除
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <AssignmentPlanSettingEditDialog :isNew="false"
                                     :planSetting="assignmentPlan.setting"
                                     :show.sync="settingDialogVisible"
                                     @updated="updateAssignmentPlanSetting">
    </AssignmentPlanSettingEditDialog>

    <AssignmentPlanDetailDialog :assignmentPlan="assignmentPlan"
                                :show.sync="detailDialogVisible">
    </AssignmentPlanDetailDialog>

    <ExcludeGroupsDialog :assignmentPlan="assignmentPlan"
                         :show.sync="excludeGroupsDialogVisible"
                         @updated="doExcludeGroups">
    </ExcludeGroupsDialog>

    <SetGroupOperatorsDialog :assignmentPlan="assignmentPlan"
                             :show.sync="setGroupOperatorsDialogVisible"
                             @updated="doSetGroupOperators">
    </SetGroupOperatorsDialog>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import AssignmentPlanSettingEditDialog from '@/console/app-operation/assignment/plans/AssignmentPlanSettingEditDialog';
import AssignmentPlanDetailDialog from '@/console/app-operation/assignment/plans/AssignmentPlanDetailDialog';
import ACTIONS from '@/console/app-operation/assignment/plans/store/assignment-plan-list-actions';
import assignmentPlanApi from "@/common/api/assignment-plan-api";
import ExcludeGroupsDialog from '@/console/app-operation/assignment/plans/ExcludeGroupsDialog';
import SetGroupOperatorsDialog from '@/console/app-operation/assignment/plans/SetGroupOperatorsDialog';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');
const assignmentPlanStore = createNamespacedHelpers('ASSIGNMENT_PLAN_STORE');

export default {
  props: ['assignmentPlan'],

  components: {
    AssignmentPlanSettingEditDialog,
    AssignmentPlanDetailDialog,
    ExcludeGroupsDialog,
    SetGroupOperatorsDialog,
  },

  data() {
    return {
      settingDialogVisible: false,
      detailDialogVisible: false,
      excludeGroupsDialogVisible: false,
      setGroupOperatorsDialogVisible: false,
    }
  },

  computed: {
    ...appOperationStore.mapGetters(['groupDesignation']),
    ...assignmentPlanStore.mapGetters(['isAppLevel', 'isGroupLevel']),
    ...assignmentPlanStore.mapState(['groupId']),
  },

  methods: {
    ...assignmentPlanStore.mapActions([ACTIONS.LIST_ASSIGNMENT_PLANS]),

    viewDetail() {
      this.detailDialogVisible = true;
    },

    editAssignmentPlanSetting() {
      this.settingDialogVisible = true;
    },

    setGroupOperators() {
      this.setGroupOperatorsDialogVisible = true;
    },

    doSetGroupOperators(operators) {
      return assignmentPlanApi.setGroupOperators(this.assignmentPlan.id, {
        groupId: this.groupId,
        memberIds: operators
      }).then(() => {
        this.$message({
          type: 'success',
          message: `成功设置任务执行人。`,
          center: true,
        });
        return this[ACTIONS.LIST_ASSIGNMENT_PLANS]();
      });
    },

    excludeGroups() {
      this.excludeGroupsDialogVisible = true;
    },

    doExcludeGroups(groupIds) {
      return assignmentPlanApi.excludeGroups(this.assignmentPlan.id, {excludedGroups: groupIds}).then(() => {
        this.$message({
          type: 'success',
          message: `成功排除${this.groupDesignation}。`,
          center: true,
        });
        return this[ACTIONS.LIST_ASSIGNMENT_PLANS]();
      });
    },

    deleteAssignmentPlan() {
      return this.$confirm(`确认删除该任务计划【${this.assignmentPlan.name}】？`, '提示', {
        confirmButtonText: '是的，删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return assignmentPlanApi.deleteAssignmentPlan(this.assignmentPlan.id).then(() => {
          this.$message({
            type: 'success',
            message: `任务计划删除成功。`,
            center: true,
          });
          return this[ACTIONS.LIST_ASSIGNMENT_PLANS]();
        });
      });
    },

    handleMoreCommand(command) {
      return this[command]();
    },

    updateAssignmentPlanSetting(planSetting) {
      return assignmentPlanApi.updateAssignmentPlanSetting(this.assignmentPlan.id, {setting: planSetting}).then(() => {
        this.$message({
          type: 'success',
          message: `任务计划更新成功。`,
          center: true,
        });
        return this[ACTIONS.LIST_ASSIGNMENT_PLANS]();
      });
    },

    activate() {
      return this.$confirm(`确认启用【${this.assignmentPlan.name}】？`, '提示', {
        confirmButtonText: '是的，启用',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return assignmentPlanApi.activateAssignmentPlan(this.assignmentPlan.id).then(() => {
          this.$message({
            type: 'success',
            message: `成功启用【${this.assignmentPlan.name}】。`,
            center: true
          });
          return this[ACTIONS.LIST_ASSIGNMENT_PLANS]();
        });
      });
    },

    deactivate() {
      return this.$confirm(`确认禁用【${this.assignmentPlan.name}】？`, '提示', {
        confirmButtonText: '是的，禁用',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return assignmentPlanApi.deactivateAssignmentPlan(this.assignmentPlan.id).then(() => {
          this.$message({
            type: 'success',
            message: `成功禁用【${this.assignmentPlan.name}】。`,
            center: true
          });
          return this[ACTIONS.LIST_ASSIGNMENT_PLANS]();
        });
      });
    },
  },

}
</script>


<style lang="scss" module>
.wrapper {
  display: flex;
  align-items: center;
}

.opsDropdown {
  margin-left: 15px;
}

</style>

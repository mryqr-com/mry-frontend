<template>
  <div :class="$style.wrapper">
    <el-button size="medium"
               type="text"
               @click="requestAssignmentQrList">
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
        <el-dropdown-item :disabled="isClosed" command="setOperator">
          设置执行人
        </el-dropdown-item>

        <el-dropdown-item v-if="canManageCurrentApp" command="deleteAssignment">
          删除
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <SetAssignmentOperatorsDialog :assignment="assignment"
                                  :show.sync="showOperatorDialog"
                                  @updated="doSetOperators">
    </SetAssignmentOperatorsDialog>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import assignmentApi from '@/common/api/assignment-api';
import SetAssignmentOperatorsDialog from '@/console/app-operation/assignment/assignments/SetAssignmentOperatorsDialog';
import ASSIGNMENT_LIST_ACTIONS from "@/console/app-operation/assignment/assignments/store/assignment-list-actions";

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');
const assignmentListStore = createNamespacedHelpers('ASSIGNMENT_LIST_STORE');

export default {
  props: ['assignment'],

  components: {
    SetAssignmentOperatorsDialog,
  },

  data() {
    return {
      showOperatorDialog: false,
    }
  },

  computed: {
    ...appOperationStore.mapGetters(['canManageCurrentApp']),
    ...assignmentListStore.mapState(['originGroupId']),

    isClosed() {
      return this.assignment.status === 'SUCCEED' || this.assignment.status === 'FAILED';
    }
  },

  methods: {
    ...assignmentListStore.mapMutations(['deleteAssignmentById']),
    ...assignmentListStore.mapActions([
      ASSIGNMENT_LIST_ACTIONS.LIST_ASSIGNMENTS
    ]),

    requestAssignmentQrList() {
      if (this.originGroupId === 'ALL') {
        this.$router.push({name: 'assignment-qr-list', params: {assignmentId: this.assignment.id}});
      } else {
        this.$router.push({
          name: 'group-assignment-qr-list',
          params: {groupId: this.originGroupId, assignmentId: this.assignment.id}
        });
      }
    },

    handleMoreCommand(command) {
      return this[command]();
    },

    setOperator() {
      this.showOperatorDialog = true;
    },

    doSetOperators(operators) {
      return assignmentApi.setOperators(this.assignment.id, {
        memberIds: operators
      }).then(() => {
        this.$message({
          type: 'success',
          message: `成功设置任务执行人。`,
          center: true,
        });
        return this[ASSIGNMENT_LIST_ACTIONS.LIST_ASSIGNMENTS]();
      });
    },

    deleteAssignment() {
      return this.$confirm(`确认删除【${this.assignment.name}】？`, '提示', {
        confirmButtonText: '是的，删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return assignmentApi.deleteAssignment(this.assignment.id).then(() => {
          this.deleteAssignmentById(this.assignment.id);
          this.$message({
            type: 'success',
            message: `成功删除【${this.assignment.name}】。`,
            center: true,
          });
        });
      });
    }
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

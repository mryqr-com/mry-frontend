<template>
  <div :class="$style.wrapper">
    <el-dropdown trigger="click" @command="handleCommand">
      <span :class="$style.dropdownButton">...</span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :disabled="isClosed" command="setOperator">设置执行人</el-dropdown-item>

        <template v-if="canManageApp">
          <el-dropdown-item command="deleteAssignment">删除</el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </el-dropdown>

    <ClientAssignmentOperatorsDialog :assignment="assignment"
                                     :show.sync="setOperatorDialogVisible">
    </ClientAssignmentOperatorsDialog>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import assignmentApi from '@/common/api/assignment-api';
import ClientAssignmentOperatorsDialog from '@/client/operations/app/assignment/list/ClientAssignmentOperatorsDialog';

const clientAppOperationStore = createNamespacedHelpers('CLIENT_APP_OPERATION_STORE');
const clientAssignmentListStore = createNamespacedHelpers('CLIENT_ASSIGNMENT_LIST_STORE');

export default {
  props: ['assignment'],

  components: {
    ClientAssignmentOperatorsDialog,
  },

  data() {
    return {
      setOperatorDialogVisible: false,
    }
  },

  computed: {
    ...clientAppOperationStore.mapGetters([
      'canManageApp',
    ]),

    isClosed() {
      return this.assignment.status === 'SUCCEED' || this.assignment.status === 'FAILED';
    }
  },

  methods: {
    ...clientAssignmentListStore.mapMutations([
      'deleteAssignmentById',
    ]),

    handleCommand(command) {
      return this[command]();
    },

    setOperator() {
      this.setOperatorDialogVisible = true;
    },

    deleteAssignment() {
      return this.$confirm(`确认删除？`, '提示', {
        confirmButtonText: '是的，删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return assignmentApi.deleteAssignment(this.assignment.id).then(() => {
          this.$message({
            type: 'success',
            message: `删除成功。`,
            center: true,
            duration: 1000,
          });
          this.deleteAssignmentById(this.assignment.id);
        })
      });
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.dropdownButton {
  color: $secondaryTextColor;
  font-weight: 600;
  font-size: 20px;
  padding: 0 8px 10px;
  cursor: pointer;
}

.dropdownButton:hover {
  color: $primaryThemeColor;
}
</style>

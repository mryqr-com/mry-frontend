<template>
  <div :class="$style.wrapper">
    <el-table ref="listTable"
              :class="$style.theTable"
              :data="assignments"
              :height="height"
              highlight-current-row
              stripe
              @sort-change="onSortChange">
      <el-table-column :show-overflow-tooltip="true"
                       class-name="firstColumn"
                       column-key="name"
                       label="任务名称"
                       min-width="100">
        <template slot-scope="scope">
          <span :class="$style.assignmentName" @click="openAssignmentQrListPage(scope.row.id)">
           {{ scope.row.name }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
          :label="groupDesignation"
          :show-overflow-tooltip="true"
          column-key="groupId">
        <template slot-scope="scope">
          {{ groupNameOf(scope.row.groupId) }}
        </template>
      </el-table-column>

      <el-table-column
          column-key="startAt"
          label="开始时间"
          sortable="custom">
        <template slot-scope="scope">
          {{ formatEpochToMinute(scope.row.startAt) }}
        </template>
      </el-table-column>

      <el-table-column
          column-key="expireAt"
          label="结束时间"
          sortable="custom">
        <template slot-scope="scope">
          {{ formatEpochToMinute(scope.row.expireAt) }}
        </template>
      </el-table-column>

      <el-table-column
          :show-overflow-tooltip="true"
          column-key="finishedRatio"
          label="完成度">
        <template slot-scope="scope">
          {{ percentage(scope.row) }}%
          （{{ scope.row.finishedQrCount }}/{{ scope.row.allQrCount }}）
        </template>
      </el-table-column>

      <el-table-column
          :show-overflow-tooltip="true"
          column-key="operatorNames"
          label="执行人">
        <template slot-scope="scope">
          {{ scope.row.operatorNames.join(', ') }}
        </template>
      </el-table-column>

      <el-table-column
          column-key="status"
          label="状态">
        <template slot-scope="scope">
          <span :style="statusStyle(scope.row.status)">{{ statusTextOf(scope.row.status) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <AssignmentOperationButtons :assignment="scope.row"></AssignmentOperationButtons>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import {formatEpochToMinute} from '@/common/utils/common-utils';
import eventBus from "@/common/utils/event-bus";
import ASSIGNMENT_LIST_ACTIONS from "@/console/app-operation/assignment/assignments/store/assignment-list-actions";
import AssignmentOperationButtons from '@/console/app-operation/assignment/assignments/AssignmentOperationButtons';
import assignmentStatuses from '@/common/utils/assignment-statuses';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');
const assignmentListStore = createNamespacedHelpers('ASSIGNMENT_LIST_STORE');

export default {
  props: {
    height: {
      type: Number,
      required: true
    },
  },

  components: {
    AssignmentOperationButtons,
  },

  created() {
    eventBus.$on('go-to-assignments-table-top', this.scrollToTop);
  },

  beforeDestroy() {
    eventBus.$off('go-to-assignments-table-top');
  },

  methods: {
    ...assignmentListStore.mapActions([
      ASSIGNMENT_LIST_ACTIONS.LIST_ASSIGNMENTS
    ]),

    ...assignmentListStore.mapMutations([
      'updateSorting',
      'resetPageIndex',
      'goToTableTop',
    ]),

    formatEpochToMinute: formatEpochToMinute,

    percentage(assignment) {
      return Math.floor(assignment.finishedQrCount / assignment.allQrCount * 100);
    },

    onSortChange(sort) {
      let sortedBy = sort.order ? sort.column.columnKey : null;
      let ascSort = sort.order === 'ascending';
      this.updateSorting({sortedBy, ascSort});
      this.resetPageIndex();
      return this[ASSIGNMENT_LIST_ACTIONS.LIST_ASSIGNMENTS]().then(() => {
        this.goToTableTop();
      });
    },

    scrollToTop() {
      this.$refs.listTable.bodyWrapper.scrollTop = 0;
    },

    statusStyle(status) {
      return {
        color: this.statusColorOf(status),
      }
    },

    statusColorOf(status) {
      return assignmentStatuses.find(stat => stat.key === status).color;
    },

    statusTextOf(status) {
      return assignmentStatuses.find(stat => stat.key === status).name;
    },

    openAssignmentQrListPage(assignmentId) {
      if (this.originGroupId === 'ALL') {
        this.$router.push({name: 'assignment-qr-list', params: {assignmentId: assignmentId}});
      } else {
        this.$router.push({
          name: 'group-assignment-qr-list',
          params: {groupId: this.originGroupId, assignmentId: assignmentId}
        });
      }
    },
  },

  computed: {
    ...assignmentListStore.mapState([
      'assignments',
      'originGroupId',
    ]),

    ...appOperationStore.mapGetters([
      'groupNameOf',
      'groupDesignation',
    ]),

  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.theTable {
  width: 100%;
  background-color: $whiteBackgroundColor;

  :global {
    th {
      color: $primaryTextColor;
    }

    .firstColumn {
      padding-left: 16px;
    }
  }
}

.assignmentName {
  cursor: pointer;
}

.assignmentName:hover {
  color: $primaryThemeColor;
}

</style>

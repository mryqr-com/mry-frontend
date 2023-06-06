<template>
  <div :class="$style.wrapper">
    <el-table ref="listTable"
              :class="$style.theTable"
              :data="qrs"
              :height="height"
              highlight-current-row
              stripe
              @sort-change="onSortChange">
      <el-table-column :label="`${instanceDesignation}名称`"
                       :show-overflow-tooltip="true"
                       class-name="firstColumn"
                       column-key="name"
                       min-width="100"
                       sortable="custom">
        <template slot-scope="scope">
          <span :class="{[$style.qrName]:canOpen(scope.row)}" @click="openQrPage(scope.row)">
           {{ scope.row.name }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
          :show-overflow-tooltip="true"
          column-key="status"
          label="完成状态">
        <template slot-scope="scope">
          <span :style="finishedStyle(scope.row)">{{ finishedStatus(scope.row) }}</span>
        </template>
      </el-table-column>

      <el-table-column
          column-key="startAt"
          label="完成时间">
        <template slot-scope="scope">
          {{ scope.row.finishedAt ? formatEpochToMinute(scope.row.finishedAt) : '' }}
        </template>
      </el-table-column>

      <el-table-column
          column-key="expireAt"
          label="完成人">
        <template slot-scope="scope">
          {{ scope.row.operatorName }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <AssignmentQrOperationButtons :canOpen="canOpen(scope.row)"
                                        :qr="scope.row"
                                        @openQrPage="openQrPage">
          </AssignmentQrOperationButtons>
        </template>
      </el-table-column>
    </el-table>

    <DrawerBrowser :show.sync="showDrawerBrowser"
                   :src="drawerQrSrc"
                   :title="drawerQrName"
                   :wrapperClosableReferenceKey="'qrs_'+currentAppId+'_assignment'"
                   @closed="onDrawerClose">
    </DrawerBrowser>
  </div>
</template>

<script>
import {createNamespacedHelpers, mapGetters} from 'vuex';
import {formatEpochToMinute, qrUrlWithPage, qrUrlWithSubmission} from '@/common/utils/common-utils';
import eventBus from "@/common/utils/event-bus";
import ASSIGNMENT_QR_LIST_ACTIONS from "@/console/app-operation/assignment/qrs/store/assignment-qr-list-actions";
import AssignmentOperationButtons from '@/console/app-operation/assignment/assignments/AssignmentOperationButtons';
import DrawerBrowser from '@/common/components/DrawerBrowser';
import AssignmentQrOperationButtons from '@/console/app-operation/assignment/qrs/AssignmentQrOperationButtons';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');
const assignmentQrListStore = createNamespacedHelpers('ASSIGNMENT_QR_LIST_STORE');

export default {
  props: {
    height: {
      type: Number,
      required: true
    },
  },

  components: {
    AssignmentOperationButtons,
    DrawerBrowser,
    AssignmentQrOperationButtons,
  },

  data() {
    return {
      showDrawerBrowser: false,
      drawerQrName: '',
      drawerQrSrc: '',
    }
  },

  created() {
    eventBus.$on('go-to-assignment-qrs-table-top', this.scrollToTop);
  },

  beforeDestroy() {
    eventBus.$off('go-to-assignment-qrs-table-top');
  },

  computed: {
    ...assignmentQrListStore.mapState([
      'qrs',
      'assignmentDetail',
    ]),

    ...appOperationStore.mapGetters([
      'instanceDesignation',
      'currentAppId',
      'canManageGroup',
    ]),

    ...mapGetters(['currentMemberId']),
  },

  methods: {
    ...assignmentQrListStore.mapActions([
      ASSIGNMENT_QR_LIST_ACTIONS.LIST_ASSIGNMENT_QRS,
      ASSIGNMENT_QR_LIST_ACTIONS.FETCH_ASSIGNMENT_QR_DETAIL
    ]),

    ...assignmentQrListStore.mapMutations([
      'updateSorting',
      'resetPageIndex',
      'goToTableTop',
      'setWorkingQrId',
    ]),

    formatEpochToMinute: formatEpochToMinute,

    canOpen(qr) {
      if (this.canManageGroup(this.assignmentDetail.groupId)) {
        return true;
      }

      if (qr.operatorId) {
        return qr.operatorId === this.currentMemberId;
      }

      return this.assignmentDetail.status !== 'FAILED';
    },

    finishedStatus(qr) {
      return qr.finished ? '已完成' : '未完成';
    },

    finishedStyle(qr) {
      if (qr.finished) {
        return {
          color: '#10b01b',
        }
      }

      if (this.assignmentDetail.status === 'FAILED') {
        return {
          color: '#ea0000',
        }
      }

      return {
        color: '#E6A23C',
      }
    },

    onSortChange(sort) {
      let sortedBy = sort.order ? sort.column.columnKey : null;
      let ascSort = sort.order === 'ascending';
      this.updateSorting({sortedBy, ascSort});
      this.resetPageIndex();
      return this[ASSIGNMENT_QR_LIST_ACTIONS.LIST_ASSIGNMENT_QRS]().then(() => {
        this.goToTableTop();
      });
    },

    scrollToTop() {
      this.$refs.listTable.bodyWrapper.scrollTop = 0;
    },

    openQrPage(qr) {
      if (!this.canOpen(qr)) {
        return;
      }

      this.setWorkingQrId(qr.id);
      if (qr.submissionId) {
        this.drawerQrSrc = qrUrlWithSubmission(qr.plateId, this.assignmentDetail.pageId, qr.submissionId);
      } else {
        this.drawerQrSrc = qrUrlWithPage(qr.plateId, this.assignmentDetail.pageId);
      }

      this.drawerQrName = qr.name;
      this.showDrawerBrowser = true;
    },

    onDrawerClose() {
      this[ASSIGNMENT_QR_LIST_ACTIONS.FETCH_ASSIGNMENT_QR_DETAIL]();
    },
  },

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

.qrName {
  cursor: pointer;
}

.qrName:hover {
  color: $primaryThemeColor;
}

</style>

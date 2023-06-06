<template>
  <div v-if="listLoaded" :class="$style.wrapper">
    <div :class="$style.opsBar">
      <div :class="$style.titleBar">
        <div :class="$style.breadcrumbContainer">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{name: titleLinkName}">
              <span>{{ title }}</span>
            </el-breadcrumb-item>

            <el-breadcrumb-item>
              <span>{{ assignmentTitle }}</span>
            </el-breadcrumb-item>
          </el-breadcrumb>
          <HelpDocLinker url="//docs.mryqr.com/collaboration/assignments/"></HelpDocLinker>
        </div>
        <div :class="$style.opsButtons">
          <div :class="$style.marginLeft20">
            完成状态 :
            <AssignmentQrStatusSelect :class="$style.width180"></AssignmentQrStatusSelect>
          </div>

          <AssignmentQrSearchButton :class="$style.marginLeft20"></AssignmentQrSearchButton>
        </div>
      </div>

      <div :class="$style.detailBar">
        <div :class="$style.detailItem">{{ groupDesignation }}：
          <span :class="$style.detailValue"> {{ groupNameOf(assignmentDetail.groupId) }}</span>
        </div>

        <div :class="$style.detailItem">{{ instanceDesignation }}总数：
          <span :class="$style.detailValue"> {{ assignmentDetail.allQrCount }}</span>
        </div>

        <div :class="$style.detailItem">已完成数量：
          <span :class="$style.detailValue"> {{ assignmentDetail.finishedQrCount }}</span>
        </div>

        <div :class="$style.detailItem">完成度：
          <span :class="$style.detailValue"> {{ completeness }}</span>
        </div>

        <div :class="$style.detailItem">任务状态：
          <span :class="$style.detailValue" :style="{color:statusColorOf(assignmentDetail.status)}">
            {{ statusTextOf(assignmentDetail.status) }}
          </span>
        </div>

        <div :class="$style.detailItem">任务执行人：
          <span :class="$style.detailValue"> {{ assignmentDetail.operatorNames.join(', ') }}</span>
        </div>
      </div>
    </div>

    <AssignmentQrListTable :height="tableHeight"></AssignmentQrListTable>

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
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import ASSIGNMENT_QR_LIST_ACTIONS from "@/console/app-operation/assignment/qrs/store/assignment-qr-list-actions";
import {formatEpochToMinute} from "@/common/utils/common-utils";
import assignmentStatuses from "@/common/utils/assignment-statuses";
import AssignmentQrStatusSelect from '@/console/app-operation/assignment/qrs/AssignmentQrStatusSelect';
import AssignmentQrSearchButton from '@/console/app-operation/assignment/qrs/AssignmentQrSearchButton';
import AssignmentQrListTable from '@/console/app-operation/assignment/qrs/AssignmentQrListTable';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');
const assignmentQrListStore = createNamespacedHelpers('ASSIGNMENT_QR_LIST_STORE');

export default {
  props: {
    assignmentId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    titleLinkName: {
      type: String,
      required: true
    }
  },

  components: {
    AssignmentQrStatusSelect,
    AssignmentQrSearchButton,
    AssignmentQrListTable,
  },

  data() {
    return {
      listLoaded: false,
    }
  },

  created() {
    this.init();
    return this[ASSIGNMENT_QR_LIST_ACTIONS.FETCH_ASSIGNMENT_DETAIL]().then(() => {
      return this.refreshAssignmentQrList().then(() => {
        this.listLoaded = true;
      });
    });
  },

  computed: {
    ...assignmentQrListStore.mapState([
      'totalNumber',
      'pageIndex',
      'pageSize',
      'assignmentDetail',
    ]),

    ...appOperationStore.mapGetters([
      'groupDesignation',
      'instanceDesignation',
      'groupNameOf',
    ]),

    assignmentTitle() {
      let start = formatEpochToMinute(this.assignmentDetail.startAt);
      let expire = formatEpochToMinute(this.assignmentDetail.expireAt);
      return `${this.assignmentDetail.name}（${start} 至 ${expire}）`;
    },

    completeness() {
      return Math.floor(this.assignmentDetail.finishedQrCount / this.assignmentDetail.allQrCount * 100) + '%';
    },

    hasPagination() {
      return this.totalNumber > this.pageSize;
    },

    tableHeight() {
      if (this.hasPagination) {
        return window.innerHeight - 60 - 40 - 24 - 60 - 5 - 48;
      } else {
        return window.innerHeight - 60 - 40 - 24 - 60 - 5 - 24;
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
  },

  methods: {
    ...assignmentQrListStore.mapActions([
      ASSIGNMENT_QR_LIST_ACTIONS.LIST_ASSIGNMENT_QRS,
      ASSIGNMENT_QR_LIST_ACTIONS.FETCH_ASSIGNMENT_DETAIL,
    ]),

    ...assignmentQrListStore.mapMutations([
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
        assignmentId: this.assignmentId,
      });
    },

    onPageIndexChanged() {
      return this.refreshAssignmentQrList();
    },

    onPageSizeChanged() {
      this.resetPageIndex();
      return this.refreshAssignmentQrList();
    },

    refreshAssignmentQrList() {
      return this[ASSIGNMENT_QR_LIST_ACTIONS.LIST_ASSIGNMENT_QRS]().then(() => {
        this.goToTableTop();
      });
    },

    statusColorOf(status) {
      return assignmentStatuses.find(stat => stat.key === status).color;
    },

    statusTextOf(status) {
      return assignmentStatuses.find(stat => stat.key === status).name;
    },
  }
}
</script>

<style lang="scss" module>
$content-margin: 24px;
$title-bar-height: 60px;
$detail-bar-height: 40px;
$ops-bar-margin-bottom: 5px;
$pagination-height: 48px;

.wrapper {
  height: calc(100vh - #{$consoleTopBarHeight} - #{$content-margin});
  margin: $content-margin;
}

.opsBar {
  padding: 0 16px;
  background-color: $whiteBackgroundColor;
  margin-bottom: $ops-bar-margin-bottom;
}

.opsButtons {
  display: flex;
  align-items: center;
}

.marginLeft20 {
  margin-left: 20px;
}

.width180 {
  width: 180px;
}

.titleBar {
  height: $title-bar-height;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.breadcrumbContainer {
  display: flex;
}

.detailBar {
  background-color: $whiteBackgroundColor;
  display: flex;
  align-items: center;
  height: $detail-bar-height;
  font-size: 13px;
}

.detailItem {
  margin-left: 40px;
}

.detailItem:first-child {
  margin-left: 0;
}

.detailValue {
  color: $primaryTextColor;
}

.pagination {
  height: $pagination-height;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>

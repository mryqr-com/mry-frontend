<template>
  <div :class="$style.wrapper">
    <el-table ref="listTable"
              :border="submissionTableBordered"
              :class="$style.theTable"
              :data="viewableSubmissions"
              :height="height"
              highlight-current-row
              stripe
              @filter-change="onFilterChange"
              @sort-change="onSortChange">
      <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          column-key="index"
          fixed="left"
          label="序号"
          width="60">
        <template slot-scope="scope">
          {{ (pageIndex - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column
          :fixed="viewableFieldIds.length > 5? 'left':null"
          :label="`${instanceDesignation}名称`"
          :show-overflow-tooltip="true"
          column-key="qrName"
          min-width="200">
        <template slot-scope="scope">
          <span :class="$style.qrNameContainer" @click="enterQrOperationPage(scope.row)">
           {{ scope.row.qrName }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
          v-if="viewableFieldIds.includes('page')"
          :show-overflow-tooltip="true"
          column-key="pageName"
          label="表单"
          min-width="150">
        <template slot-scope="scope">
          {{ pageNameOf(scope.row.pageId) }}
        </template>
      </el-table-column>

      <el-table-column
          v-if="viewableFieldIds.includes('createdAt')"
          :label="submitAtDesignation"
          :show-overflow-tooltip="true"
          column-key="createdAt"
          min-width="150"
          sortable="custom">
        <template slot-scope="scope">
          {{ formatEpochToMinute(scope.row.createdAt) }}
        </template>
      </el-table-column>

      <el-table-column
          v-if="viewableFieldIds.includes('createdBy')"
          :key="createdByKey"
          :label="submitterDesignation"
          :show-overflow-tooltip="true"
          column-key="createdBy"
          min-width="150">
        <template slot-scope="scope">
          {{ scope.row.creator }}
        </template>
      </el-table-column>

      <el-table-column
          v-if="isPageApproveEnabled(pageId) && viewableFieldIds.includes('approval')"
          :filters="approvalFilters(pageId)"
          :show-overflow-tooltip="true"
          column-key="approval"
          label="审批状态"
          min-width="150">
        <template slot-scope="scope">
          <span :style="approvalStyle(scope.row.approvalStatus)">
            {{ approvalStatusTextFor(scope.row.approvalStatus) }}</span>
        </template>
      </el-table-column>

      <template v-if="pageId !== 'ALL'">
        <component :is="control.type"
                   v-for="control in viewableControls"
                   :key="control.id"
                   :control="control"/>
      </template>

      <el-table-column
          v-if="viewableFieldIds.includes('group')"
          :key="groupIdKey"
          :filters="groupFilters"
          :label="groupDesignation"
          :show-overflow-tooltip="true"
          column-key="groupId"
          min-width="150">
        <template slot-scope="scope">
          {{ groupNameOf(scope.row.groupId) }}
        </template>
      </el-table-column>

      <el-table-column
          fixed="right"
          label="操作"
          width="150">
        <template slot="header" slot-scope="scope">
          <div :class="$style.tableOperationContainer">
            操作
            <div>
              <i :class="$style.refreshButton"
                 class="el-icon-refresh-right"
                 title="刷新"
                 @click="refreshSubmissionList">
              </i>
              <SubmissionTableOperationButtons></SubmissionTableOperationButtons>
            </div>
          </div>
        </template>
        <template slot-scope="scope">
          <SubmissionOperationButtons :submission="scope.row"></SubmissionOperationButtons>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import SubmissionOperationButtons from '@/console/app-operation/submissions/SubmissionOperationButtons';
import {formatEpochToMinute} from '@/common/utils/common-utils';
import RadioAnswerColumn from '@/console/app-operation/submissions/control/RadioAnswerColumn';
import CheckboxAnswerColumn from '@/console/app-operation/submissions/control/CheckboxAnswerColumn';
import SingleLineTextAnswerColumn from '@/console/app-operation/submissions/control/SingleLineTextAnswerColumn';
import PersonNameAnswerColumn from '@/console/app-operation/submissions/control/PersonNameAnswerColumn';
import IdentifierAnswerColumn from '@/console/app-operation/submissions/control/IdentifierAnswerColumn';
import NumberInputAnswerColumn from '@/console/app-operation/submissions/control/NumberInputAnswerColumn';
import MultiLineTextAnswerColumn from '@/console/app-operation/submissions/control/MultiLineTextAnswerColumn';
import RichTextInputAnswerColumn from '@/console/app-operation/submissions/control/RichTextInputAnswerColumn';
import DropdownAnswerColumn from '@/console/app-operation/submissions/control/DropdownAnswerColumn';
import MemberSelectAnswerColumn from '@/console/app-operation/submissions/control/MemberSelectAnswerColumn';
import AddressAnswerColumn from '@/console/app-operation/submissions/control/AddressAnswerColumn';
import MultiLevelSelectionAnswerColumn
  from '@/console/app-operation/submissions/control/MultiLevelSelectionAnswerColumn';
import GeolocationAnswerColumn from '@/console/app-operation/submissions/control/GeolocationAnswerColumn';
import NumberRankAnswerColumn from '@/console/app-operation/submissions/control/NumberRankAnswerColumn';
import MobileAnswerColumn from '@/console/app-operation/submissions/control/MobileAnswerColumn';
import EmailAnswerColumn from '@/console/app-operation/submissions/control/EmailAnswerColumn';
import DateAnswerColumn from '@/console/app-operation/submissions/control/DateAnswerColumn';
import TimeAnswerColumn from '@/console/app-operation/submissions/control/TimeAnswerColumn';
import ItemCountAnswerColumn from '@/console/app-operation/submissions/control/ItemCountAnswerColumn';
import ItemStatusAnswerColumn from '@/console/app-operation/submissions/control/ItemStatusAnswerColumn';
import PointCheckAnswerColumn from '@/console/app-operation/submissions/control/PointCheckAnswerColumn';
import ImageUploadAnswerColumn from '@/console/app-operation/submissions/control/ImageUploadAnswerColumn';
import SignatureAnswerColumn from '@/console/app-operation/submissions/control/SignatureAnswerColumn';
import FileUploadAnswerColumn from '@/console/app-operation/submissions/control/FileUploadAnswerColumn';
import SubmissionTableOperationButtons from '@/console/app-operation/submissions/SubmissionTableOperationButtons';
import eventBus from "@/common/utils/event-bus";
import SUBMISSION_LIST_ACTIONS from "@/console/app-operation/submissions/store/submission-list-actions";
import uuid from "short-uuid";

const submissionListStore = createNamespacedHelpers('SUBMISSION_LIST_STORE');
const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: {
    height: {
      type: Number,
      required: true
    },
  },

  components: {
    SubmissionTableOperationButtons,
    SubmissionOperationButtons,
    CHECKBOX: CheckboxAnswerColumn,
    RADIO: RadioAnswerColumn,
    SINGLE_LINE_TEXT: SingleLineTextAnswerColumn,
    PERSON_NAME: PersonNameAnswerColumn,
    IDENTIFIER: IdentifierAnswerColumn,
    NUMBER_INPUT: NumberInputAnswerColumn,
    MULTI_LINE_TEXT: MultiLineTextAnswerColumn,
    RICH_TEXT_INPUT: RichTextInputAnswerColumn,
    DROPDOWN: DropdownAnswerColumn,
    MEMBER_SELECT: MemberSelectAnswerColumn,
    ADDRESS: AddressAnswerColumn,
    GEOLOCATION: GeolocationAnswerColumn,
    NUMBER_RANKING: NumberRankAnswerColumn,
    MOBILE: MobileAnswerColumn,
    EMAIL: EmailAnswerColumn,
    DATE: DateAnswerColumn,
    TIME: TimeAnswerColumn,
    ITEM_COUNT: ItemCountAnswerColumn,
    ITEM_STATUS: ItemStatusAnswerColumn,
    POINT_CHECK: PointCheckAnswerColumn,
    IMAGE_UPLOAD: ImageUploadAnswerColumn,
    FILE_UPLOAD: FileUploadAnswerColumn,
    SIGNATURE: SignatureAnswerColumn,
    MULTI_LEVEL_SELECTION: MultiLevelSelectionAnswerColumn,
  },

  data() {
    return {
      createdByKey: uuid.generate(),
      groupIdKey: uuid.generate(),
    }
  },

  created() {
    eventBus.$on('go-to-submissions-table-top', this.scrollToTop);
    eventBus.$on('reset-submissions-filterables', this.resetTableFilter);
    eventBus.$on('reset-submissions-sorting', this.resetTableSort);
  },

  beforeDestroy() {
    eventBus.$off('go-to-submissions-table-top');
    eventBus.$off('reset-submissions-filterables');
    eventBus.$off('reset-submissions-sorting');
  },

  watch: {
    groupFilters:
        function (val) {
          if (!val) {
            this.clearFilterable('groupId');
          }
          this.groupIdKey = uuid.generate();
        },
  },

  methods: {
    ...submissionListStore.mapActions([
      SUBMISSION_LIST_ACTIONS.LIST_SUBMISSIONS
    ]),

    ...submissionListStore.mapMutations([
      'updateSorting',
      'updateFilterables',
      'resetPageIndex',
      'goToTableTop',
      'clearFilterable',
    ]),

    formatEpochToMinute: formatEpochToMinute,

    enterQrOperationPage(submission) {
      //qr列表中都不是进入workbench，这里更不应该
      // this.$router.push({name: 'qr-operation-workbench', params: {qrId: submission.qrId}});
    },

    refreshSubmissionList() {
      return this[SUBMISSION_LIST_ACTIONS.LIST_SUBMISSIONS]().then(() => {
        this.goToTableTop();
      });
    },

    onFilterChange(filter) {
      let filterMap = new Map(Object.entries(filter));
      this.updateFilterables(filterMap);
      this.resetPageIndex();
      return this[SUBMISSION_LIST_ACTIONS.LIST_SUBMISSIONS]().then(() => {
        this.goToTableTop();
      });
    },

    onSortChange(sort) {
      let sortedBy = sort.order ? sort.column.columnKey : null;
      let ascSort = sort.order === 'ascending';
      this.updateSorting({sortedBy, ascSort});
      this.resetPageIndex();
      return this[SUBMISSION_LIST_ACTIONS.LIST_SUBMISSIONS]().then(() => {
        this.goToTableTop();
      });
    },

    approvalFilters(pageId) {
      if (this.type === 'TO_BE_APPROVED') { //待审批页由于全部是为审批状态，因此不需要过滤
        return null;
      }
      return this.approvalFiltersForPage(pageId);
    },

    approvalStatusTextFor(approvalStatus) {
      switch (approvalStatus) {
        case 'PASSED': {
          return this.approvalPassedText(this.pageId);
        }

        case 'NOT_PASSED': {
          return this.approvalNotPassedText(this.pageId);
        }

        case 'NONE': {
          return '未审批';
        }
      }
    },

    approvalStyle(approvalStatus) {
      switch (approvalStatus) {
        case 'PASSED': {
          return {
            color: '#10b01b'
          }
        }

        case 'NOT_PASSED': {
          return {
            color: '#ea0000'
          }
        }
      }
    },

    scrollToTop() {
      this.$refs.listTable.bodyWrapper.scrollTop = 0;
    },

    resetTableSort() {
      this.$refs.listTable.clearSort();
    },

    resetTableFilter() {
      this.$refs.listTable.clearFilter();
    },

  },

  computed: {
    ...submissionListStore.mapState([
      'submissions',
      'type',
      'qrId',
      'groupId',
      'pageId',
      'createdBy',
      'submissionTableBordered',
      'pageIndex',
      'pageSize',
    ]),

    ...appOperationStore.mapGetters([
      'currentAppId',
      'pageNameOf',
      'groupNameOf',
      'isPageApproveEnabled',
      'approvalFiltersForPage',
      'approvalPassedText',
      'approvalNotPassedText',
      'allFillableControlsOnPage',
      'allSelectableFieldOptionsOnPage',
      'hiddenFieldIdsOfPage',
      'managableGroups',
      'viewableGroups',
      'approvableGroups',
      'groupDesignation',
      'instanceDesignation',
      'submitterDesignationOf',
      'submitAtDesignationOf'
    ]),

    submitterDesignation() {
      return this.submitterDesignationOf(this.pageId);
    },

    submitAtDesignation() {
      return this.submitAtDesignationOf(this.pageId);
    },

    viewableSubmissions() {
      if (this.type === 'TO_BE_APPROVED') {
        return this.submissions.filter(sumission => {
          return sumission.approvalStatus === 'NONE'
        })
      }

      return this.submissions;
    },

    groupFilters() {
      if (this.groupId !== 'ALL') {
        return;
      }

      let filterGroups = null;
      switch (this.type) {
        case('ALL_SUBMIT_HISTORY'): {
          filterGroups = this.managableGroups;
          break;
        }
        case('SUBMITTER_SUBMISSION'): {
          filterGroups = this.viewableGroups;
          break;
        }
        case('TO_BE_APPROVED'): {
          filterGroups = this.approvableGroups;
          break;
        }
        default: {
          filterGroups = [];
        }
      }
      return filterGroups.map(group => {
        return {text: group.name, value: group.id};
      });
    },

    hiddenFieldIds() {
      return this.hiddenFieldIdsOfPage(this.pageId);
    },

    viewableFieldIds() {
      return this.allSelectableFieldOptionsOnPage(this.pageId, this.type).map(option => option.id).filter(id => !this.hiddenFieldIds.includes(id));
    },

    viewableControls() {
      return this.allFillableControlsOnPage(this.pageId).filter(control => this.viewableFieldIds.includes(control.id));
    }
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

  }
}

//
//.qrNameContainer {
//  cursor: pointer;
//}
//
//.qrNameContainer:hover {
//  color: $primaryThemeColor;
//}

.tableOperationContainer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.refreshButton {
  cursor: pointer;
  margin-right: 5px;
}

.refreshButton:hover {
  color: $primaryThemeColor;
}

</style>

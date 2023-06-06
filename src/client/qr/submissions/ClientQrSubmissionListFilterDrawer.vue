<template>
  <el-drawer :append-to-body="true"
             :class="$style.wrapper"
             :modal-append-to-body="true"
             :visible.sync="visible"
             :with-header="false"
             size="250px"
             @close="$emit('update:show', false)">

    <div :class="$style.content">
      <div :class="$style.topTitle">筛选</div>
      <section v-if="shouldShowPageSelect" :class="$style.filterSection">
        <div :class="$style.filterTitle">表单</div>
        <el-select :key="keepStateKey + 1"
                   v-model="localPageId"
                   :class="$style.inputSelect"
                   placeholder="选择表单"
                   size="small"
                   title="选择表单"
                   @change="onPageChanged">
          <el-option
              v-for="page in selectablePages"
              :key="page.id"
              :label="page.name"
              :value="page.id">
          </el-option>
        </el-select>
      </section>

      <section v-if="type !== 'SUBMITTER_SUBMISSION'" :class="$style.filterSection">
        <div :class="$style.filterTitle">{{ submitterDesignation }}</div>
        <el-select :key="keepStateKey + 2"
                   v-model="localCreatedBy"
                   :class="$style.inputSelect"
                   :placeholder="`选择${submitterDesignation}`"
                   :title="`选择${submitterDesignation}`"
                   filterable
                   size="small"
                   @change="onCreatedByChanged"
                   @focus="onSubmitterFocus">
          <el-option v-for="member in allMembers"
                     :key="member.id"
                     :label="member.showName"
                     :value="member.id">
          </el-option>
        </el-select>
      </section>

      <section :class="$style.filterSection">
        <div :class="$style.filterTitle">排序</div>
        <div :class="$style.sortRow">
          <el-select :key="keepStateKey + 3"
                     v-model="localSortedBy"
                     :class="$style.sortSelect"
                     placeholder="请选择排序字段"
                     size="small"
                     title="排序"
                     @change="onSortChanged">
            <el-option
                v-for="option in sortableOptions"
                :key="option.id"
                :label="option.name"
                :value="option.id">
            </el-option>
          </el-select>

          <el-radio-group v-if="localSortedBy"
                          :key="keepStateKey + 4"
                          v-model="localAscSort"
                          :class="$style.ascSort"
                          size="small"
                          @change="onSortChanged">
            <el-radio-button :label="true">升序
            </el-radio-button>
            <el-radio-button :label="false">降序
            </el-radio-button>
          </el-radio-group>
        </div>
      </section>

      <section v-if="isPageApproveEnabled(pageId) && type !== 'TO_BE_APPROVED'" :class="$style.filterSection">
        <ApprovalFilter></ApprovalFilter>
      </section>

      <component :is="control.type"
                 v-for="control in filterableControls"
                 :key="control.id"
                 :class="$style.filterSection"
                 :control="control"/>

      <section :class="$style.filterSection">
        <div :class="$style.filterTitle">提交起始时间</div>
        <el-date-picker
            :key="keepStateKey + 5"
            v-model="localStartDate"
            :class="$style.datePicker"
            placeholder="请选择"
            size="small"
            type="date"
            value-format="yyyy-MM-dd"
            @change="onStartDateChanged">
        </el-date-picker>
      </section>

      <section :class="$style.filterSection">
        <div :class="$style.filterTitle">提交终止时间</div>
        <el-date-picker
            :key="keepStateKey + 6"
            v-model="localEndDate"
            :class="$style.datePicker"
            placeholder="请选择"
            size="small"
            type="date"
            value-format="yyyy-MM-dd"
            @change="onEndDateChanged">
        </el-date-picker>
      </section>

      <section :class="$style.buttonSection">
        <el-button :class="$style.aButton"
                   icon="el-icon-refresh"
                   size="small"
                   type="plain"
                   @click="reset">
          重置
        </el-button>

        <el-button :class="$style.aButton"
                   icon="el-icon-check"
                   size="small"
                   type="primary"
                   @click="confirm">
          确定
        </el-button>
      </section>
    </div>
  </el-drawer>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import {controlFieldName} from "@/common/utils/common-utils";
import CheckboxAnswerFilter from '@/client/qr/submissions/filter/CheckboxAnswerFilter';
import RadioAnswerFilter from '@/client/qr/submissions/filter/RadioAnswerFilter';
import DropdownAnswerFilter from '@/client/qr/submissions/filter/DropdownAnswerFilter';
import MemberSelectAnswerFilter from '@/client/qr/submissions/filter/MemberSelectAnswerFilter';
import ItemStatusAnswerFilter from '@/client/qr/submissions/filter/ItemStatusAnswerFilter';
import PointCheckAnswerFilter from '@/client/qr/submissions/filter/PointCheckAnswerFilter';
import ApprovalFilter from '@/client/qr/submissions/filter/ApprovalFilter';
import memberApi from "@/common/api/member-api";

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');
const clientQrSubmissionListStore = createNamespacedHelpers('CLIENT_QR_SUBMISSION_LIST_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: true,
    },

    shouldShowPageSelect: {
      type: Boolean,
      required: true,
    },

    selectablePages: {
      type: Array,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },
  },

  components: {
    ApprovalFilter,
    CHECKBOX: CheckboxAnswerFilter,
    RADIO: RadioAnswerFilter,
    DROPDOWN: DropdownAnswerFilter,
    MEMBER_SELECT: MemberSelectAnswerFilter,
    ITEM_STATUS: ItemStatusAnswerFilter,
    POINT_CHECK: PointCheckAnswerFilter,
  },

  data() {
    return {
      visible: this.show,
      allMembers: [],
    }
  },

  created() {
    this.allMembers = [{id: 'ALL', name: '全部', showName: '全部'}];
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  computed: {
    ...clientQrStore.mapGetters([
      'allAnswerSortableControlsOfPage',
      'allAnswerFilterableControlsOfPage',
      'isPageApproveEnabled',
      'submitterDesignationOf',
      'submitAtDesignationOf',
    ]),

    ...clientQrSubmissionListStore.mapState([
      'createdBy',
      'sortedBy',
      'ascSort',
      'keepStateKey',
      'pageId',
      'startDate',
      'endDate',
    ]),

    submitterDesignation() {
      return this.submitterDesignationOf(this.pageId);
    },

    sortableOptions() {
      if (this.pageId === 'ALL') {
        return [{id: 'createdAt', name: this.submitAtDesignationOf(this.pageId)}];
      }

      let controlOptions = this.allAnswerSortableControlsOfPage(this.pageId, this.type).map(control => {
        return {id: control.id, name: controlFieldName(control)};
      });

      controlOptions.unshift({id: 'createdAt', name: this.submitAtDesignationOf(this.pageId)});
      return controlOptions;
    },

    filterableControls() {
      if (this.pageId === 'ALL') {
        return [];
      }

      return this.allAnswerFilterableControlsOfPage(this.pageId, this.type);
    },

    localCreatedBy: {
      get() {
        return this.createdBy;
      },

      set(value) {
        return this.updateCreatedBy(value);
      }
    },

    localSortedBy: {
      get() {
        return this.sortedBy;
      },

      set(value) {
        this.updateSortedBy(value);
      }
    },

    localAscSort: {
      get() {
        return this.ascSort;
      },

      set(value) {
        this.updateAscSort(value);
      }
    },

    localPageId: {
      get() {
        return this.pageId;
      },

      set(value) {
        return this.updatePageId(value);
      }
    },

    localStartDate: {
      get() {
        return this.startDate;
      },

      set(value) {
        return this.updateStartDate(value);
      }
    },

    localEndDate: {
      get() {
        return this.endDate;
      },

      set(value) {
        return this.updateEndDate(value);
      }
    }
  },

  methods: {
    ...clientQrSubmissionListStore.mapMutations([
      'updateCreatedBy',
      'resetCreatedBy',
      'updateSortedBy',
      'updateAscSort',
      'resetSorting',
      'resetInfinite',
      'updatePageId',
      'resetPageId',
      'resetFilterables',
      'updateStartDate',
      'resetStartDate',
      'updateEndDate',
      'resetEndDate',
    ]),


    onPageChanged() {
      this.resetSorting();
      this.resetFilterables();
      this.resetInfinite();
    },

    onSubmitterFocus() {
      if (this.allMembers.length > 1) {
        return;
      }

      return memberApi.listMemberReferences().then((members) => {
        this.allMembers = [{id: 'ALL', name: '全部', showName: '全部'}, ...members];
      });
    },

    onCreatedByChanged() {
      this.resetInfinite();
    },

    onSortChanged() {
      this.resetInfinite();
    },

    onStartDateChanged() {
      this.resetInfinite();
    },

    onEndDateChanged() {
      this.resetInfinite();
    },

    reset() {
      this.resetCreatedBy();
      this.resetPageId();
      this.resetSorting();
      this.resetFilterables();
      this.resetStartDate();
      this.resetEndDate();
      this.resetInfinite();
      this.visible = false;
    },

    confirm() {
      this.visible = false;
    },

  }

}
</script>


<style lang="scss" module>
.wrapper {
}

.content {
  height: 100vh;
  overflow-y: auto;
  padding: 10px;
}

.topTitle {
  margin-bottom: 15px;
  font-weight: 500;
  font-size: 15px;
}

.filterTitle {
  font-size: 13px;
  margin-bottom: 5px;
}

.sortRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sortSelect {
  width: 100%;
  flex-shrink: 1;
}

.ascSort {
  flex-shrink: 0;
  margin-left: 10px;
}

.filterSection {
  margin-bottom: 20px;
}

.inputSelect {
  width: 100%;
}

.datePicker {
  display: block;
  width: 100% !important;
}

.buttonSection {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  margin-bottom: 100px;
}

.aButton {
  width: 100%;
}

</style>

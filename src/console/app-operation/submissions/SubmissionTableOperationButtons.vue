<template>
  <el-dropdown :key="closeKey"
               :class="$style.wrapper"
               size="medium"
               trigger="click"
               @command="handleCommand">
    <i class="el-icon-s-tools" title="更多操作"></i>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-if="pageId" command="noop">
        <el-popover
            placement="bottom"
            title="过滤字段"
            trigger="click"
            @show="initControlSelection">
          <el-checkbox-group v-model="localControlSelection">
            <el-checkbox v-for="field in allControlFieldsOnCurrentPage"
                         :key="field.id"
                         :class="$style.fieldCheckbox"
                         :label="field.id">
              {{ field.name }}
            </el-checkbox>
          </el-checkbox-group>
          <el-button :class="$style.controlSelectionButton" size="mini" type="primary" @click="confirmControlSelection">
            确定
          </el-button>
          <div slot="reference" title="过滤字段">过滤字段</div>
        </el-popover>
      </el-dropdown-item>

      <el-dropdown-item command="noop">
        <el-popover
            :title="`按${submitAtDesignation}范围过滤`"
            placement="bottom"
            trigger="click"
            @show="initDate">

          <el-date-picker
              v-model="localStartDate"
              :class="$style.datePicker"
              placeholder="请选择起始时间"
              size="mini"
              type="date"
              value-format="yyyy-MM-dd">
          </el-date-picker>

          <el-date-picker
              v-model="localEndDate"
              :class="$style.datePicker"
              placeholder="请选择终止时间"
              size="mini"
              type="date"
              value-format="yyyy-MM-dd">
          </el-date-picker>

          <div>
            <el-button size="mini" type="plain" @click="clearDate">
              清空
            </el-button>

            <el-button size="mini" type="primary" @click="confirmDate">
              确定
            </el-button>
          </div>

          <div slot="reference" :title="`按${submitAtDesignation}范围过滤`">{{ startEndDateText }}</div>
        </el-popover>
      </el-dropdown-item>

      <el-dropdown-item command="noop">
        <el-checkbox v-model="localSubmissionTableBordered"
                     size="mini"
                     title="显示表格边框">
          显示边框
        </el-checkbox>
      </el-dropdown-item>

      <el-dropdown-item v-if="pageId && pageId !=='ALL' && type==='ALL_SUBMIT_HISTORY' && totalNumber > 0"
                        command="exportToExcel">
        导出Excel
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import uuid from "short-uuid";
import SUBMISSION_LIST_ACTIONS from "@/console/app-operation/submissions/store/submission-list-actions";
import {saveAs} from 'file-saver';

const submissionListStore = createNamespacedHelpers('SUBMISSION_LIST_STORE');
const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  data() {
    return {
      closeKey: uuid.generate(),//通过closeKey来关闭该控件
      localStartDate: null,
      localEndDate: null,
      localControlSelection: [],
    }
  },

  methods: {
    ...submissionListStore.mapActions([
      SUBMISSION_LIST_ACTIONS.LIST_SUBMISSIONS,
      SUBMISSION_LIST_ACTIONS.EXPORT_TO_EXCEL
    ]),

    ...submissionListStore.mapMutations([
      'refreshTable',
      'updateSubmissionTableBordered',
      'updateStartEndDate',
      'resetStartEndDate',
      'resetPageIndex',
      'goToTableTop',
    ]),

    ...appOperationStore.mapMutations([
      'updateHiddenFieldIdsForPage',
    ]),

    close() {
      this.closeKey = uuid.generate();
    },

    handleCommand(command) {
      return this[command]();
    },

    noop() {
      //no need to to anything
    },

    exportToExcel() {
      return this[SUBMISSION_LIST_ACTIONS.EXPORT_TO_EXCEL]().then((response) => {
        saveAs(response.data, `提交_${new Date().toLocaleString()}.xlsx`);
      })
    },

    initControlSelection() {
      let hiddenFieldIdsOfPage = this.hiddenFieldIdsOfPage(this.pageId);
      this.localControlSelection = this.allControlFieldsOnCurrentPage.map(field => field.id).filter(id => !hiddenFieldIdsOfPage.includes(id));
    },

    confirmControlSelection() {
      let hiddenFieldIds = this.allControlFieldsOnCurrentPage.map(field => field.id).filter(id => !this.localControlSelection.includes(id));
      this.updateHiddenFieldIdsForPage({pageId: this.pageId, filedIds: hiddenFieldIds});
      this.refreshTable();
    },

    initDate() {
      this.localStartDate = this.startDate;
      this.localEndDate = this.endDate;
    },

    confirmDate() {
      this.updateStartEndDate({startDate: this.localStartDate, endDate: this.localEndDate});
      this.close();
      this.resetPageIndex();
      return this[SUBMISSION_LIST_ACTIONS.LIST_SUBMISSIONS]().then(() => {
        this.goToTableTop();
      });
    },

    clearDate() {
      this.resetStartEndDate();
      this.close();
      this.resetPageIndex();
      return this[SUBMISSION_LIST_ACTIONS.LIST_SUBMISSIONS]().then(() => {
        this.goToTableTop();
      });
    },
  },

  computed: {
    ...appOperationStore.mapGetters([
      'allSelectableFieldOptionsOnPage',
      'hiddenFieldIdsOfPage',
      'submitAtDesignationOf',
    ]),

    submitAtDesignation() {
      return this.submitAtDesignationOf(this.pageId);
    },

    ...submissionListStore.mapState([
      'pageId',
      'submissionTableBordered',
      'startDate',
      'endDate',
      'type',
      'totalNumber',
    ]),

    allControlFieldsOnCurrentPage() {
      if (this.pageId) {
        return this.allSelectableFieldOptionsOnPage(this.pageId, this.type);
      }
      return [];
    },

    localSubmissionTableBordered: {
      get() {
        return this.submissionTableBordered;
      },

      set(value) {
        return this.updateSubmissionTableBordered(value);
      }
    },

    startEndDateText() {
      if (this.startDate || this.endDate) {
        return `${this.startDate} => ${this.endDate}`;
      }
      return `按${this.submitAtDesignation}范围过滤`;
    },
  }

}
</script>


<style lang="scss" module>
.wrapper {
  cursor: pointer;
}

.wrapper:hover {
  color: $primaryThemeColor;
}

.fieldCheckbox {
  display: block;
}

.controlSelectionButton {
  margin-top: 10px;
  width: 150px;
}

.datePicker {
  display: block;
  margin-bottom: 10px;
}

</style>

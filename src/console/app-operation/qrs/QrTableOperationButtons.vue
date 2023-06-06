<template>
  <el-dropdown :key="closeKey"
               :class="$style.wrapper"
               size="medium"
               trigger="click"
               @command="handleCommand">
    <i class="el-icon-s-tools" title="更多操作"></i>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="noop">
        <el-popover
            v-if="allEligibleAttributeOptions.length > 0"
            placement="bottom"
            title="过滤字段"
            trigger="click"
            @show="initAttributeSelection">
          <el-checkbox-group v-model="localSelectedAttributeIds">
            <el-checkbox v-for="field in allEligibleAttributeOptions"
                         :key="field.id"
                         :class="$style.fieldCheckbox"
                         :label="field.id">
              {{ field.name }}
            </el-checkbox>
          </el-checkbox-group>
          <el-button :class="$style.attributeSelectionButton"
                     size="mini"
                     type="primary"
                     @click="confirmAttributeSelection">
            确定
          </el-button>
          <div slot="reference" title="过滤字段">过滤字段</div>
        </el-popover>
      </el-dropdown-item>

      <el-dropdown-item command="noop">
        <el-popover
            placement="bottom"
            title="按创建时间范围过滤"
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

          <div slot="reference" title="按创建时间范围过滤">{{ startEndDateText }}</div>
        </el-popover>
      </el-dropdown-item>

      <el-dropdown-item command="noop">
        <el-checkbox v-model="localTemplateOnly"
                     :title="`仅显示作为模板的${instanceDesignation}`"
                     size="mini"
                     @change="templateOnlyChanged">
          仅显示模板
        </el-checkbox>
      </el-dropdown-item>

      <el-dropdown-item v-if="shouldShowInactiveOnly" command="noop">
        <el-checkbox v-model="localInactiveOnly"
                     :title="`仅显示被禁用的${instanceDesignation}`"
                     size="mini"
                     @change="inactiveOnlyChanged">
          仅显示禁用
        </el-checkbox>
      </el-dropdown-item>

      <el-dropdown-item v-if="currentAppGeolocationEnabled" command="noop">
        <el-checkbox v-model="localNearestPointEnabled"
                     :title="`根据${instanceDesignation}的定位距您当前的位置远近进行显示，越近的显示越靠前`"
                     size="mini"
                     @change="nearestPointEnabledChanged">
          按定位由近到远显示
        </el-checkbox>
      </el-dropdown-item>

      <el-dropdown-item command="noop">
        <el-checkbox v-model="localQrTableBordered"
                     size="mini"
                     title="显示表格边框">
          显示边框
        </el-checkbox>
      </el-dropdown-item>

      <el-dropdown-item v-if="canManageCurrentApp && totalNumber > 0"
                        command="exportToExcel">
        导出Excel
      </el-dropdown-item>

      <el-dropdown-item v-if="groupId && canManageGroup(groupId) && isBatchImportQrAllowed"
                        command="importExcel">
        批量导入
      </el-dropdown-item>
    </el-dropdown-menu>

    <ImportQrsDialog :show.sync="importQrDialogVisible" @fileUpload="onQrsUpload"></ImportQrsDialog>

    <ProgressBar :max="100"
                 :show.sync="qrImportProgressBarVisible"
                 :step="qrImportProgressStep"
                 :title="`导入${instanceDesignation}`"
                 text="正在上传...">
    </ProgressBar>

    <ImportQrsResponseDialog :importResponse="qrImportResponse"
                             :show.sync="qrImportResponseDialogVisible">
    </ImportQrsResponseDialog>
  </el-dropdown>
</template>

<script>
import {createNamespacedHelpers, mapGetters} from 'vuex';
import QR_LIST_ACTIONS from "@/console/app-operation/qrs/store/qr-list-actions";
import uuid from "short-uuid";
import ImportQrsDialog from '@/console/app-operation/qrs/ImportQrsDialog';
import {saveAs} from 'file-saver';
import qrApi from '@/common/api/qr-api';
import ImportQrsResponseDialog from '@/console/app-operation/qrs/ImportQrsResponseDialog';

const qrListStore = createNamespacedHelpers('QR_LIST_STORE');
const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  components: {
    ImportQrsDialog,
    ImportQrsResponseDialog,
  },

  data() {
    return {
      closeKey: uuid.generate(),//通过closeKey来关闭该控件
      localStartDate: null,
      localEndDate: null,
      localSelectedAttributeIds: [],
      importQrDialogVisible: false,
      qrImportProgressBarVisible: false,
      qrImportProgressStep: 0,
      qrImportResponseDialogVisible: false,
      qrImportResponse: null,
    }
  },

  methods: {
    ...qrListStore.mapActions([
      QR_LIST_ACTIONS.LIST_MY_VIEWABLE_QRS,
      QR_LIST_ACTIONS.EXPORT_TO_EXCEL,
    ]),

    ...qrListStore.mapMutations([
      'updateQrTableBordered',
      'updateTemplateOnly',
      'updateInactiveOnly',
      'updateNearestPointEnabled',
      'resetPageIndex',
      'resetSorting',
      'goToTableTop',
      'updateStartEndDate',
      'resetStartEndDate',
      'refreshTable',
    ]),

    ...appOperationStore.mapMutations([
      'updateHiddenAttributeIds',
    ]),

    close() {
      this.closeKey = uuid.generate();
    },

    handleCommand(command) {
      return this[command]();
    },

    noop() {
    },

    exportToExcel() {
      return this[QR_LIST_ACTIONS.EXPORT_TO_EXCEL]().then((response) => {
        saveAs(response.data, `${this.instanceDesignation}_${new Date().toLocaleString()}.xlsx`);
      })
    },

    importExcel() {
      this.importQrDialogVisible = true;
    },

    initAttributeSelection() {
      this.localSelectedAttributeIds = this.allEligibleAttributeIds.filter(id => !this.appHiddenAttributeIds.includes(id));
    },

    confirmAttributeSelection() {
      let hiddenAttributeIds = this.allEligibleAttributeIds.filter(id => !this.localSelectedAttributeIds.includes(id))
      this.updateHiddenAttributeIds(hiddenAttributeIds);
      this.refreshTable();
    },

    templateOnlyChanged() {
      this.resetPageIndex();
      return this[QR_LIST_ACTIONS.LIST_MY_VIEWABLE_QRS]().then(() => {
        this.goToTableTop();
      });
    },

    inactiveOnlyChanged() {
      this.resetPageIndex();
      return this[QR_LIST_ACTIONS.LIST_MY_VIEWABLE_QRS]().then(() => {
        this.goToTableTop();
      });
    },

    nearestPointEnabledChanged() {
      this.resetPageIndex();

      if (this.nearestPointEnabled) {//由于sort比nearestPointEnabled更具优先级，因此需要resetSorting才能使nearestPointEnabled生效
        this.resetSorting();
      }

      return this[QR_LIST_ACTIONS.LIST_MY_VIEWABLE_QRS]().then(() => {
        this.goToTableTop();
      });
    },

    initDate() {
      this.localStartDate = this.startDate;
      this.localEndDate = this.endDate;
    },

    confirmDate() {
      this.updateStartEndDate({startDate: this.localStartDate, endDate: this.localEndDate});
      this.close();
      this.resetPageIndex();
      return this[QR_LIST_ACTIONS.LIST_MY_VIEWABLE_QRS]().then(() => {
        this.goToTableTop();
      });
    },

    clearDate() {
      this.resetStartEndDate();
      this.close();
      this.resetPageIndex();
      return this[QR_LIST_ACTIONS.LIST_MY_VIEWABLE_QRS]().then(() => {
        this.goToTableTop();
      });
    },

    onQrsUpload(formData) {
      this.qrImportProgressBarVisible = true;
      this.qrImportProgressStep = 0;
      let _this = this;
      let interval = setInterval(function () {
        _this.qrImportProgressStep++;
      }, 200);

      return qrApi.importQrs(formData).then((response) => {
        this.qrImportProgressBarVisible = false;
        this.qrImportResponse = response.data;
        this.qrImportResponseDialogVisible = true;
      }).finally(() => {
        clearInterval(interval);
        this.qrImportProgressBarVisible = false;
      });
    },
  },

  computed: {
    ...mapGetters([
      'isBatchImportQrAllowed',
    ]),

    ...appOperationStore.mapState([
      'appHiddenAttributeIds',
    ]),

    ...appOperationStore.mapGetters([
      'currentAppGeolocationEnabled',
      'instanceDesignation',
      'allEligibleAttributes',
      'allEligibleAttributeIds',
      'canManageCurrentApp',
      'canManageGroup',
    ]),

    ...qrListStore.mapState([
      'qrTableBordered',
      'templateOnly',
      'inactiveOnly',
      'groupId',
      'nearestPointEnabled',
      'startDate',
      'endDate',
      'totalNumber',
    ]),

    shouldShowInactiveOnly() {
      if (this.canManageCurrentApp) {
        return true;
      }

      return this.groupId && this.canManageGroup(this.groupId);
    },

    allEligibleAttributeOptions() {
      return this.allEligibleAttributes.map(attr => {
        return {id: attr.id, name: attr.name}
      });
    },

    localTemplateOnly: {
      get() {
        return this.templateOnly;
      },

      set(value) {
        return this.updateTemplateOnly(value);
      }
    },

    localInactiveOnly: {
      get() {
        return this.inactiveOnly;
      },

      set(value) {
        return this.updateInactiveOnly(value);
      }
    },

    localNearestPointEnabled: {
      get() {
        return this.nearestPointEnabled;
      },

      set(value) {
        return this.updateNearestPointEnabled(value);
      }
    },

    localQrTableBordered: {
      get() {
        return this.qrTableBordered;
      },

      set(value) {
        return this.updateQrTableBordered(value);
      }
    },

    startEndDateText() {
      if (this.startDate || this.endDate) {
        return `${this.startDate} => ${this.endDate}`;
      }
      return '按创建时间范围过滤';
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

.datePicker {
  display: block;
  margin-bottom: 10px;
}

.fieldCheckbox {
  display: block;
}

.attributeSelectionButton {
  margin-top: 10px;
  width: 150px;
}

</style>

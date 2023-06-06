<template>
  <div :class="$style.wrapper">
    <el-button :class="$style.addButton"
               icon="el-icon-plus"
               size="medium"
               type="primary"
               @click="showDialog">
      新增{{ instanceDesignation }}
    </el-button>

    <el-dialog :class="$style.theDialog"
               :title="`新增${instanceDesignation}`"
               :visible.sync="dialogVisible"
               width="500px"
               @open="init">

      <el-form ref="theForm"
               :class="$style.theForm"
               :hide-required-asterisk="true"
               :model="formData"
               :rules="rules"
               label-position="top"
               label-width="120px"
               @submit.native.prevent="onSubmit">

        <el-form-item label="名称：" prop="name">
          <el-input ref="nameBox"
                    v-model="formData.name"
                    :class="$style.nameInput"
                    :maxlength="50"
                    :spellcheck="false"
                    size="medium"
                    @keyup.enter.native="onSubmit">
          </el-input>
        </el-form-item>

        <el-form-item :label="`${groupDesignation}：`" prop="groupId">
          <el-select v-model="formData.groupId"
                     :class="$style.groupSelect"
                     :disabled="shouldDisableGroupSelect"
                     :placeholder="`请选择${groupDesignation}`"
                     filterable
                     size="medium">
            <el-option v-for="group in managableGroups"
                       :key="group.id"
                       :label="group.name"
                       :value="group.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button :class="$style.footerButton"
                   icon="el-icon-close"
                   size="medium"
                   type="plain"
                   @click="cancel">
          取消
        </el-button>

        <el-button :class="$style.footerButton"
                   :disabled="apiInProgress"
                   icon="el-icon-plus"
                   size="medium"
                   type="primary"
                   @click="onSubmit">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import qrApi from '@/common/api/qr-api';
import QR_LIST_ACTIONS from "@/console/app-operation/qrs/store/qr-list-actions";

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');
const qrListStore = createNamespacedHelpers('QR_LIST_STORE');

export default {
  data() {
    return {
      dialogVisible: false,
      apiInProgress: false,
      formData: {
        name: null,
        groupId: null,
      },

      rules: {
        name: [
          {required: true, message: '请输入名称', trigger: 'change'},
          {max: 50, message: '名称长度不能超过50个字符', trigger: 'change'},
        ],
        groupId: [
          {required: true, message: '请选择', trigger: 'change'},
        ],
      }
    }
  },

  methods: {
    ...qrListStore.mapActions([
      QR_LIST_ACTIONS.LIST_MY_VIEWABLE_QRS,
      QR_LIST_ACTIONS.FETCH_WORKING_QR,
    ]),
    ...qrListStore.mapMutations([
      'resetPageIndex',
      'resetSearch',
      'resetFilterables',
      'resetSorting',
      'resetTemplateOnly',
      'resetInactiveOnly',
      'resetNearestPointEnabled',
      'resetBatchSelectedQrs',
      'goToTableTop',
      'resetStartEndDate',
      'resetCreatedBy',
      'setWorkingQrId',
    ]),

    showDialog() {
      this.dialogVisible = true;
    },

    init() {
      this.formData.name = null;
      this.apiInProgress = false;
      this.formData.groupId = this.initGroupId();
      this.$nextTick(() => {
        this.$refs['nameBox'].focus();
        this.$refs['theForm'].clearValidate();
      });
    },

    initGroupId() {
      if (this.groupId !== 'ALL') {
        return this.groupId;
      }

      return this.managableGroups[0].id;
    },

    onSubmit() {
      return this.$refs['theForm'].validate().then(() => {

        this.apiInProgress = true;
        this.dialogVisible = false;

        return qrApi.createQr(this.formData).then((response) => {
          this.setWorkingQrId(response.data.qrId);
          let that = this;
          this.$message({
            type: 'success',
            message: `添加成功。`,
            center: true,
            onClose: function () {
              that[QR_LIST_ACTIONS.FETCH_WORKING_QR]();
            }
          });

          this.resetSearch();
          this.resetPageIndex();
          this.resetSorting();
          this.resetFilterables();
          this.resetBatchSelectedQrs();
          this.resetTemplateOnly();
          this.resetInactiveOnly();
          this.resetNearestPointEnabled();
          this.resetStartEndDate();
          this.resetCreatedBy();
          return this[QR_LIST_ACTIONS.LIST_MY_VIEWABLE_QRS]().then(() => {
            this.goToTableTop();
          });
        }).finally(() => {
          this.apiInProgress = false;
        });
      });
    },

    cancel() {
      this.dialogVisible = false;
    },
  },

  computed: {
    ...appOperationStore.mapGetters([
      'managableGroups',
      'groupDesignation',
      'instanceDesignation',
    ]),

    ...qrListStore.mapState(['groupId']),

    shouldDisableGroupSelect() {
      return this.groupId !== 'ALL';
    }
  }
}
</script>


<style lang="scss" module>
.wrapper {
  margin-left: 16px;
}

.addButton {
  min-width: $pageButtonWidth;
}

.nameInput {
  width: 100%;
}

.groupSelect {
  width: 100%;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>

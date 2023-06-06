<template>
  <el-dialog :append-to-body="true"
             :title="`为【${qr.name}】重设流转状态`"
             :visible.sync="visible"
             width="500px"
             @close="$emit('update:show', false)"
             @open="init">

    <el-alert :closable="false"
              title="警告：流转状态正常情况下应该通过表单提交而自动设置；这里的手动设置主要用于后台修正数据等特殊场景，不建议作为日常运营操作。"
              type="warning">
    </el-alert>

    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="theFormData"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="submit">
      <el-form-item label="设置流转状态：" prop="circulationOptionId">
        <el-select v-model="theFormData.circulationOptionId"
                   :class="$style.theInput"
                   size="medium">
          <el-option v-for="option in allCirculationStatuses"
                     :key="option.id"
                     :label="option.name"
                     :value="option.id">
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
                 icon="el-icon-check"
                 size="medium"
                 type="primary"
                 @click="submit">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import qrApi from '@/common/api/qr-api';
import QR_LIST_ACTIONS from "@/console/app-operation/qrs/store/qr-list-actions";

const qrListStore = createNamespacedHelpers('QR_LIST_STORE');
const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    qr: {
      type: Object,
    },
  },

  data() {
    return {
      visible: this.show,
      theFormData: {
        circulationOptionId: null,
      },
      rules: {
        circulationOptionId: [
          {required: true, message: '请选择状态', trigger: 'change'},
        ],
      }
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  computed: {
    ...appOperationStore.mapGetters([
      'allCirculationStatuses',
    ]),

    allCirculationStatusIds() {
      return this.allCirculationStatuses.map(it => it.id);
    }
  },

  methods: {
    ...qrListStore.mapActions([
      QR_LIST_ACTIONS.FETCH_MY_VIEWABLE_QR,
    ]),

    ...qrListStore.mapMutations(['resetQrCirculationStatus']),

    init() {
      if (this.allCirculationStatusIds.includes(this.qr.circulationOptionId)) {
        this.theFormData.circulationOptionId = this.qr.circulationOptionId;
      } else {
        this.theFormData.circulationOptionId = null;
      }

      this.$nextTick(() => {
        this.$refs['theForm'].clearValidate();
      });
    },

    submit() {
      return this.$refs['theForm'].validate().then(() => {
        this.visible = false;

        return qrApi.resetQrCirculationStatus(this.qr.id, this.theFormData).then((response) => {
          this.$message({
            type: 'success',
            message: `重设流转状态成功。`,
            center: true
          });

          let qrId = this.qr.id;
          let circulationOptionId = this.theFormData.circulationOptionId;
          this.resetQrCirculationStatus({qrId, circulationOptionId});
          this[QR_LIST_ACTIONS.FETCH_MY_VIEWABLE_QR](this.qr.id);
        });
      });
    },

    cancel() {
      this.visible = false;
    }
  },

}
</script>


<style lang="scss" module>
.wrapper {
}

.theInput {
  width: 100%;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>


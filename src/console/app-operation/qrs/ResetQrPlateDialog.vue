<template>
  <el-dialog :append-to-body="true"
             :title="`为【${qr.name}】重设码牌`"
             :visible.sync="visible"
             width="500px"
             @close="$emit('update:show', false)"
             @open="init">

    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="theFormData"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="submit">

      <el-form-item ref="plateInput" label="码牌号：" prop="plateId">
        <el-input ref="plateBox"
                  v-model.trim="theFormData.plateId"
                  :class="$style.theInput"
                  :maxlength="50"
                  :spellcheck="false"
                  :validate-event="validated"
                  placeholder="格式如：MRY84829222573154306"
                  size="medium">
        </el-input>
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
import validations from '@/common/utils/validations';
import qrApi from '@/common/api/qr-api';
import QR_LIST_ACTIONS from "@/console/app-operation/qrs/store/qr-list-actions";

const qrListStore = createNamespacedHelpers('QR_LIST_STORE');


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
      validated: false,
      theFormData: {
        plateId: null,
      },

      rules: {
        plateId: [
          {required: true, message: '请输入码牌号', trigger: 'change'},
          {validator: validations.PLATE_ID_RULE, trigger: 'change'}
        ],
      }
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  methods: {
    ...qrListStore.mapActions([
      QR_LIST_ACTIONS.FETCH_MY_VIEWABLE_QR,
    ]),

    ...qrListStore.mapMutations(['resetQrPlateId']),

    init() {
      this.validated = false;
      this.theFormData.plateId = null;
      this.$nextTick(() => {
        this.$refs['plateBox'].focus();
        this.$refs['theForm'].clearValidate();
      });
    },

    submit() {
      this.validated = true;
      return this.$refs['theForm'].validate().then(() => {
        this.visible = false;

        return qrApi.resetQrPlate(this.qr.id, this.theFormData).then((response) => {
          this.$message({
            type: 'success',
            message: `重设码牌成功。`,
            center: true
          });

          let qrId = this.qr.id;
          let plateId = this.theFormData.plateId;

          this.resetQrPlateId({qrId, plateId});
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


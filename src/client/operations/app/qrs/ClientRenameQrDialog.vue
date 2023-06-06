<template>
  <el-dialog :append-to-body="true"
             :class="$style.wrapper"
             :customClass="$style.elDialog"
             :title="`重命名${instanceDesignation}`"
             :visible.sync="visible"
             top="0"
             width="100%"
             @close="$emit('update:show', false)"
             @open="openRenameInit">

    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="renameFormData"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="onRenameSubmit">

      <el-form-item label="名称：" prop="name">
        <el-input ref="nameBox"
                  v-model="renameFormData.name"
                  :class="$style.nameInput"
                  :maxlength="50"
                  :spellcheck="false"
                  placeholder="请输入名称">
        </el-input>
      </el-form-item>

    </el-form>

    <div slot="footer" :class="$style.footer">
      <el-button :class="$style.footerButton"
                 icon="el-icon-close"
                 type="plain"
                 @click="cancel">
        取消
      </el-button>

      <el-button :class="$style.footerButton"
                 icon="el-icon-check"
                 type="primary"
                 @click="onRenameSubmit">
        确定
      </el-button>
    </div>

  </el-dialog>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import qrApi from '@/common/api/qr-api';
import CLIENT_QR_LIST_ACTIONS from "@/client/operations/app/qrs/store/client-qr-list-actions";

const clientQrListStore = createNamespacedHelpers('CLIENT_QR_LIST_STORE');
const clientAppOperationStore = createNamespacedHelpers('CLIENT_APP_OPERATION_STORE');

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
      renameFormData: {
        name: null,
      },

      rules: {
        name: [
          {required: true, message: '请输入名称', trigger: 'change'},
          {max: 50, message: '名称不能超过50个字符', trigger: 'change'},
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
    ...clientQrListStore.mapActions([
      CLIENT_QR_LIST_ACTIONS.CLIENT_FETCH_MY_VIEWABLE_QR,
    ]),

    ...clientQrListStore.mapMutations(['renameQrById']),

    openRenameInit() {
      this.renameFormData.name = this.qr.name;
      this.$nextTick(() => {
        this.$refs['nameBox'].focus();
        this.$refs['nameBox'].select();
        this.$refs['theForm'].clearValidate();
      });
    },

    onRenameSubmit() {
      return this.$refs['theForm'].validate().then(() => {
        if (this.renameFormData.name === this.qr.name) {
          this.visible = false;
          return;
        }

        return qrApi.renameQr(this.qr.id, this.renameFormData).then((response) => {
          this.$message({
            type: 'success',
            message: `重命名成功。`,
            center: true,
            duration: 1000,
          });

          let qrId = this.qr.id;
          let name = this.renameFormData.name;
          this.visible = false;

          this.renameQrById({qrId, name});
          this[CLIENT_QR_LIST_ACTIONS.CLIENT_FETCH_MY_VIEWABLE_QR](this.qr.id);
        });
      });
    },

    cancel() {
      this.visible = false;
    }
  },

  computed: {
    ...clientAppOperationStore.mapGetters([
      'instanceDesignation',
    ]),
  }
}
</script>


<style lang="scss" module>
.wrapper {
  :global {
    .el-dialog {
      margin-top: 0;
      margin-bottom: 0;
    }
  }
}

.elDialog {
  height: 100%;
}

.nameInput {
  width: 100%;
}

.footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>


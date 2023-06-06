<template>
  <el-dialog :append-to-body="true"
             :title="`重命名${instanceDesignation}`"
             :visible.sync="visible"
             width="500px"
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
                  placeholder="请输入名称"
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
                 @click="onRenameSubmit">
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
    ...qrListStore.mapActions([
      QR_LIST_ACTIONS.FETCH_MY_VIEWABLE_QR,
    ]),

    ...qrListStore.mapMutations(['renameQrById']),

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
        this.visible = false;

        return qrApi.renameQr(this.qr.id, this.renameFormData).then((response) => {
          this.$message({
            type: 'success',
            message: `重命名成功。`,
            center: true
          });

          let qrId = this.qr.id;
          let name = this.renameFormData.name;

          this.renameQrById({qrId, name});
          this[QR_LIST_ACTIONS.FETCH_MY_VIEWABLE_QR](this.qr.id);
        });
      });
    },

    cancel() {
      this.visible = false;
    }
  },

  computed: {
    ...appOperationStore.mapGetters([
      'instanceDesignation',
    ]),
  }
}
</script>


<style lang="scss" module>
.wrapper {
}

.nameInput {
  width: 100%;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>


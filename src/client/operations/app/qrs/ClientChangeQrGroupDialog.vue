<template>
  <el-dialog :append-to-body="true"
             :class="$style.wrapper"
             :customClass="$style.elDialog"
             :title="`转移${groupDesignation}`"
             :visible.sync="visible"
             top="0"
             width="100%"
             @close="$emit('update:show', false)"
             @open="init">

    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="theModel"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="onSubmit">

      <el-form-item :label="`选择${groupDesignation}：`" prop="groupId">
        <el-select v-model="theModel.groupId"
                   :class="$style.theInput"
                   :placeholder="`请选择${groupDesignation}`"
                   filterable>

          <el-option v-for="group in managableGroups"
                     :key="group.id"
                     :label="group.name"
                     :value="group.id">
          </el-option>
        </el-select>
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
                 @click="onSubmit">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {createNamespacedHelpers, mapMutations} from 'vuex';
import qrApi from '@/common/api/qr-api';

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
      required: true
    },
  },

  data() {
    return {
      visible: this.show,
      theModel: {
        groupId: null,
      },

      rules: {
        groupId: [
          {required: true, message: '请选择', trigger: 'change'},
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
    ...mapMutations(['refreshClientAppOperationPage']),
    ...clientQrListStore.mapMutations([
      'changeQrGroupById',
    ]),

    init() {
      this.theModel.groupId = this.qr.groupId;
      this.$nextTick(() => {
        this.$refs['theForm'].clearValidate();
      });
    },

    onSubmit() {
      return this.$refs['theForm'].validate().then(() => {
        if (this.theModel.groupId === this.qr.groupId) {
          this.visible = false;
          return;
        }

        let command = {
          qrIds: [this.qr.id],
          groupId: this.theModel.groupId,
        };

        return qrApi.changeQrsGroup(command).then(() => {
          this.$message({
            type: 'success',
            message: `移动成功。`,
            center: true,
            duration: 1000,
          });

          this.visible = false;
          this.changeQrGroupById({qrId: this.qr.id, newGroupId: this.theModel.groupId});
          this.refreshClientAppOperationPage();
        });
      });
    },

    cancel() {
      this.visible = false;
    }
  },

  computed: {
    ...clientAppOperationStore.mapGetters([
      'managableGroups',
      'groupDesignation',
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

.theInput {
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


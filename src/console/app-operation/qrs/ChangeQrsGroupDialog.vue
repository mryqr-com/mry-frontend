<template>
  <el-dialog :append-to-body="true"
             :class="$style.wrapper"
             :title="`转移${groupDesignation}`"
             :visible.sync="visible"
             width="500px"
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
                 icon="el-icon-check"
                 size="medium"
                 type="primary"
                 @click="onSubmit">
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

    qrs: {
      type: Array,
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
    ...qrListStore.mapActions([
      QR_LIST_ACTIONS.LIST_MY_VIEWABLE_QRS
    ]),

    ...qrListStore.mapMutations([
      'resetBatchSelectedQrs',
    ]),

    init() {
      this.theModel.groupId = null;
      this.$nextTick(() => {
        this.$refs['theForm'].clearValidate();
      });
    },

    onSubmit() {
      return this.$refs['theForm'].validate().then(() => {
        let command = {
          qrIds: this.qrs.map(q => q.id),
          groupId: this.theModel.groupId,
        };

        this.visible = false;

        return qrApi.changeQrsGroup(command).then(() => {
          this.$message({
            type: 'success',
            message: `移动成功。`,
            center: true
          });
          this.resetBatchSelectedQrs();
          return this[QR_LIST_ACTIONS.LIST_MY_VIEWABLE_QRS]();
        });
      });
    },

    cancel() {
      this.visible = false;
    }
  },

  computed: {
    ...appOperationStore.mapGetters([
      'managableGroups',
      'groupDesignation',
    ]),
  }
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


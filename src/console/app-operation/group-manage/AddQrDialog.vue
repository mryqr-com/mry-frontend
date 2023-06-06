<template>
  <el-dialog :title="dialogTitle"
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
      <el-form-item label="名称：" prop="name">
        <el-input ref="nameBox"
                  v-model="theModel.name"
                  :class="$style.nameInput"
                  :maxlength="50"
                  :spellcheck="false"
                  placeholder="请输入名称"
                  size="medium">
        </el-input>
      </el-form-item>

      <div :class="$style.groupRow">{{ groupDesignationText }}：{{ groupName }}</div>
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

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');
const groupManageStore = createNamespacedHelpers('GROUP_MANAGE_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    groupId: {
      type: String,
    },
  },

  data() {
    return {
      apiInProgress: false,
      visible: this.show,
      theModel: {
        name: null,
      },

      rules: {
        name: [
          {required: true, message: '请输入名称', trigger: 'change'},
          {max: 50, message: '名称长度不能超过50个字符', trigger: 'change'},
        ],
      },
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  computed: {
    ...appOperationStore.mapGetters([
      'groupDesignation',
      'instanceDesignation',
    ]),

    ...groupManageStore.mapGetters(['groupNameOf']),

    dialogTitle() {
      return `新增${this.instanceDesignation}`;
    },

    groupDesignationText() {
      return this.groupDesignation === '分组' ? this.groupDesignation : `${this.groupDesignation}或分组`;
    },

    groupName() {
      if (this.groupId) {
        return this.groupNameOf(this.groupId);
      }
    }
  },

  methods: {
    ...groupManageStore.mapMutations(['addQr']),

    init() {
      this.theModel.name = null;
      this.apiInProgress = false;
      this.$nextTick(() => {
        this.$refs['nameBox'].focus();
        this.$refs['theForm'].clearValidate();
      });
    },

    onSubmit() {
      return this.$refs['theForm'].validate().then(() => {
        this.apiInProgress = true;

        let command = {
          name: this.theModel.name,
          groupId: this.groupId,
        };

        return qrApi.createQr(command).then((response) => {
          this.visible = false;
          this.$message({
            type: 'success',
            message: `创建成功。`,
            center: true
          });

          let data = response.data;
          let newQr = {
            id: data.qrId,
            plateId: data.plateId,
            name: command.name,
            groupId: command.groupId,
            headerImage: null,
            createdAt: Date.now(),
            active: true,
          };
          this.addQr(newQr);
        }).finally(() => {
          this.apiInProgress = false;
        });
      });
    },

    cancel() {
      this.visible = false;
    },
  },

}
</script>

<style lang="scss" module>
.nameInput {
  width: 100%;
}

.groupRow {
  padding-top: 5px;
  padding-bottom: 15px;
  font-size: 13px;
}

.footerButton {
  width: $dialogButtonWidth;
}
</style>


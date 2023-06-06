<template>
  <el-dialog :append-to-body="true"
             :class="$style.wrapper"
             :customClass="$style.elDialog"
             :title="`新增${instanceDesignation}`"
             :visible.sync="visible"
             top="0"
             width="100%"
             @close="$emit('update:show', false)"
             @open="initDialog">

    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="addFormData"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="onSubmit">

      <el-form-item label="名称：" prop="name">
        <el-input ref="nameBox"
                  v-model="addFormData.name"
                  :class="$style.formInput"
                  :maxlength="50"
                  :placeholder="`请输入${instanceDesignation}名称`"
                  :spellcheck="false">
        </el-input>
      </el-form-item>

      <div v-if="shouldDisableGroupSelect" :class="$style.staticGroupSection">{{ groupDesignation }}：
        <span :class="$style.staticGroupName">{{ groupNameOf(groupId) }}</span>
      </div>

      <el-form-item v-else :label="`${groupDesignation}：`" prop="groupId">
        <el-select v-model="addFormData.groupId"
                   :class="$style.formInput"
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
                 :disabled="apiInProgress"
                 icon="el-icon-plus"
                 type="primary"
                 @click="onSubmit">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import qrApi from '@/common/api/qr-api';

const clientAppOperationStore = createNamespacedHelpers('CLIENT_APP_OPERATION_STORE');
const clientQrListStore = createNamespacedHelpers('CLIENT_QR_LIST_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    }
  },

  data() {
    return {
      visible: this.show,
      apiInProgress: false,
      addFormData: {
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

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  methods: {
    initDialog() {
      this.addFormData.name = null;
      this.apiInProgress = false;
      this.addFormData.groupId = this.initGroupId();
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
        return qrApi.createQr(this.addFormData).then((response) => {
          this.$message({
            type: 'success',
            message: `【${this.addFormData.name}】添加成功。`,
            center: true,
          });
          this.$router.push({name: 'qr-home', params: {plateId: response.data.plateId}});
        }).finally(() => {
          this.apiInProgress = false;
        });
      });
    },

    cancel() {
      this.visible = false;
    },
  },

  computed: {
    ...clientAppOperationStore.mapGetters([
      'instanceDesignation',
      'groupDesignation',
      'managableGroups',
      'groupNameOf',
    ]),

    ...clientQrListStore.mapState([
      'groupId',
    ]),

    shouldDisableGroupSelect() {
      return this.groupId !== 'ALL';
    },
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

.formInput {
  width: 100%;
}

.staticGroupSection {
  margin-bottom: 20px;
}

.staticGroupName {
  color: $primaryTextColor;
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

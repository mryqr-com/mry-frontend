<template>
  <el-dialog :append-to-body="true"
             :class="$style.wrapper"
             :customClass="$style.elDialog"
             :title="dialogTitle"
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
                  :class="$style.nameInput"
                  :maxlength="50"
                  :placeholder="`请输入${groupDesignation}名称`"
                  :spellcheck="false">
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
import {createNamespacedHelpers, mapMutations} from "vuex";
import groupApi from "@/common/api/group-api";

const clientAppOperationStore = createNamespacedHelpers('CLIENT_APP_OPERATION_STORE');

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    parentGroupId: {
      type: String,
    }
  },

  data() {
    return {
      visible: this.show,
      apiInProgress: false,
      addFormData: {
        name: null,
      },

      rules: {
        name: [
          {required: true, message: `请输入名称`, trigger: 'change'},
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

  computed: {
    ...clientAppOperationStore.mapGetters([
      'groupDesignation',
      'appId',
      'groupNameOf',
    ]),

    dialogTitle() {
      if (this.parentGroupId) {
        return this.groupDesignation === '分组' ?
            `在【${this.groupNameOf(this.parentGroupId)}】下新建子分组` :
            `在【${this.groupNameOf(this.parentGroupId)}】下新建${this.groupDesignation}或子分组`;
      } else {
        return this.groupDesignation === '分组' ?
            '新建分组' :
            `新建${this.groupDesignation}或分组`;
      }
    },
  },

  methods: {
    ...mapMutations(['refreshClientHomePage']),

    initDialog() {
      this.addFormData.name = null;
      this.apiInProgress = false;
      this.$nextTick(() => {
        this.$refs['nameBox'].focus();
        this.$refs['theForm'].clearValidate();
      });
    },

    onSubmit() {
      return this.$refs['theForm'].validate().then(() => {
        let command = {
          name: this.addFormData.name,
          appId: this.appId,
          parentGroupId: this.parentGroupId,
        };

        this.apiInProgress = true;
        return groupApi.createGroup(command).then((response) => {
          this.$message({
            type: 'success',
            message: `${this.groupDesignation}【${this.addFormData.name}】添加成功。`,
            center: true,
            duration: 1000,
          });
          this.refreshClientHomePage();
        }).finally(() => {
          this.apiInProgress = false;
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

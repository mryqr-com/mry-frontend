<template>
  <el-dialog :class="$style.wrapper"
             :title="`为【${member.name}】设置密码`"
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

      <el-form-item ref="password-input-item" label="密码：" prop="password">
        <el-input ref="password-input"
                  v-model="theModel.password"
                  :class="$style.theInput"
                  :maxlength="20"
                  :spellcheck="false"
                  :validate-event="validated"
                  autocomplete="new-password"
                  placeholder="密码由8-20位字符组成，可以为字母，数字或特殊符号"
                  size="medium"
                  type="type">
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
                 @click="onSubmit">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import validations from '@/common/utils/validations';

import memberApi from '@/common/api/member-api';

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    member: {
      type: Object,
    }
  },

  data() {
    return {
      validated: false,
      visible: this.show,
      theModel: {
        password: null,
      },

      rules: {
        password: [
          {required: true, message: '请输入密码', trigger: 'change'},
          {validator: validations.PASSWORD_RULE, trigger: 'change'}
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
    init() {
      this.validated = false;
      this.theModel.password = null;
      let _this = this;
      setTimeout(function () {
        _this.$refs['theForm'].clearValidate();
        _this.$refs['password-input'].focus();
      }, 100);
    },

    onSubmit() {
      this.validated = true;
      return this.$refs['theForm'].validate().then(() => {
        this.visible = false;

        return memberApi.resetPasswordForMember(this.member.id, this.theModel).then(() => {
          this.$message({
            type: 'success',
            message: `更新密码成功。`,
            center: true
          });
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
  margin-top: 10px;
  width: $dialogButtonWidth;
}

</style>


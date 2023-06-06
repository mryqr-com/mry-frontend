<template>
  <div :class="$style.wrapper">
    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="theModel"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="submit">

      <el-form-item ref="mobile-or-email-input-item" prop="mobileOrEmail">
        <el-input v-model.trim="theModel.mobileOrEmail"
                  :class="$style.inputBox"
                  :maxlength="50"
                  :spellcheck="false"
                  :validate-event="validated"
                  autofocus
                  novalidate
                  placeholder="请输入手机号或邮箱"
                  prefix-icon="el-icon-user">
        </el-input>
      </el-form-item>

      <el-form-item ref="password-input-item" :class="$style.passwordItem" prop="password">
        <el-input v-model.trim="theModel.password"
                  :class="$style.inputBox"
                  :maxlength="20"
                  :spellcheck="false"
                  :validate-event="validated"
                  novalidate
                  placeholder="请输入密码"
                  prefix-icon="el-icon-lock"
                  type="password">
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button :class="$style.submitButton"
                   :disabled="apiInProgress"
                   icon="el-icon-check"
                   type="primary"
                   @click="submit">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import validations from '@/common/utils/validations';
import loginApi from '@/common/api/login-api';
import {errorOfApi, isApiErrorResponse} from '@/common/utils/common-utils';

export default {
  props: ['wxIdInfo'],

  data() {
    return {
      validated: false,
      apiInProgress: false,
      theModel: {
        mobileOrEmail: localStorage.loginMobileOrEmail,
        password: null
      },
      rules: {
        mobileOrEmail: [
          {required: true, message: '请输入手机号或邮箱', trigger: 'change'},
          {validator: validations.MOBILE_OR_EMAIL_RULE}
        ],

        password: [
          {required: true, message: '请输入密码', trigger: 'change'},
          {validator: validations.PASSWORD_RULE, trigger: 'change'}
        ],
      }
    }
  },

  methods: {
    submit() {
      this.validated = true;
      this.$refs['theForm'].validate().then(() => {
        let loginCommand = {
          mobileOrEmail: this.theModel.mobileOrEmail,
          password: this.theModel.password,
          wxIdInfo: this.wxIdInfo,
        };

        this.apiInProgress = true;
        loginApi.loginWithMobileOrEmail(loginCommand).then(() => {
          localStorage.loginMobileOrEmail = this.theModel.mobileOrEmail;
          this.$emit('loginSuccess');
        }).catch((e) => {
          let message = "登录失败。"
          if (isApiErrorResponse(e)) {
            message = errorOfApi(e).userMessage;
          }

          this.$message({
            type: 'error',
            message: message,
            center: true
          });
        }).finally(() => {
          this.apiInProgress = false;
        });
      });
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {

}

.inputBox {
  width: 100%;
}

.registerLink {
  display: none;
}

.passwordItem {
  margin-top: 30px;
}

.submitButton {
  width: 100%;
  margin-top: 20px;
}

@media (min-width: $mobileScreenBreakpoint), print {
  .registerLink {
    font-size: 13px;
    line-height: normal;
    font-style: italic;
    display: inline;
    float: right;
    color: $secondaryTextColor;
  }

  .registerLink:hover {
    color: $primaryThemeColor;
  }
}
</style>

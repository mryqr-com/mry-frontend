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

      <el-form-item ref="verification-input-item" :class="$style.verificationItem" prop="verification">
        <el-input v-model.trim="theModel.verification"
                  :class="$style.inputBox"
                  :maxlength="6"
                  :spellcheck="false"
                  :validate-event="validated"
                  novalidate
                  placeholder="请输入验证码"
                  prefix-icon="el-icon-lock">

          <el-button slot="append"
                     :class="$style.verificationButton"
                     :style="verificationButtonStyle"
                     type="plain"
                     @click="fetchVerification">
            {{ verificationText }}
          </el-button>
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
import verificationApi from '@/common/api/verification-code-api';
import loginApi from '@/common/api/login-api';
import {errorOfApi, isApiErrorResponse} from '@/common/utils/common-utils';

export default {
  props: ['wxIdInfo'],

  data() {
    return {
      validated: false,
      apiInProgress: false,
      verificationText: "获取验证码",
      disableVerification: false,
      theModel: {
        mobileOrEmail: localStorage.loginMobileOrEmail,
        verification: null
      },
      rules: {
        mobileOrEmail: [
          {required: true, message: '请输入手机号或邮箱', trigger: 'change'},
          {validator: validations.MOBILE_OR_EMAIL_RULE}
        ],

        verification: [
          {required: true, message: '请输入验证码', trigger: 'change'},
          {validator: validations.VERIFICATION_RULE, trigger: 'change'}
        ],
      }
    }
  },

  computed: {
    verificationButtonDisabled() {
      return this.disableVerification ||
          !this.theModel.mobileOrEmail ||
          !(validations.MOBILE_REGEX.test(this.theModel.mobileOrEmail) === true ||
              validations.EMAIL_REGEX.test(this.theModel.mobileOrEmail) === true);
    },

    verificationButtonStyle() {
      if (this.verificationButtonDisabled) {
        return {
          cursor: 'not-allowed',
          color: '#C0C4CC !important'
        }
      }
    },
  },

  methods: {
    submit() {
      this.validated = true;
      this.$refs['theForm'].validate().then(() => {
        let loginCommand = {
          mobileOrEmail: this.theModel.mobileOrEmail,
          verification: this.theModel.verification,
          wxIdInfo: this.wxIdInfo,
        };

        this.apiInProgress = true;
        loginApi.loginWithVerificationCode(loginCommand).then(() => {
          localStorage.loginMobileOrEmail = this.theModel.mobileOrEmail;
          this.$emit('loginSuccess');
        }).catch(() => {
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

    fetchVerification() {
      if (this.verificationButtonDisabled) {
        return;
      }

      this.disableVerification = true;
      let command = {mobileOrEmail: this.theModel.mobileOrEmail};
      return verificationApi.createVerificationCodeForLogin(command).then(() => {
        let counter = 1;
        let that = this;
        that.verificationText = `60秒后可重新发送`;

        const interval = setInterval(function () {
          that.verificationText = `${60 - counter}秒后可重新发送`;
          counter++;
          if (counter > 60) {
            clearInterval(interval);
            that.verificationText = '获取验证码';
            that.disableVerification = false;
          }
        }, 1000);
      }).catch((e) => {
        this.disableVerification = false;
        throw e;
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

.verificationItem {
  margin-top: 30px;
}

.verificationButton {
  color: $regularTextColor !important;
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

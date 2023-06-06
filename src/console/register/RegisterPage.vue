<template>
  <div :class="$style.wrapper">
    <Logo :class="$style.logoSection" @click="gotoMryOfficialSite"></Logo>

    <section :class="$style.registerSection">
      <div :class="$style.registerHeader">
        注册码如云
      </div>

      <el-form ref="theForm"
               :hide-required-asterisk="true"
               :model="theModel"
               :rules="rules"
               label-position="top"
               @submit.native.prevent="submit">
        <el-form-item ref="mobile-or-email-input-item" :class="$style.inputItem" prop="mobileOrEmail">
          <el-input v-model.trim="theModel.mobileOrEmail"
                    :class="$style.inputBox"
                    :maxlength="50"
                    :spellcheck="false"
                    :validate-event="validated"
                    autocomplete="off"
                    autofocus
                    novalidate
                    placeholder="手机号或邮箱"
                    prefix-icon="el-icon-user"
                    size="medium">
          </el-input>
        </el-form-item>

        <el-form-item ref="verification-input-item" :class="$style.inputItem" prop="verification">
          <el-input v-model.trim="theModel.verification"
                    :class="$style.inputBox"
                    :maxlength="6"
                    :spellcheck="false"
                    :validate-event="validated"
                    autocomplete="off"
                    novalidate
                    placeholder="验证码"
                    prefix-icon="el-icon-lock"
                    size="medium">

            <el-button slot="append"
                       :class="$style.verificationButton"
                       :style="verificationButtonStyle"
                       type="plain"
                       @click="fetchVerification">
              {{ verificationText }}
            </el-button>
          </el-input>
        </el-form-item>

        <el-form-item ref="password-input-item" :class="$style.inputItem" prop="password">
          <el-input v-model.trim="theModel.password"
                    :class="$style.inputBox"
                    :maxlength="20"
                    :spellcheck="false"
                    :validate-event="validated"
                    autocomplete="new-password"
                    novalidate
                    placeholder="设置密码"
                    prefix-icon="el-icon-lock"
                    size="medium"
                    type="password">
          </el-input>
        </el-form-item>

        <el-form-item :class="$style.inputItem" prop="username">
          <el-input v-model="theModel.username"
                    :class="$style.inputBox"
                    :maxlength="50"
                    :spellcheck="false"
                    autocomplete="off"
                    placeholder="您的姓名(用于团队协作)"
                    prefix-icon="el-icon-postcard"
                    size="medium">
          </el-input>
        </el-form-item>

        <el-form-item :class="$style.inputItem" prop="tenantName">
          <el-input v-model="theModel.tenantName"
                    :class="$style.inputBox"
                    :maxlength="50"
                    :spellcheck="false"
                    autocomplete="off"
                    placeholder="组织名称(用于页面信息展示)，比如：XXX公司"
                    prefix-icon="el-icon-office-building"
                    size="medium">
          </el-input>
        </el-form-item>

        <el-form-item :class="$style.agreementFormItem" prop="agreement">
          <el-checkbox v-model="theModel.agreement" size="medium">
            <div :class="$style.agreementText">
              我已阅读并同意
              <a class="primaryColoredTextLink" href="//docs.mryqr.com/terms/" target="_blank">《服务条款》</a>，
              <a class="primaryColoredTextLink" href="//docs.mryqr.com/privacy/" target="_blank">《隐私条款》</a>和
              <a class="primaryColoredTextLink" href="//docs.mryqr.com/rules/" target="_blank">《使用规范》</a>
            </div>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button :class="$style.registerButton"
                     :disabled="apiInProgress"
                     icon="el-icon-check"
                     size="medium"
                     type="primary"
                     @click="submit">
            注册
          </el-button>
        </el-form-item>
      </el-form>
    </section>

    <el-button :class="$style.loginButton" type="text" @click="gotoLoginPage">已有账号，直接登录</el-button>

    <RegisterSuccessDialog :show.sync="successViewVisible"></RegisterSuccessDialog>
  </div>
</template>

<script>
import validations from '@/common/utils/validations';
import RegisterSuccessDialog from '@/console/register/RegisterSuccessDialog';
import registerApi from '@/common/api/register-api';
import verificationApi from '@/common/api/verification-code-api';
import {
  goToMryOfficialWebsite,
  isSubdomainCustomized,
  replaceCurrentUrlWithSubdomain
} from '@/common/utils/common-utils';

export default {
  components: {
    RegisterSuccessDialog
  },

  data() {
    return {
      validated: false,
      apiInProgress: false,
      successViewVisible: false,
      verificationText: "获取验证码",
      disableVerification: false,
      theModel: {
        mobileOrEmail: null,
        verification: null,
        password: null,
        username: null,
        tenantName: null,
        agreement: false
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

        password: [
          {required: true, message: '请输入密码', trigger: 'change'},
          {validator: validations.PASSWORD_RULE, trigger: 'change'}
        ],

        username: [
          {required: true, message: '请输入姓名', trigger: 'change'},
          {max: 50, message: '姓名不能超过50个字符', trigger: 'change'},
        ],

        tenantName: [
          {required: true, message: '请输入组织名称', trigger: 'change'},
          {max: 50, message: '组织名称不能超过50个字符', trigger: 'change'},
        ],

        agreement: [
          {validator: this.AGREEMENT_RULE, trigger: 'change'}
        ],
      }
    }
  },

  mounted() {
    this.validated = false;
    document.title = '注册码如云';
    if (isSubdomainCustomized()) {
      location.replace(replaceCurrentUrlWithSubdomain('console'));
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
    gotoMryOfficialSite() {
      goToMryOfficialWebsite();
    },

    AGREEMENT_RULE: (rule, value, callback) => {
      if (!value) {
        callback(new Error('请同意用户条款和隐私条款以完成注册'));
      } else {
        callback();
      }
    },

    submit() {
      this.validated = true;
      return this.$refs['theForm'].validate().then(() => {
        this.apiInProgress = true;
        return registerApi.register(this.theModel).then(() => {
          localStorage.loginMobileOrEmail = this.theModel.mobileOrEmail;
          this.$refs['theForm'].resetFields();
          this.successViewVisible = true;
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
      return verificationApi.createVerificationCodeForRegister(command).then(() => {
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

    gotoLoginPage() {
      this.$router.push({name: 'login'});
    },
  }
};
</script>

<style lang="scss" module>
.wrapper {
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background-position: center;
  background-size: cover;
  background-image: linear-gradient(#b9e3ff, white);
}

.logoSection {
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 20px;
  margin-left: 20px;
  cursor: pointer;
}

.registerSection {
  margin-left: auto;
  margin-right: auto;
  width: 500px;
  background-color: white;
  padding: 24px;
  box-shadow: $pageShadow;
}

.registerHeader {
  color: $primaryTextColor;
  font-size: 24px;
  font-weight: 500;
  margin-top: 10px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.inputItem {
  margin-top: 30px;
}

.verificationButton {
  color: $regularTextColor !important;
}

.agreementText {
  display: flex;
}

.registerButton {
  width: 100%;
}

.inputBox {
  width: 100%;
}

.agreementFormItem {
  :global {
    .el-form-item__content {
      line-height: normal;
      margin-top: 15px;
      margin-bottom: 15px;
    }
  }
}

.loginButton {
  margin-top: 20px;
  font-weight: normal;
}

</style>

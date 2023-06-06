<template>
  <div v-if="ready" :class="$style.wrapper">
    <div :class="$style.headerSection">
      <Logo :class="$style.logo" :iconFile="logo" :name="tenantName" @click="goToHomePage"></Logo>
    </div>

    <div :class="$style.mainSection">
      <div :class="$style.mainTitle">
        找回密码
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
                    placeholder="请输入手机号或邮箱"
                    prefix-icon="el-icon-user">
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

        <el-form-item ref="password-input-item" :class="$style.inputItem" prop="password">
          <el-input v-model.trim="theModel.password"
                    :class="$style.inputBox"
                    :maxlength="20"
                    :spellcheck="false"
                    :validate-event="validated"
                    autocomplete="new-password"
                    novalidate
                    placeholder="请设置新密码"
                    prefix-icon="el-icon-lock"
                    type="password">
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button :class="$style.submitButton"
                     icon="el-icon-check"
                     type="primary"
                     @click="submit">
            提交
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {changeFavIcon, currentSubdomainPrefix, isSubdomainCustomized} from '@/common/utils/common-utils';
import tenantApi from '@/common/api/tenant-api';
import {imageThumbnailUrl} from '@/common/utils/image-utils'
import memberApi from '@/common/api/member-api';
import validations from '@/common/utils/validations';
import verificationApi from '@/common/api/verification-code-api';
import loginApi from '@/common/api/login-api';

export default {
  data() {
    return {
      ready: true,
      validated: false,
      tenantName: null,
      logo: null,
      loginBackground: null,

      verificationText: "获取验证码",
      disableVerification: false,

      theModel: {
        mobileOrEmail: null,
        verification: null,
        password: null
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
          {required: true, message: '请输入新密码', trigger: 'change'},
          {validator: validations.PASSWORD_RULE, trigger: 'change'}
        ],
      }
    }
  },

  mounted() {
    this.validated = false;
    if (isSubdomainCustomized()) {
      let subdomainPrefix = currentSubdomainPrefix();
      tenantApi.fetchTenantPublicProfile(subdomainPrefix).then((response) => {
        const profile = response.data;
        this.tenantName = profile.name;
        this.logo = profile.logo;
        this.loginBackground = profile.loginBackground;
        if (this.logo) {
          changeFavIcon(imageThumbnailUrl(this.logo));
        }
        document.title = `找回密码 - ${this.tenantName}`;
      }).catch(() => {
        console.error("Failed to fetch tenant public profile, use mry's defaults.");
      }).finally(() => {
        this.ready = true;
      })
    } else {
      document.title = `找回密码 - 码如云`;
      this.ready = true;
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
        let command = {
          mobileOrEmail: this.theModel.mobileOrEmail,
          verification: this.theModel.verification,
          password: this.theModel.password,
        };

        return memberApi.findBackPassword(command).then(() => {
          loginApi.logout().finally(() => {
            this.$message({
              type: 'success',
              message: `成功修改密码。`,
              center: true
            });

            this.$router.replace({name: 'login', query: {forcePageLogin: true}});
          });
        });

      });
    },

    fetchVerification() {
      if (this.verificationButtonDisabled) {
        return;
      }

      this.disableVerification = true;
      let command = {mobileOrEmail: this.theModel.mobileOrEmail};
      return verificationApi.createVerificationCodeForFindbackPassword(command).then(() => {
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

    goToHomePage() {
      this.$router.push({name: 'default-home'});
    }
  },
};
</script>

<style lang="scss" module>
.wrapper {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(#b9e3ff, white);
}

.headerSection {
  padding: 0 24px;
  height: 60px;
  width: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  top: 0;
  left: 0;
}

.logo {
  cursor: pointer;
}

.mainSection {
  width: 500px;
  background-color: white;
  padding: 24px;
  box-shadow: $pageShadow;
}

.mainTitle {
  margin-top: 10px;
  font-weight: 500;
  font-size: 24px;
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  justify-content: center;
  color: $primaryTextColor;
}

.inputItem {
  margin-top: 30px;
}

.inputBox {
  width: 100%;
}

.verificationButton {
  color: $regularTextColor !important;
}

.submitButton {
  width: 100%;
  margin-top: 20px;
}

@media (max-width: $mobileScreenBreakpoint) {
  .wrapper {
    background: linear-gradient(white, white);
  }

  .headerSection {
    border-bottom: none;
  }

  .mainSection {
    margin-bottom: 100px;
    border: none;
    box-shadow: none;
  }
}

</style>

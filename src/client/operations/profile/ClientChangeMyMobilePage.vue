<template>
  <div :class="$style.wrapper">
    <div :class="$style.title">更改手机号</div>
    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="theModel"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="submit">

      <el-form-item ref="mobile-input-item" label="新手机号：" prop="mobile">
        <el-input ref="mobile-box"
                  v-model.trim="theModel.mobile"
                  :class="$style.commonInput"
                  :maxlength="11"
                  :spellcheck="false"
                  :validate-event="validated"
                  novalidate
                  placeholder="请输入新的手机号"
                  title="新手机号码"
                  type="tel">
        </el-input>
      </el-form-item>

      <el-form-item ref="verification-input-item" label="验证码：" prop="verification">
        <el-input v-model.trim="theModel.verification"
                  :class="$style.commonInput"
                  :maxlength="6"
                  :spellcheck="false"
                  :validate-event="validated"
                  novalidate
                  placeholder="发往新手机的验证码"
                  title="发往新手机的验证码">

          <el-button slot="append"
                     :class="$style.verificationButton"
                     :style="verificationButtonStyle"
                     type="plain"
                     @click="fetchVerification">
            {{ verificationText }}
          </el-button>
        </el-input>
      </el-form-item>

      <el-form-item ref="password-input-item" label="密码：" prop="password">
        <el-input v-model.trim="theModel.password"
                  :class="$style.commonInput"
                  :maxlength="20"
                  :validate-event="validated"
                  autocomplete="new-password"
                  novalidate
                  placeholder="请输入登录密码"
                  title="登录密码"
                  type="password">
        </el-input>
      </el-form-item>
    </el-form>

    <div :class="$style.buttonArea">
      <el-button :class="$style.aButton"
                 icon="el-icon-close"
                 type="plain"
                 @click="cancel">
        取消
      </el-button>

      <el-button :class="$style.aButton"
                 icon="el-icon-check"
                 type="primary"
                 @click="submit">
        确定
      </el-button>
    </div>
  </div>
</template>

<script>
import memberApi from '@/common/api/member-api';
import validations from "@/common/utils/validations";
import verificationApi from "@/common/api/verification-code-api";

export default {
  data() {
    return {
      validated: false,
      verificationText: "获取验证码",
      disableVerification: false,
      theModel: {
        mobile: null,
        verification: null,
        password: null
      },
      rules: {
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'change'},
          {validator: validations.MOBILE_RULE}
        ],

        verification: [
          {required: true, message: '请输入验证码', trigger: 'change'},
          {validator: validations.VERIFICATION_RULE, trigger: 'change'}
        ],

        password: [
          {required: true, message: '请输入密码', trigger: 'change'},
          {validator: validations.PASSWORD_RULE, trigger: 'change'}
        ],
      }
    }
  },

  mounted() {
    this.validated = false;
  },

  computed: {
    verificationButtonDisabled() {
      return this.disableVerification || !this.theModel.mobile || validations.MOBILE_REGEX.test(this.theModel.mobile) === false;
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
      return this.$refs['theForm'].validate().then(() => {
        return memberApi.changeMyMobile(this.theModel);
      }).then(() => {
        this.$message({
          type: 'success',
          message: `手机号更改成功。`,
          duration: 2000,
          center: true
        });
        this.$router.push({name: 'client-me'})
      });
    },

    fetchVerification() {
      if (this.verificationButtonDisabled) {
        return;
      }

      this.disableVerification = true;
      let command = {mobile: this.theModel.mobile};
      return verificationApi.createVerificationCodeForChangeMobile(command).then(() => {
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

    cancel() {
      this.$router.push({name: 'client-me'});
    }
  },
}
</script>


<style lang="scss" module>
.wrapper {
  padding: 15px;
  height: 100%;
  background-color: white;
  position: relative;
  z-index: $clientPageZIndex;
}

.title {
  font-size: 18px;
  font-weight: 500;
  margin-top: 15px;
  margin-bottom: 10px;
}

.commonInput {
  width: 100%;
}

.verificationButton {
  color: $regularTextColor !important;
}

.buttonArea {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
}

.aButton {
  width: $pageButtonWidth;
}

</style>

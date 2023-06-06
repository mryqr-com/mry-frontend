<template>
  <el-dialog :append-to-body="true"
             :class="$style.wrapper"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :show-close="false"
             :visible.sync="visible"
             title="真实身份认证"
             width="500px"
             @close="$emit('update:show', false)"
             @open="initDialog">
    <div :class="$style.tips">根据《中华人民共和国网络安全法》的规定，我们将对信息发布者进行真实身份登记，为此请您完成手机号认证。</div>

    <el-form ref="theForm"
             :hide-required-asterisk="false"
             :model="theModel"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="submit">
      <el-form-item ref="mobile-input-item" label="手机号：" prop="mobile">
        <el-input ref="mobile-box"
                  v-model.trim="theModel.mobile"
                  :class="$style.commonInput"
                  :maxlength="11"
                  :spellcheck="false"
                  :validate-event="validated"
                  novalidate
                  placeholder="请输入手机号"
                  size="medium"
                  title="手机号码"
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
                  placeholder="请输入验证码"
                  size="medium"
                  title="验证码">
          <el-button slot="append"
                     :class="$style.verificationButton"
                     :style="verificationButtonStyle"
                     type="plain"
                     @click="fetchVerification">
            {{ verificationText }}
          </el-button>
        </el-input>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button :class="$style.footerButton"
                 icon="el-icon-check"
                 size="medium"
                 type="primary"
                 @click="submit">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import verificationApi from "@/common/api/verification-code-api";
import validations from "@/common/utils/validations";
import memberApi from '@/common/api/member-api';
import {mapMutations} from 'vuex';

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
      validated: false,
      verificationText: "获取验证码",
      disableVerification: false,
      theModel: {
        mobile: null,
        verification: null,
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
      }
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
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
    ...mapMutations(['refreshWholeConsole']),

    initDialog() {
      this.validated = false;
      this.verificationText = '获取验证码';
      this.disableVerification = false;
      this.theModel.mobile = null;
      this.theModel.verification = null;
    },

    submit() {
      this.validated = true;
      return this.$refs['theForm'].validate().then(() => {
        return memberApi.identifyMyMobile(this.theModel).then(() => {
          this.visible = false;
          this.$message({
            type: 'success',
            message: `身份认证成功。`,
            center: true
          });
          this.refreshWholeConsole();
        });
      });
    },

    fetchVerification() {
      if (this.verificationButtonDisabled) {
        return;
      }

      let _this = this;
      this.$refs['theForm'].validateField('mobile', function () {
        _this.disableVerification = true;
        let command = {mobile: _this.theModel.mobile};
        return verificationApi.createVerificationCodeForIdentifyMobile(command).then(() => {
          let counter = 1;
          _this.verificationText = `60秒后可重新发送`;

          const interval = setInterval(function () {
            _this.verificationText = `${60 - counter}秒后可重新发送`;
            counter++;
            if (counter > 60) {
              clearInterval(interval);
              _this.verificationText = '获取验证码';
              _this.disableVerification = false;
            }
          }, 1000);
        }).catch((e) => {
          _this.disableVerification = false;
          throw e;
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
    .el-dialog__body {
      padding-bottom: 10px;
    }
  }
}

.tips {
  line-height: 1.6em;
  margin-bottom: 10px;
}

.commonInput {
  width: 100%;
}

.verificationButton {
  color: $regularTextColor !important;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>

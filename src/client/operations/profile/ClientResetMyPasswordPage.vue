<template>
  <div :class="$style.wrapper">
    <div :class="$style.title">修改密码</div>
    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="theModel"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="onSubmit">

      <el-form-item ref="old-password-input-item" label="原密码：" prop="oldPassword">
        <el-input ref="old-password-box"
                  v-model.trim="theModel.oldPassword"
                  :class="$style.commonInput"
                  :maxlength="20"
                  :spellcheck="false"
                  :validate-event="validated"
                  autocomplete="new-password"
                  novalidate
                  placeholder="请输入您的原密码"
                  title="原密码"
                  type="password">
        </el-input>
      </el-form-item>

      <el-form-item ref="new-password-input-item" label="新密码：" prop="newPassword">
        <el-input v-model.trim="theModel.newPassword"
                  :class="$style.commonInput"
                  :maxlength="20"
                  :spellcheck="false"
                  :validate-event="validated"
                  autocomplete="new-password"
                  novalidate
                  placeholder="请输入新密码"
                  title="新密码"
                  type="password">
        </el-input>
      </el-form-item>

      <el-form-item ref="confirm-new-password-input-item" label="再次输入新密码：" prop="confirmNewPassword">
        <el-input v-model.trim="theModel.confirmNewPassword"
                  :class="$style.commonInput"
                  :maxlength="20"
                  :spellcheck="false"
                  :validate-event="validated"
                  autocomplete="new-password"
                  novalidate
                  placeholder="请再次输入新密码"
                  title="确认新密码"
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
                 @click="onSubmit">
        确定
      </el-button>
    </div>
  </div>
</template>

<script>
import memberApi from '@/common/api/member-api';
import validations from "@/common/utils/validations";

export default {
  data() {
    let shouldBeTheSameWithNewPassword = (rule, value, callback) => {
      if (value && value !== this.theModel.newPassword) {
        callback(new Error('确认新密码必须与新密码相同！'));
      } else {
        callback();
      }
    };

    return {
      validated: false,
      theModel: {
        oldPassword: null,
        newPassword: null,
        confirmNewPassword: null
      },

      rules: {
        oldPassword: [
          {required: true, message: '请输入原密码', trigger: 'change'},
          {validator: validations.PASSWORD_RULE, trigger: 'change'}
        ],

        newPassword: [
          {required: true, message: '请输入新密码', trigger: 'change'},
          {validator: validations.PASSWORD_RULE, trigger: 'change'}
        ],

        confirmNewPassword: [
          {required: true, message: '请确认新密码', trigger: 'change'},
          {validator: validations.PASSWORD_RULE, trigger: 'change'},
          {validator: shouldBeTheSameWithNewPassword, trigger: 'change'}
        ],
      }
    }
  },

  mounted() {
    this.validated = false;
  },

  methods: {
    onSubmit() {
      this.validated = true;
      return this.$refs['theForm'].validate().then(() => {
        return memberApi.changeMyPassword(this.theModel);
      }).then(() => {
        this.$message({
          type: 'success',
          message: `密码修改成功。`,
          duration: 2000,
          center: true
        });
        this.$router.push({name: 'client-me'})
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

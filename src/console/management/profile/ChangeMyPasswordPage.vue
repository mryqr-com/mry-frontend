<template>
  <div :class="$style.wrapper">
    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="theModel"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="onSubmit">
      <el-form-item ref="old-password-input-item" label="原密码：" prop="oldPassword">
        <el-input v-model.trim="theModel.oldPassword"
                  :class="$style.commonInput"
                  :maxlength="20"
                  :validate-event="validated"
                  autocomplete="new-password"
                  novalidate
                  placeholder="请输入您的原密码"
                  size="medium"
                  title="原密码"
                  type="password">
        </el-input>
      </el-form-item>

      <el-form-item ref="new-password-input-item" label="新密码：" prop="newPassword">
        <el-input v-model.trim="theModel.newPassword"
                  :class="$style.commonInput"
                  :maxlength="20"
                  :validate-event="validated"
                  autocomplete="new-password"
                  novalidate
                  placeholder="请输入新密码"
                  size="medium"
                  title="新密码"
                  type="password">
        </el-input>
      </el-form-item>

      <el-form-item ref="confirm-new-password-input-item" label="再次输入新密码：" prop="confirmNewPassword">
        <el-input v-model.trim="theModel.confirmNewPassword"
                  :class="$style.commonInput"
                  :maxlength="20"
                  :validate-event="validated"
                  autocomplete="new-password"
                  novalidate
                  placeholder="请再次输入新密码"
                  size="medium"
                  title="确认新密码"
                  type="password">
        </el-input>
      </el-form-item>
    </el-form>

    <el-button :class="$style.saveButton"
               icon="el-icon-check"
               size="medium"
               type="primary"
               @click="onSubmit">
      确认修改密码
    </el-button>
  </div>
</template>

<script>
import validations from "@/common/utils/validations";
import memberApi from '@/common/api/member-api';

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
  methods: {
    onSubmit() {
      this.validated = true;
      return this.$refs['theForm'].validate().then(() => {
        return memberApi.changeMyPassword(this.theModel);
      }).then(() => {
        this.$message({
          type: 'success',
          message: `密码修改成功。`,
          center: true
        });
        this.$router.replace({name: 'my-info'})
      });
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {

}

.commonInput {
  width: 300px;
}

.saveButton {
  margin-top: 24px;
}
</style>

<template>
  <el-dialog :class="$style.wrapper"
             :visible.sync="visible"
             title="Webhook集成配置"
             width="500px"
             @close="$emit('update:show', false)"
             @open="init">
    <el-alert v-if="!isDeveloperAllowed"
              :class="$style.planAlert"
              :closable="false"
              effect="light"
              type="warning">
                <span slot="title">{{ planWarningText }}
                  <template v-if="isTenantAdmin">如需使用请前往
                    <router-link v-if="isTenantAdmin" :class="$style.purchaseLink" :to="{name:'purchase-packages'}">
                        套餐购买页面
                    </router-link>
                    完成套餐升级或续费。
                  </template>
                  <template v-else>
                    如需使用请联系系统管理员完成套餐升级或续费。
                  </template>
                </span>
    </el-alert>

    <template v-else>
      <el-alert v-if="webhookSetting.notAccessible && webhookSetting.enabled"
                :class="$style.notAccessibleAlert"
                :closable="false"
                effect="light"
                type="warning">
        当前应用的Webhook无法正常访问，已由系统自动停用，如需继续使用请确保以下配置信息的正确性并保存，保存成功后系统将为您重启该Webhook功能。
      </el-alert>

      <el-form ref="theForm"
               :hide-required-asterisk="true"
               :model="webhookSetting"
               :rules="rules"
               label-position="top"
               @submit.native.prevent="submit">
        <el-checkbox v-model="webhookSetting.enabled">启用Webhook功能</el-checkbox>

        <template v-if="webhookSetting.enabled">
          <el-form-item ref="url-input-item" label="URL：" prop="url">
            <el-input v-model.trim="webhookSetting.url"
                      :class="$style.theInput"
                      :maxlength="1024"
                      :spellcheck="false"
                      :validate-event="webhookValidated"
                      autocomplete="off"
                      size="medium"
                      title="设置接收Webhook的URL地址，建议使用HTTPS"
                      type="text"
                      @focus="$refs['url-input-item'].clearValidate()">
            </el-input>
          </el-form-item>

          <el-form-item ref="username-input-item" label="用户名：" prop="username">
            <el-input v-model.trim="webhookSetting.username"
                      :class="$style.theInput"
                      :maxlength="50"
                      :spellcheck="false"
                      :validate-event="webhookValidated"
                      autocomplete="off"
                      placeholder="HTTP基本认证用户名"
                      size="medium"
                      title="HTTP基本认证用户名"
                      type="text"
                      @focus="$refs['username-input-item'].clearValidate()">
            </el-input>
          </el-form-item>

          <el-form-item ref="password-input-item" label="密码：" prop="password">
            <el-input v-model.trim="webhookSetting.password"
                      :class="$style.theInput"
                      :maxlength="50"
                      :spellcheck="false"
                      :type="webhookPasswordInputType"
                      :validate-event="webhookValidated"
                      autocomplete="new-password"
                      placeholder="HTTP基本认证密码"
                      size="medium"
                      title="HTTP基本认证密码"
                      @focus="$refs['password-input-item'].clearValidate()">
              <el-button slot="append"
                         :class="$style.toggleWebhookPasswordButton"
                         size="medium"
                         type="plain"
                         @click="toggleWebhookPasswordView">
                <icon :icon="webhookPasswordToggleIcon"></icon>
              </el-button>
            </el-input>
          </el-form-item>
        </template>
      </el-form>
    </template>

    <div slot="footer">
      <el-button :class="$style.footerButton"
                 icon="el-icon-close"
                 size="medium"
                 type="plain"
                 @click="cancel">
        {{ isDeveloperAllowed ? '取消' : '关闭' }}
      </el-button>

      <el-button v-if="isDeveloperAllowed" :class="$style.footerButton"
                 icon="el-icon-check"
                 size="medium"
                 type="primary"
                 @click="submit">
        保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import appApi from '@/common/api/app-api';
import validations from "@/common/utils/validations";
import {mapGetters} from 'vuex';

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    app: {
      type: Object,
    },
  },

  data() {
    return {
      visible: this.show,
      webhookValidated: false,
      webhookPasswordViewable: false,
      webhookSetting: {
        enabled: false,
        notAccessible: false,
        url: null,
        username: null,
        password: null,
      },

      rules: {
        url: [
          {required: true, message: '请输入URL', trigger: 'change'},
          {max: 1024, message: 'URL不能超过1024个字符', trigger: 'change'},
          {validator: validations.HTTP_URL_RULE, trigger: 'change'},
          {validator: validations.WEBHOOK_URL_RULE, trigger: 'change'}
        ],

        username: [
          {required: true, message: '请输入用户名', trigger: 'change'},
          {max: 50, message: '用户名不能超过50个字符', trigger: 'change'},
        ],

        password: [
          {required: true, message: '请输入密码', trigger: 'change'},
          {max: 50, message: '密码不能超过50个字符', trigger: 'change'},
          {min: 8, message: '密码至少8个字符', trigger: 'change'},
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
    ...mapGetters([
      'currentPlanName',
      'isCurrentPlanExpired',
      'isDeveloperAllowed',
      'isTenantAdmin',
    ]),

    planWarningText() {
      if (this.isCurrentPlanExpired) {
        return `您当前的${this.currentPlanName}套餐已过期，有效套餐已降为免费版，无法使用Webhook集成功能；`;
      }

      return `您当前是${this.currentPlanName}套餐，无法使用Webhook集成功能；`
    },

    webhookPasswordToggleIcon() {
      return this.webhookPasswordViewable ? 'eye-slash' : 'eye';
    },

    webhookPasswordInputType() {
      return this.webhookPasswordViewable ? 'text' : 'password';
    },
  },

  methods: {
    init() {
      this.webhookValidated = false;
      this.webhookPasswordViewable = false;
      this.webhookSetting = {
        enabled: false,
        notAccessible: false,
        url: null,
        username: null,
        password: null,
      };

      return appApi.fetchAppWebhookSetting(this.app.id).then(response => {
        this.webhookSetting = response.data.webhookSetting;
        this.$nextTick(() => {
          let theForm = this.$refs['theForm'];
          if (theForm) {
            theForm.clearValidate();
          }
        });
      }).catch(err => {
        this.visible = false;
        throw err;
      });
    },

    toggleWebhookPasswordView() {
      this.webhookPasswordViewable = !this.webhookPasswordViewable;
    },

    submit() {
      if (!this.webhookSetting.enabled) {
        this.webhookSetting.url = null;
        this.webhookSetting.username = null;
        this.webhookSetting.password = null;
      }

      this.webhookValidated = true;
      return this.$refs['theForm'].validate().then(() => {
        this.visible = false;

        return appApi.updateAppWebhookSetting(this.app.id, {webhookSetting: this.webhookSetting}).then(() => {
          this.$message({
            type: 'success',
            message: `成功更新Webhook集成信息。`,
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
  :global {
    .el-dialog__body {
      padding-bottom: 10px;
    }
  }
}

.planAlert {
  word-break: break-word;
}

.notAccessibleAlert {
  margin-bottom: 24px;
}

.purchaseLink {
  text-decoration: underline;
  color: $primaryThemeColor;
}

.purchaseLink:visited {
  color: $primaryThemeColor;
}

.theInput {
  width: 100%;
}

.toggleWebhookPasswordButton {
  color: $regularTextColor !important;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>


<template>
  <div :class="$style.wrapper">
    <div v-if="!isCustomSubdomainAllowed" :class="$style.planWarning">
      <el-alert :closable="false"
                effect="dark"
                type="warning">
                <span slot="title">{{ planWarningText }}
                    <router-link :class="$style.purchaseLink" :to="{name:'purchase-packages'}">
                        前往套餐购买页面<i class="el-icon-right"></i>
                    </router-link>
                </span>
      </el-alert>
    </div>

    <template v-if="isCustomSubdomainAllowed && loaded">
      <div :class="$style.note">子域名设置只针对电脑运营端，设置好后，请联系
        <MryCustomerServiceText></MryCustomerServiceText>
        为您开通子域名解析功能，开通后再次访问页面时系统将自动跳转到子域名。
      </div>

      <el-form ref="theForm"
               :hide-required-asterisk="true"
               :model="theModel"
               :rules="rules"
               label-position="top"
               @submit.native.prevent="onSubmit">

        <el-form-item ref="subdomainInput" label="子域名(一个月内只允许更新一次)：" prop="subdomainPrefix">
          <el-input v-model.trim="theModel.subdomainPrefix"
                    :class="$style.commonInput"
                    :disabled="!updatable"
                    :maxlength="20"
                    :spellcheck="false"
                    :validate-event="validated"
                    size="medium"
                    title="子域名，设置后系统将自动使用该子域名，最长20个字符，子域名由字母、数字、或中划线组成，只能以数字或字母开始，同时只能以数字或字母结束">
          </el-input>
          <span>.{{ baseDomainName }}</span>
        </el-form-item>
      </el-form>

      <el-button :class="$style.saveButton"
                 :disabled="!updatable"
                 icon="el-icon-check"
                 size="medium"
                 type="primary"
                 @click="onSubmit">
        保存
      </el-button>
    </template>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

import validations from '@/common/utils/validations';
import tenantApi from '@/common/api/tenant-api';

export default {
  data() {
    return {
      theModel: {
        subdomainPrefix: null,
      },

      loaded: false,
      updatable: false,
      validated: false,
      rules: {
        subdomainPrefix: [
          {min: 2, message: '子域名至少需要包含2个字符', trigger: 'change'},
          {max: 20, message: '子域名不能超过20个字符', trigger: 'change'},
          {validator: validations.SUBDOMAIN_RULE, trigger: 'change'}
        ],
      }
    }
  },

  created() {
    if (!this.isCustomSubdomainAllowed) {
      return;
    }

    return tenantApi.fetchTenantSubdomain().then((response) => {
      let theSetting = response.data;
      this.theModel.subdomainPrefix = theSetting.subdomainPrefix;
      this.updatable = theSetting.updatable;
      this.loaded = true;
    });
  },

  methods: {
    onSubmit() {
      this.validated = true;
      return this.$refs['theForm'].validate().then(() => {
        return tenantApi.updateTenantSubdomain(this.theModel).then(() => {
          this.updatable = false;
          this.$message({
            type: 'success',
            message: `更新成功。`,
            center: true
          });
        });
      });
    },
  },

  computed: {
    ...mapGetters([
      'tenantId',
      'currentPlanName',
      'isCurrentPlanExpired',
      'baseDomainName',
      'isCustomSubdomainAllowed',
    ]),

    planWarningText() {
      if (this.isCurrentPlanExpired) {
        return `您当前的${this.currentPlanName}套餐已过期，有效套餐已降为免费版，无法设置子域名，如需设置请续费或升级。`;
      }

      return `您当前是${this.currentPlanName}套餐，无法设置子域名，如需设置请升级。`
    },

  }

}
</script>


<style lang="scss" module>
.wrapper {

}

.planWarning {
  margin-bottom: 15px;
}

.purchaseLink {
  color: white;
  text-decoration: underline;
}

.purchaseLink:visited {
  color: white;
}

.commonInput {
  width: 300px;

  input {
    text-align: right;
  }
}

.note {
  color: $secondaryTextColor;
  line-height: 1.3em;
  margin-bottom: 15px;
}

.saveButton {
  margin-top: 24px;
  width: $pageButtonWidth;
}

</style>

<template>
  <div v-if="loaded" :class="$style.wrapper">
    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="theModel"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="onSubmit">
      <el-form-item ref="title" label="发票抬头：" prop="title">
        <el-input v-model="theModel.title"
                  :class="$style.commonInput"
                  :maxlength="100"
                  :spellcheck="false"
                  :validate-event="validated"
                  placeholder="请与营业执照上的名称保持一致"
                  size="medium"
                  title="请与营业执照上的名称保持一致">
        </el-input>
      </el-form-item>

      <el-form-item ref="unifiedCode" label="统一社会信用代码：" prop="unifiedCode">
        <el-input v-model="theModel.unifiedCode"
                  :class="$style.commonInput"
                  :maxlength="50"
                  :spellcheck="false"
                  :validate-event="validated"
                  placeholder="请与营业执照上的统一社会信用代码保持一致"
                  size="medium"
                  title="请与营业执照上的统一社会信用代码保持一致">
        </el-input>
      </el-form-item>

      <el-form-item ref="bankName" label="开户银行：" prop="bankName">
        <el-input v-model="theModel.bankName"
                  :class="$style.commonInput"
                  :maxlength="100"
                  :spellcheck="false"
                  :validate-event="validated"
                  placeholder="开户银行名称"
                  size="medium"
                  title="开户银行名称">
        </el-input>
      </el-form-item>

      <el-form-item ref="bankAccount" label="银行账号：" prop="bankAccount">
        <el-input v-model="theModel.bankAccount"
                  :class="$style.commonInput"
                  :maxlength="50"
                  :spellcheck="false"
                  :validate-event="validated"
                  size="medium"
                  title="银行账号">
        </el-input>
      </el-form-item>

      <el-form-item ref="address" label="注册地址：" prop="address">
        <el-input v-model="theModel.address"
                  :class="$style.commonInput"
                  :maxlength="100"
                  :rows="3"
                  :spellcheck="false"
                  :validate-event="validated"
                  size="medium"
                  title="注册地址"
                  type="textarea">
        </el-input>
      </el-form-item>

      <el-form-item ref="phone" label="注册电话：" prop="phone">
        <el-input v-model="theModel.phone"
                  :class="$style.commonInput"
                  :maxlength="50"
                  :spellcheck="false"
                  :validate-event="validated"
                  size="medium"
                  title="注册电话">
        </el-input>
      </el-form-item>
    </el-form>

    <el-button :class="$style.saveButton"
               icon="el-icon-check"
               size="medium"
               type="primary"
               @click="onSubmit">
      保存
    </el-button>
  </div>
</template>

<script>
import tenantApi from '@/common/api/tenant-api';
import validations from "@/common/utils/validations";

export default {
  data() {
    return {
      theModel: {
        title: null,
        unifiedCode: null,
        bankName: null,
        bankAccount: null,
        address: null,
        phone: null,
      },

      validated: false,
      loaded: false,

      rules: {
        title: [
          {required: true, message: '请输入发票抬头', trigger: 'change'},
          {max: 100, message: '账户名称不能超过100个字符', trigger: 'change'},
        ],

        unifiedCode: [
          {required: true, message: '请输入统一社会信用代码', trigger: 'change'},
          {validator: validations.UNIFIED_CODE_RULE, trigger: 'change'}
        ],

        bankName: [
          {required: true, message: '请输入开户银行名称', trigger: 'change'},
          {max: 100, message: '开户银行名称不能超过100个字符', trigger: 'change'},
        ],

        bankAccount: [
          {required: true, message: '请输入银行账号', trigger: 'change'},
          {validator: validations.BANK_ACCOUNT_RULE, trigger: 'change'}
        ],

        address: [
          {required: true, message: '请输入注册地址', trigger: 'change'},
          {max: 100, message: '注册地址不能超过100个字符', trigger: 'change'},
        ],

        phone: [
          {required: true, message: '请输入注册电话', trigger: 'change'},
          {validator: validations.PHONE_RULE, trigger: 'change'}
        ],
      }
    }
  },

  created() {
    return tenantApi.fetchTenantInvoiceTitle().then((response) => {
      let title = response.data.title;
      if (title) {
        this.theModel = title;
      }
      this.loaded = true;
    });
  },

  methods: {
    onSubmit() {
      this.validated = true;
      return this.$refs['theForm'].validate().then(() => {
        return tenantApi.updateTenantInvoiceTitle({title: this.theModel}).then(() => {
          this.$message({
            type: 'success',
            message: `成功更新发票抬头。`,
            center: true
          });
        });
      });
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
}

.commonInput {
  width: 400px;
}

.saveButton {
  margin-top: 24px;
  width: $pageButtonWidth;
}

</style>

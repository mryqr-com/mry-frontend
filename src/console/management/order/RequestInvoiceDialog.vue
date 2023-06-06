<template>
  <el-dialog v-if="invoiceTitle"
             :append-to-body="true"
             :class="$style.wrapper"
             :visible.sync="visible"
             title="开具发票"
             top="60px"
             width="600px"
             @close="$emit('update:show', false)"
             @open="init">

    <el-alert :closable="false"
              class="marginBottom15"
              title="当前支持开具电子版的增值税普通发票和增值税专用发票。根据国家相关法律，电子发票和纸质发票具有同等法律效力。码如云当前为小规模纳税人，根据当前国家对小规模纳税人的税收优惠政策，所开具增值税发票的税率为1%，如果此税率无法满足您的预期，请联系码如云客服为您免费延长相应套餐时限，以作补偿。"
              type="warning">
    </el-alert>

    <div :class="$style.section">
      <div :class="$style.row">
        <span :class="$style.rowKey">订单号：</span>
        <span :class="$style.rowValue">{{ order.id }}</span>
      </div>

      <div :class="$style.row">
        <span :class="$style.rowKey">开票金额：</span>
        <span :class="$style.rowValue">￥{{ order.paidPrice }}</span>
      </div>

      <div :class="$style.row">
        <span :class="$style.rowKey">发票抬头：</span>
        <span :class="$style.rowValue">
        {{ invoiceTitle.title }}
        <el-button :class="$style.textButton"
                   size="small"
                   type="text"
                   @click="goToEditInvoiceTitlePage">
          编辑发票信息
        </el-button>
      </span>
      </div>

      <div :class="$style.row">
        <span :class="$style.rowKey">单位税号：</span>
        <span :class="$style.rowValue">{{ invoiceTitle.unifiedCode }}</span>
      </div>

      <div :class="$style.row">
        <span :class="$style.rowKey">开户银行：</span>
        <span :class="$style.rowValue">{{ invoiceTitle.bankName }}</span>
      </div>

      <div :class="$style.row">
        <span :class="$style.rowKey">银行账号：</span>
        <span :class="$style.rowValue">{{ invoiceTitle.bankAccount }}</span>
      </div>

      <div :class="$style.row">
        <span :class="$style.rowKey">注册地址：</span>
        <span :class="$style.rowValue">{{ invoiceTitle.address }}</span>
      </div>

      <div :class="$style.row">
        <span :class="$style.rowKey">注册电话：</span>
        <span :class="$style.rowValue">{{ invoiceTitle.phone }}</span>
      </div>
    </div>

    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="theModel"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="onSubmit">
      <el-form-item ref="type" label="请选择需要开具的发票类型：" prop="type">
        <el-select v-model="theModel.type"
                   :class="$style.commonInput"
                   size="medium">
          <el-option
              v-for="type in invoiceTypes"
              :key="type.key"
              :label="type.name"
              :value="type.key">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item ref="email" label="请输入接收电子发票的邮箱地址：" prop="email">
        <el-input v-model="theModel.email"
                  :class="$style.commonInput"
                  :maxlength="100"
                  :spellcheck="false"
                  :validate-event="validated"
                  size="medium">
        </el-input>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button :class="$style.footerButton"
                 icon="el-icon-close"
                 size="medium"
                 type="plain"
                 @click="close">
        关闭
      </el-button>
      <el-button :class="$style.footerButton"
                 icon="el-icon-check"
                 size="medium"
                 type="primary"
                 @click="onSubmit">
        申请发票
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import validations from "@/common/utils/validations";
import orderApi from '@/common/api/order-api';

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Object,
    },

    invoiceTitle: {
      type: Object,
    }
  },

  data() {
    return {
      visible: this.show,
      validated: false,
      theModel: {
        type: null,
        email: null,
      },

      rules: {
        type: [
          {required: true, message: '请选择发票类型', trigger: 'change'},
        ],

        email: [
          {required: true, message: '请输入接收发票的邮箱', trigger: 'change'},
          {validator: validations.EMAIL_RULE, trigger: 'change'}
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
    invoiceTypes() {
      return [
        {
          key: 'VAT_NORMAL',
          name: '增值税普通发票',
        },
        {
          key: 'VAT_SPECIAL',
          name: '增值税专用发票',
        }
      ]
    },
  },

  methods: {
    init() {
      this.theModel.type = null;
      this.theModel.email = null;
      this.validated = false;
      this.$refs['theForm'].clearValidate();
    },

    goToEditInvoiceTitlePage() {
      this.$router.push({name: 'tenant-invoice-setting'});
    },

    onSubmit() {
      this.validated = true;
      return this.$refs['theForm'].validate().then(() => {
        return orderApi.requestInvoice(this.order.id, this.theModel).then(() => {
          this.$message({
            type: 'success',
            message: `申请发票成功。`,
            center: true
          });
        }).finally(() => {
          this.visible = false;
        })
      });
    },

    close() {
      this.visible = false;
    },
  }
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

.section {
  background-color: $lightBackgroundColor;
  padding: 15px;
  margin-bottom: 15px;
  line-height: 1.6em;
}

.row {
  display: flex;
  margin-bottom: 5px;
}

.rowKey {
  width: 80px;
  text-align: right;
  flex-shrink: 0;
  flex-grow: 0;
  line-height: 1.6em;
}

.rowValue {
  margin-left: 10px;
  flex-grow: 1;
  line-height: 1.6em;
  color: $primaryTextColor;
}

.textButton {
  padding: 0 10px;
}

.commonInput {
  width: 100%;
}

.footerButton {
  width: $dialogButtonWidth;
}
</style>


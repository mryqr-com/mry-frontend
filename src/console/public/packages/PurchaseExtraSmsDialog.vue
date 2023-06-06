<template>
  <el-dialog :append-to-body="true"
             :class="$style.wrapper"
             :close-on-click-modal="false"
             :visible.sync="visible"
             title="增购短信量"
             top="60px"
             width="800px"
             @close="$emit('update:show', false)"
             @open="init">

    <section :class="$style.section">
      <div :class="$style.sectionTitle">请选择购买短信数量：</div>
      <el-select v-model="amountType"
                 :class="$style.amountTypeInput"
                 @change="onAmountTypeChange">
        <el-option v-for="amountType in amountTypes"
                   :key="amountType.type"
                   :label="amountType.amount"
                   :value="amountType.type">
        </el-option>
      </el-select>
    </section>

    <section v-if="price" :class="$style.section">
      <div :class="$style.sectionTitle">价格详情：</div>
      <div :class="$style.priceItem">
        <span :class="$style.priceItemTitle">{{ `增购短信${this.amount}：` }}</span>
        <span :class="$style.priceItemValue">￥{{ price.originalTotalPrice }}</span>
      </div>

      <div :class="$style.priceItem">
        <span :class="$style.priceItemTitle">实付金额：</span>
        <span :class="[$style.priceItemValue,$style.totalPrice]">￥{{ price.discountedTotalPrice }}</span>
      </div>
    </section>

    <section :class="$style.section">
      <div :class="$style.sectionTitle">提示：</div>
      购买时，请先查看<a class="primaryColoredTextLink" href="//docs.mryqr.com/terms/" target="_blank">《服务条款》</a>，
      <a class="primaryColoredTextLink" href="//docs.mryqr.com/privacy/" target="_blank">《隐私条款》</a>和
      <a class="primaryColoredTextLink" href="//docs.mryqr.com/rules/" target="_blank">《使用规范》</a>。
    </section>

    <section :class="$style.section">
      <div :class="$style.sectionTitle">付款方式：</div>

      <el-button :class="$style.payButton"
                 size="medium"
                 type="primary"
                 @click="startWxPay">
        在线微信支付
      </el-button>

      <el-button :class="$style.payButton"
                 size="medium"
                 type="primary"
                 @click="startBankTransfer">
        银行对公转账
      </el-button>

<!--      <el-button :class="$style.payButton"-->
<!--                 size="medium"-->
<!--                 type="primary"-->
<!--                 @click="startWxTransfer">-->
<!--        线下微信转账-->
<!--      </el-button>-->
    </section>
  </el-dialog>
</template>

<script>
import orderApi from "@/common/api/order-api";

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

  },

  data() {
    return {
      visible: this.show,
      amountType: 'FIVE_K',
      price: null,
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  computed: {
    amountTypes() {
      return [
        {
          type: 'ONE_K',
          amount: '1000条'
        },
        {
          type: 'TWO_K',
          amount: '2000条'
        },
        {
          type: 'FIVE_K',
          amount: '5000条'
        },
        {
          type: 'TEN_K',
          amount: '1万条'
        },
        {
          type: 'TWENTY_K',
          amount: '2万条'
        },
        {
          type: 'FIFTY_K',
          amount: '5万条'
        },
      ]
    },

    amount() {
      return this.amountTypes.find(it => it.type === this.amountType).amount;
    },
  },

  methods: {
    init() {
      this.amountType = 'FIVE_K';
      return this.fetchPriceQuotation();
    },

    onAmountTypeChange() {
      return this.fetchPriceQuotation();
    },

    fetchPriceQuotation() {
      return orderApi.requestQuote({
        detail: this.createOrderDetail(),
      }).then(response => {
        this.price = response.data.price;
      });
    },

    createOrderDetail() {
      return {
        type: 'EXTRA_SMS',
        amountType: this.amountType
      };
    },

    createOrder(command) {
      return orderApi.createOnlineOrder(command).then(response => {
        let params = {
          orderInfo: response.data,
        };

        this.$router.push({name: 'checkout-counter', params: params});
      });
    },

    startWxPay() {
      return this.createOrder({
        detail: this.createOrderDetail(),
        paymentType: 'WX_NATIVE',
      });
    },

    startBankTransfer() {
      return this.createOrder({
        detail: this.createOrderDetail(),
        paymentType: 'BANK_TRANSFER',
      });
    },

    startWxTransfer() {
      return this.createOrder({
        detail: this.createOrderDetail(),
        paymentType: 'WX_TRANSFER',
      });
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  :global {
    .el-dialog {
      margin-top: 0;
      margin-bottom: 0;
    }

    .el-dialog__body {
      padding-bottom: 20px;
    }
  }
}

.section {
  margin-top: 20px;
  background-color: $lightBackgroundColor;
  padding: 15px;
}

.section:first-child {
  margin-top: 10px;
}

.sectionTitle {
  font-weight: 500;
  color: $primaryTextColor;
  font-size: 15px;
  margin-bottom: 10px;
}

.amountTypeInput {
  background-color: white;
  width: 200px;
}

.priceItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.priceItem:last-child {
  margin-bottom: 0;
}

.priceItemTitle {
}

.priceItemValue {
  color: $primaryTextColor;
  font-size: 15px;
}

.totalPrice {
  color: $oppositeThemeColor;
  font-size: 18px;
  font-weight: 600;
}

.payButton {
  width: $dialogButtonWidth;
  background-color: $oppositeThemeColor !important;
  border-color: $oppositeThemeColor !important;
}

.payButton:hover {
  background-color: #ec8303 !important;
  border-color: #ec8303 !important;
}

</style>


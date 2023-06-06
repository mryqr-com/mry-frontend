<template>
  <el-dialog :append-to-body="true"
             :class="$style.wrapper"
             :close-on-click-modal="false"
             :visible.sync="visible"
             title="购买套餐"
             top="60px"
             width="800px"
             @close="$emit('update:show', false)"
             @open="init">
    <section :class="$style.section">
      <div :class="$style.sectionTitle">账户信息：</div>
      <div>
        当前账户：
        <span :class="$style.importantText" class="marginRight50">{{ tenantName }}</span>
        当前登录用户：
        <span :class="$style.importantText" class="marginRight50">{{ currentMemberName }}</span>

        当前套餐：
        <span :class="$style.importantText">{{ currentPlanName }}</span>
        <template v-if="currentPlanType !== 'FREE'">
          <span v-if="isCurrentPlanExpired" :class="$style.expireText">
          （已于{{ formatEpochToDate(currentPlanExpireAt) }}过期）
          </span>
          <span v-else>
          （将于{{ formatEpochToDate(currentPlanExpireAt) }}过期）
          </span>
        </template>
      </div>

    </section>

    <section :class="$style.section">
      <div :class="$style.sectionTitle">请选择套餐版本：</div>
      <el-radio-group v-model="planType" size="medium" @change="onPlanTypeChange">
        <el-radio v-for="type in allowedPlanTypes"
                  :key="type"
                  :class="$style.radioButton"
                  :label="type"
                  border>
          {{ planNameOf(type) }}
        </el-radio>
      </el-radio-group>
    </section>

    <section :class="$style.section">
      <div :class="$style.sectionTitle">请选择时长：</div>
      <el-radio-group v-model="yearDuration" size="medium" @change="onYearDurationChange">
        <el-radio v-for="duration in durations"
                  :key="duration.duration"
                  :class="$style.radioButton"
                  :label="duration.duration"
                  border>
          {{ duration.name }}
        </el-radio>
      </el-radio-group>
    </section>

    <section v-if="price" :class="$style.section">
      <div :class="$style.sectionTitle">价格详情：</div>
      <div v-if="price.originalRenewalPrice" :class="$style.priceItem">
        <span :class="$style.priceItemTitle">{{ `购买${planNameOf(this.planType)}套餐（${this.yearDuration}年）：` }}</span>
        <span :class="$style.priceItemValue">￥{{ price.originalRenewalPrice }}</span>
      </div>

      <div v-if="price.originalUpgradePrice" :class="$style.priceItem">
        <span :class="$style.priceItemTitle">{{ `升级当前套餐到${planNameOf(this.planType)}：` }}</span>
        <span :class="$style.priceItemValue">￥{{ price.originalUpgradePrice }}</span>
      </div>

      <div v-if="price.discountOffsetPrice" :class="$style.priceItem">
        <span :class="$style.priceItemTitle">{{ `折扣（${price.discount}折）：` }}</span>
        <span :class="$style.priceItemValue">-￥{{ price.discountOffsetPrice }}</span>
      </div>

      <div :class="$style.priceItem">
        <span :class="$style.priceItemTitle">实付金额：</span>
        <span :class="[$style.priceItemValue,$style.totalPrice]">￥{{ price.discountedTotalPrice }}</span>
      </div>

      <div :class="$style.priceItem">
        <span :class="$style.priceItemTitle">购买后套餐将变更为：</span>
        <span>{{ resultText }}</span>
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
import {mapGetters} from 'vuex';
import {canPlanCover, formatEpochToDate} from '@/common/utils/common-utils';
import playTypes from '@/common/utils/plan-types';
import orderApi from '@/common/api/order-api';
import dayjs from 'dayjs';

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    allPlanTypes: {
      type: Array,
      required: true,
    },

    initPlanType: {
      type: String,
    },

    initDuration: {
      type: Number,
      default: 1
    }
  },

  data() {
    return {
      visible: this.show,
      planType: null,
      yearDuration: 1,
      price: null,
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  computed: {
    ...mapGetters([
      'currentEffectivePlanType',
      'tenantName',
      'currentMemberName',
      'currentPlanName',
      'isCurrentPlanExpired',
      'currentPlanExpireAt',
      'currentPlanType',
    ]),

    allowedPlanTypes() {
      return this.allPlanTypes.filter(type => {
        return type !== 'FREE' && canPlanCover(type, this.currentEffectivePlanType);
      });
    },

    durations() {
      let durations = [
        {
          name: '1年',
          duration: 1
        }
      ];

      //当前免费版不能仅升级，当前套餐本身也不能仅升级
      if (this.currentEffectivePlanType !== 'FREE' && this.planType !== this.currentEffectivePlanType) {
        durations.push({
          name: '仅升级',
          duration: 0
        })
      }

      return durations
    },

    resultText() {
      if (this.currentEffectivePlanType === 'FREE') {
        return `${this.planNameOf(this.planType)} ${dayjs.tz().add(this.yearDuration, 'year').format('YYYY-MM-DD')}过期`
      }

      return `${this.planNameOf(this.planType)} ${dayjs.tz(this.currentPlanExpireAt).add(this.yearDuration, 'year').format('YYYY-MM-DD')}过期`;
    },
  },

  methods: {
    formatEpochToDate,
    init() {
      if (this.allowedPlanTypes.includes(this.initPlanType)) {
        this.planType = this.initPlanType;
      } else {
        this.planType = this.allPlanTypes[0];
      }
      this.yearDuration = this.initDuration;
      return this.fetchPriceQuotation();
    },

    planNameOf(type) {
      return playTypes[type].name;
    },

    onPlanTypeChange() {
      if (this.planType === this.currentEffectivePlanType && this.yearDuration === 0) {
        this.yearDuration = 1;
      }
      return this.fetchPriceQuotation();
    },

    onYearDurationChange() {
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
        type: 'PLAN',
        planType: this.planType,
        yearDuration: this.yearDuration
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

.importantText {
  color: $primaryTextColor;
}

.expireText {
  color: $warningYellow;
}

.radioButton {
  width: 150px;
  text-align: center;
  margin-right: 10px;
  background-color: white;

  :global {
    .el-radio__input {
      display: none;
    }

    .el-radio__input.is-checked + .el-radio__label {
      color: $primaryThemeColor !important;
      font-weight: 500;
    }
  }
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


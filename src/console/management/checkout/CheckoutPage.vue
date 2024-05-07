<template>
  <div :class="$style.wrapper">
    <div :class="$style.topBar">
      <a :class="$style.logo" href="//www.mryqr.com">
        <img :class="$style.logoImage" :src="logoImageUrl" alt="码如云"/>
        码如云
      </a>
      <span :class="$style.counterText">收银台</span>
    </div>

    <div :class="$style.mainContent">
      <section :class="$style.mainSection">
        <div :id="captureId" :class="$style.contentWrapper">
          <section :class="$style.orderSummarySection">
            <div :class="$style.orderSummaryInfoContainer">
              <div :class="$style.summaryInfoRow">
                <span :class="$style.summaryItemTitle">订单编号：</span>
                <span :class="$style.summaryItemValue">{{ orderInfo.id }}</span>
              </div>
              <div :class="$style.summaryInfoRow">
                <span :class="$style.summaryItemTitle">订单内容：</span>
                <span :class="$style.summaryItemValue">{{ orderInfo.payDescription }}</span>
              </div>
              <div :class="$style.summaryInfoRow">
                <span :class="$style.summaryItemTitle">下单时间：</span>
                <span :class="$style.summaryItemValue">{{ formatEpochToMinute(orderInfo.createdAt) }}</span>
              </div>
            </div>

            <div :class="$style.orderSummaryPriceContainer">
              应付金额：<span :class="$style.priceValue">￥{{ orderInfo.price.discountedTotalPrice }}</span>
            </div>
          </section>

          <section v-if="isWxPay" :class="$style.wxPaySection">
            <template v-if="!wxPaid">
              <img :class="$style.wxPayLogo" :src="wxPayLogoUrl" alt="微信支付">
              <img :id="wxPayQrImageId" :class="$style.wxPayQrImage" alt="正在加载支付二维码..."/>
              <div :class="$style.wxPayText">
                请使用手机微信扫码支付，如遇到问题请联系客服
              </div>
            </template>

            <div v-else :class="$style.paidSuccessContainer">
              <div :class="$style.paidSuccessText">支付成功</div>
              <el-button :class="$style.enterConsoleButton"
                         size="medium"
                         type="primary"
                         @click="gotoOrderListPage">
                查看订单
              </el-button>
            </div>
          </section>

          <section v-else-if="isWxTransfer">
            <div :class="$style.transferTitle">线下微信转账</div>
            <section :class="$style.transferSection">
              <div :class="$style.transferPayTip">
                请用手机微信扫描以下二维码向码如云完成微信转账；为安全起见，我们会主动向您提供本订单编号（{{ orderInfo.id }}），如果对应不上，请不要转账。
              </div>
              <img :class="$style.wxContactQr" alt="码如云客服" src="/images/customer-service-151.png"/>
              <div :class="$style.wxTransferNote">微信扫码，联系码如云客服，完成转账</div>
            </section>
          </section>

          <section v-else-if="isBankTransfer">
            <div :class="$style.transferTitle">银行对公转账</div>
            <section :class="$style.transferSection">
              <div :class="$style.transferPayTip">请根据以下银行信息完成对公转账。转账成功后，我们将在一个工作日内为您开通相应功能；为保证服务的及时性，建议您使用实时转账方式。
              </div>

              <div :class="$style.bankTransferRow">
                <span :class="$style.bankTransferRowTitle">银行户名：</span>
                <span :class="$style.bankTransferRowValue">XXX信息技术有限公司</span>
              </div>

              <div :class="$style.bankTransferRow">
                <span :class="$style.bankTransferRowTitle">开户银行：</span>
                <span :class="$style.bankTransferRowValue">XXX银行</span>
              </div>

              <div :class="$style.bankTransferRow">
                <span :class="$style.bankTransferRowTitle">银行账号：</span>
                <span :class="$style.bankTransferRowValue">0000000000000</span>
              </div>

              <div :class="$style.bankTransferRow">
                <span :class="$style.bankTransferRowTitle">转账凭码：</span>
                <span :class="$style.bankTransferRowValue">
                  {{ orderInfo.bankTransferCode }}
                  <span :class="$style.transferNote">（请将该转账凭码填入转账附言或备注中）</span>
                </span>
              </div>
            </section>
          </section>
        </div>

        <div v-if="!isWxPay" :class="$style.opsContainer">
          <el-button :class="$style.finishButton" size="medium" type="primary" @click="gotoHomePage">完成</el-button>
        </div>

        <div :class="$style.footer">
          <el-button v-if="isBankTransfer || isWxTransfer"
                     :class="$style.captureButton"
                     type="text"
                     @click="capture">下载截图
          </el-button>
        </div>
      </section>
    </div>

    <MryCustomerServiceEntry :class="$style.customerService"
                             :iconSize="24"
                             :textSize="13"
                             trigger="hover">
    </MryCustomerServiceEntry>
  </div>
</template>

<script>
import mryLogo from '@/common/static/mry.svg';
import uuid from 'short-uuid';
import wxPayLogo from "@/common/static/wxpay.png";
import orderApi from '@/common/api/order-api';
import {saveAs} from 'file-saver';
import {formatEpochToMinute, HTML2CANVAS_SCALE} from '@/common/utils/common-utils';

export default {
  props: {
    orderInfo: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      captureId: uuid.generate(),
      wxPayQrImageId: uuid.generate(),
      wxPaid: false,
      wxPollCount: 0,
      wxPollIntervalId: null,
    }
  },

  mounted() {
    this.wxPaid = false;
    this.wxPollCount = 0;
    this.wxPollIntervalId = null;
    if (!this.orderInfo) {
      this.$router.replace({name: 'default-home'});
    }

    if (this.isWxPay) {
      let _this = this;
      this.$nextTick(() => {
        import(/* webpackChunkName: "qrcode-with-logos" */ 'qrcode-with-logos').then(({default: _}) => {
          let qrcode = new _({
            image: document.getElementById(this.wxPayQrImageId),
            content: this.orderInfo.wxPayQrUrl,
            width: 250,
            nodeQrCodeOptions: {
              margin: 0,
              errorCorrectionLevel: 'Q',
            },
          });

          qrcode.toImage().then(() => {
            _this.wxPollIntervalId = setInterval(function () {
              orderApi.fetchOrderStatus(_this.orderInfo.id).then(response => {
                _this.wxPollCount = _this.wxPollCount + 1;
                if (response.data === 'PAID') {
                  _this.wxPaid = true;
                  clearInterval(_this.wxPollIntervalId);
                }

                if (_this.wxPollCount > 200) {
                  clearInterval(_this.wxPollIntervalId);
                }
              });
            }, 2000);
          });
        });
      });
    }
  },

  beforeDestroy() {
    if (this.wxPollIntervalId) {
      clearInterval(this.wxPollIntervalId);
    }
  },

  computed: {
    logoImageUrl() {
      return mryLogo;
    },

    isWxPay() {
      return this.orderInfo.paymentType === 'WX_NATIVE';
    },

    isWxTransfer() {
      return this.orderInfo.paymentType === 'WX_TRANSFER';
    },

    isBankTransfer() {
      return this.orderInfo.paymentType === 'BANK_TRANSFER';
    },

    wxPayLogoUrl() {
      return wxPayLogo;
    },
  },

  methods: {
    formatEpochToMinute,

    gotoHomePage() {
      this.$router.replace({name: 'default-home'});
    },

    gotoOrderListPage() {
      this.$router.replace({name: 'tenant-order-list'});
    },

    capture() {
      let _this = this;
      import(/* webpackChunkName: "html2canvas" */ 'html2canvas').then(({default: html2canvas}) => {
        html2canvas(document.getElementById(_this.captureId), {
          allowTaint: true,
          useCORS: true,
          scale: HTML2CANVAS_SCALE,
        }).then(canvas => {
          canvas.toBlob(function (blob) {
            saveAs(blob, `码如云订单(${_this.orderInfo.id}).png`);
          });
        });
      });
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  height: 100%;
  overflow: auto;
  background-color: $lightBackgroundColor;
}

.topBar {
  position: fixed;
  z-index: 100;
  width: 100vw;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  height: $consoleTopBarHeight;
  box-shadow: $primaryShadow;
  background-color: $whiteBackgroundColor;
  padding: 0 24px;
}

.logo {
  margin-right: 10px;
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 500;
}

.logo:link, .logo:visited, .logo:active {
  color: $regularTextColor;
}

.logoImage {
  width: 36px;
  margin-right: 8px;
}

.counterText {
  font-size: 18px;
  font-weight: normal;
}

.mainContent {
  margin-top: calc(#{$consoleTopBarHeight} + 30px);
}

.mainSection {
  width: 1000px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .1);
  margin: auto;
}

.contentWrapper {
  padding: 24px;
}

.orderSummarySection {
  background-color: $primaryBackgroundColor;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.orderSummaryInfoContainer {
  flex-grow: 1;
  flex-shrink: 0;
}

.summaryInfoRow {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.summaryInfoRow:last-child {
  margin-bottom: 0;
}

.summaryItemTitle {
}

.summaryItemValue {
  color: $primaryTextColor;
}

.orderSummaryPriceContainer {
  width: 250px;
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.priceValue {
  color: $oppositeThemeColor;
  font-weight: 600;
  font-size: 24px;
}

.wxPaySection {
  display: flex;
  flex-flow: column;
  align-items: center;
  margin-top: 50px;
}

.wxPayLogo {
  height: 24px;
  margin-bottom: 20px;
}

.wxPayQrImage {
  width: 225px;
  height: 225px;
}

.wxPayText {
  margin-top: 50px;
}

.paidSuccessContainer {
  margin-top: 30px;
}

.paidSuccessText {
  color: $passGreen;
  font-size: 18px;
  text-align: center;
  font-weight: 600;
  margin-bottom: 30px;
  margin-top: 30px;
}

.enterConsoleButton {
  width: $pageButtonWidth;
  margin-bottom: 100px;
}

.customerService {
  position: fixed;
  top: 100px;
  right: 50px;
}

.transferTitle {
  margin-top: 50px;
  text-align: center;
  color: $primaryTextColor;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
}

.transferPayContainer {
  display: flex;
  justify-content: space-between;
}

.transferSection {
  background-color: $primaryBackgroundColor;
  padding: 24px;
}

.transferPayTip {
  margin-bottom: 30px;
  line-height: 1.4em;
}

.bankTransferRow {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.bankTransferRow:last-child {
  margin-bottom: 0;
}

.bankTransferRowTitle {
  flex-grow: 0;
  margin-right: 15px;
}

.bankTransferRowValue {
  color: $primaryTextColor;
  font-weight: 500;
}

.transferNote {
  color: $oppositeThemeColor;
  font-weight: normal;
}

.wxContactQr {
  width: 150px;
  display: block;
  margin: auto;
}

.wxTransferNote {
  text-align: center;
  margin-top: 8px;
}

.opsContainer {
  text-align: center;
}

.finishButton {
  width: $pageButtonWidth;
}

.footer {
  padding: 24px;
  text-align: right;
}

.captureButton {
  :global {
    span {
      color: $regularTextColor;
      text-decoration: underline;
      font-weight: normal;
    }

    span:hover {
      color: $primaryThemeColor;
    }
  }
}

</style>

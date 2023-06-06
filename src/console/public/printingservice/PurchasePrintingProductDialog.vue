<template>
  <el-dialog :append-to-body="true"
             :class="$style.wrapper"
             :close-on-click-modal="false"
             :visible.sync="visible"
             title="购买码牌印刷服务"
             top="60px"
             width="800px"
             @close="$emit('update:show', false)"
             @open="init">
    <section :class="[$style.section,$style.tipSection]">
      <div :class="$style.sectionTitle">购买提示：</div>
      <div :class="$style.sectionParagragh">
        下单时，请保证所选尺寸规格和所上传码牌文件的尺寸是一致的。
        完成支付后，我们将尽快为您制作并在5个工作日内为您发货，您可以在"订单管理"页面查看订单详情以及物流信息；50个起订。
      </div>
    </section>

    <el-form ref="theForm"
             :hide-required-asterisk="true"
             :model="detail"
             :rules="rules"
             label-position="top"
             @submit.native.prevent="doNothing">
      <section :class="[$style.section,$style.typeAndAmountSection]">
        <div :class="$style.sectionTitle">请选择规格与数量：</div>
        <div :class="$style.typeAndAmountContainer">
          <el-form-item prop="plateType">
            <el-select ref="refPlateType"
                       v-model="detail.plateType"
                       :class="$style.typeSelect"
                       placeholder="请选择规格"
                       size="medium"
                       title="请选择规格"
                       @change="onPlateTypeChange">
              <el-option v-for="plate in plateTypes"
                         :key="plate.type"
                         :label="plate.text"
                         :value="plate.type">
              </el-option>
            </el-select>
          </el-form-item>
          <span :class="$style.xSpan">X</span>
          <el-form-item prop="amount">
            <el-input-number v-model="detail.amount"
                             :class="$style.commonInput"
                             :max="10000"
                             :min="50"
                             :step="1"
                             :stepStrictly="true"
                             controls-position="right"
                             size="medium"
                             @change="onAmountChange">
            </el-input-number>
            个
          </el-form-item>
        </div>
      </section>

      <section v-if="price" :class="$style.section">
        <div :class="$style.sectionTitle">价格详情：</div>
        <div :class="$style.priceItem">
        <span :class="$style.priceItemTitle">
          {{ `印刷码牌${this.detail.amount}个（${this.product.name} ${this.selectedSize}）：` }}
        </span>
          <span :class="$style.priceItemValue">￥{{ price.originalTotalPrice }}</span>
        </div>

        <div :class="$style.priceItem">
          <span :class="$style.priceItemTitle">运费：</span>
          <span :class="$style.priceItemValue">￥{{ price.deliveryFee }}</span>
        </div>

        <div :class="$style.priceItem">
          <span :class="$style.priceItemTitle">实付金额：</span>
          <span :class="[$style.priceItemValue,$style.totalPrice]">￥{{ price.discountedTotalPrice }}</span>
        </div>
      </section>

      <section :class="$style.section">
        <div :class="[$style.sectionTitle,$style.spacedTitle]">请选择收货地址：
          <el-button :class="$style.textButton"
                     size="small"
                     type="text"
                     @click="goToConsigneeSettingPage">
            添加收货地址
          </el-button>
        </div>
        <el-form-item prop="consigneeId">
          <el-select v-model="detail.consigneeId"
                     :class="$style.consigneeSelect"
                     no-data-text="请先添加收货地址"
                     placeholder="请选择收货地址"
                     size="medium"
                     title="请选择收货地址">
            <el-option v-for="consignee in consignees"
                       :key="consignee.id"
                       :label="consigneeText(consignee)"
                       :value="consignee.id">
            </el-option>
          </el-select>
        </el-form-item>
      </section>

      <section :class="$style.section">
        <div :class="[$style.sectionTitle,$style.spacedTitle]">请上传码牌图片文件：
          <el-button :class="$style.textButton"
                     size="small"
                     type="text"
                     @click="downloadPlateFileDoc">
            如何生成码牌图片文件？
          </el-button>
        </div>

        <el-form-item prop="files">
          <MultipleFileUploader v-model="detail.files"
                                :acceptTypes="compressedAcceptTypes"
                                :dnd="true"
                                :max="10"
                                :ossRequest="tenantOrderOssRequest"
                                :perMaxSize="20"
                                dndAreaText="选择或拖拽上传码牌图片文件，支持zip, rar等压缩包文件格式"
                                @input="validateFiles">
          </MultipleFileUploader>
        </el-form-item>
      </section>
    </el-form>

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
import tenantApi from "@/common/api/tenant-api";
import {displayAddress} from "@/common/utils/common-utils";
import uuid from "short-uuid";
import {accept} from "@/common/utils/mime-utils";
import {mapGetters} from 'vuex';

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    product: {
      type: Object,
    }
  },

  components: {
    MultipleFileUploader: () => import(/* webpackChunkName: "multi-file-uploader" */ '@/common/components/MultipleFileUploader'),
  },

  data() {
    return {
      detail: {
        plateType: null,
        amount: 30,
        files: [],
        consigneeId: null,
      },

      consignees: [],
      visible: this.show,
      price: null,
      rules: {
        plateType: [
          {required: true, message: `请选择规格`, trigger: 'change'},
        ],

        amount: [
          {required: true, message: `请输入购买数量`, trigger: 'change'},
        ],

        files: [
          {required: true, message: `请上传码牌文件`, trigger: 'change'},
        ],

        consigneeId: [
          {required: true, message: `请选择收货地址`, trigger: 'change'},
        ]
      }
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  computed: {
    ...mapGetters(['tenantId']),

    plateTypes() {
      if (!this.product) {
        return [];
      }

      return this.product.printingTypes.map(type => {
        return {
          type: type.type,
          text: `${this.product.name} ${type.size}（${type.unitPrice}元/个）`,
        }
      });
    },

    compressedAcceptTypes() {
      return accept.COMPRESSED;
    },

    selectedConsignee() {
      return this.consignees.find(c => c.id === this.detail.consigneeId);
    },

    selectedSize() {
      let plateType = this.product.printingTypes.find(p => p.type === this.detail.plateType);
      return plateType != null ? plateType.size : '';
    },

    fakeFile() {
      return {
        id: uuid.generate(),
        name: 'fakeName',
        type: 'image/jpeg',
        fileUrl: 'http://this.is.a.fake.file.jpeg',
        ossKey: null,
        size: 234564,
      };
    },

    fakeConsignee() {
      return {
        id: uuid.generate(),
        name: 'fakeName',
        mobile: '16000000000',
        address: {
          province: 'fakeProvince',
          city: 'fakeCity',
          district: 'fakeDistrict',
          address: 'fakeAddress',
        }
      }
    },

    tenantOrderOssRequest() {
      return {
        type: 'TENANT_ORDER',
        tenantId: this.tenantId,
      }
    },
  },

  methods: {
    init() {
      this.detail.plateType = null;
      this.detail.amount = 10;
      this.detail.files = [];
      this.detail.consigneeId = null;
      this.price = null;

      this.$nextTick(() => {
        this.$refs['refPlateType'].focus();
        this.$refs['theForm'].clearValidate();
      });

      if (this.consignees.length === 0) {
        return tenantApi.listConsignees().then((response) => {
          this.consignees = response.data;
        });
      }
    },

    doNothing() {
    },

    onPlateTypeChange() {
      return this.fetchPriceQuotation();
    },

    onAmountChange() {
      if (this.detail.plateType) {
        return this.fetchPriceQuotation();
      }
    },

    validateFiles() {
      this.$refs['theForm'].validateField('files');
    },

    consigneeText(consignee) {
      return `${consignee.name} ${consignee.mobile} ${displayAddress(consignee.address)}`;
    },

    goToConsigneeSettingPage() {
      this.$router.push({name: 'tenant-consignee-setting'});
    },

    downloadPlateFileDoc() {
      window.open('//docs.mryqr.com/faqs/#如何下载码牌图片', '_blank');
    },

    fetchPriceQuotation() {
      return orderApi.requestQuote({
        detail: this.createQuoteOrderDetail(),
      }).then(response => {
        this.price = response.data.price;
      });
    },

    createQuoteOrderDetail() {
      return {
        type: 'PLATE_PRINTING',
        plateType: this.detail.plateType,
        amount: this.detail.amount,
        files: [this.fakeFile],
        consignee: this.fakeConsignee,
      };
    },

    createOrderDetail() {
      return {
        type: 'PLATE_PRINTING',
        plateType: this.detail.plateType,
        amount: this.detail.amount,
        files: this.detail.files,
        consignee: this.selectedConsignee,
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
      return this.$refs['theForm'].validate().then(() => {
        return this.createOrder({
          detail: this.createOrderDetail(),
          paymentType: 'WX_NATIVE',
        });
      });
    },

    startBankTransfer() {
      return this.$refs['theForm'].validate().then(() => {
        return this.createOrder({
          detail: this.createOrderDetail(),
          paymentType: 'BANK_TRANSFER',
        });
      });
    },

    startWxTransfer() {
      return this.$refs['theForm'].validate().then(() => {
        return this.createOrder({
          detail: this.createOrderDetail(),
          paymentType: 'WX_TRANSFER',
        });
      });
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  :global {
    .el-dialog__body {
      padding-bottom: 20px;
    }

    .el-input__inner {
      background-color: white !important;
    }
  }
}

.section {
  margin-top: 20px;
  background-color: $lightBackgroundColor;
  padding: 15px;
}

.tipSection {
  margin-top: 10px;
}

.typeAndAmountSection {
  padding-bottom: 20px;
}

.sectionTitle {
  font-weight: 500;
  color: $primaryTextColor;
  font-size: 15px;
  margin-bottom: 10px;
}

.spacedTitle {
  display: flex;
  justify-content: space-between;
}

.sectionParagragh {
  line-height: 1.6em;
}

.typeAndAmountContainer {
  display: flex;
  align-items: center;

  :global {
    .el-form-item {
      margin-bottom: 0;
    }
  }
}

.typeSelect {
  width: 300px;
}

.xSpan {
  margin-right: 8px;
  margin-left: 8px;
}

.commonInput {
  width: 200px;
}

.textButton {
  padding: 0;
  font-size: 13px;
  font-weight: normal;
  text-decoration: underline;
}

.consigneeSelect {
  width: 100%;
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


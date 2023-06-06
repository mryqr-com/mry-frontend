<template>
  <el-dialog v-if="order"
             :append-to-body="true"
             :class="$style.wrapper"
             :visible.sync="visible"
             title="订单详情"
             top="60px"
             width="600px"
             @close="$emit('update:show', false)">
    <div :class="$style.content">
      <div :class="$style.row">
        <span :class="$style.rowKey">订单号：</span>
        <span :class="$style.rowValue">{{ order.id }}</span>
      </div>

      <div :class="$style.row">
        <span :class="$style.rowKey">下单时间：</span>
        <span :class="$style.rowValue">{{ formatEpochToMinute(order.createdAt) }}</span>
      </div>

      <div :class="$style.row">
        <span :class="$style.rowKey">下单人：</span>
        <span :class="$style.rowValue">{{ order.creator }}</span>
      </div>

      <div :class="$style.row">
        <span :class="$style.rowKey">订单类型：</span>
        <span :class="$style.rowValue">{{ order.orderDetailType }}</span>
      </div>

      <div :class="$style.row">
        <span :class="$style.rowKey">订单内容：</span>
        <span :class="$style.rowValue">{{ order.description }}</span>
      </div>

      <div :class="$style.row">
        <span :class="$style.rowKey">订单状态：</span>
        <span :class="$style.rowValue">{{ order.status }}</span>
      </div>

      <div :class="$style.row">
        <span :class="$style.rowKey">实付金额：</span>
        <span :class="$style.rowValue">￥{{ order.discountedTotalPrice }}</span>
      </div>

      <div :class="$style.row">
        <span :class="$style.rowKey">支付方式：</span>
        <span :class="$style.rowValue">
        {{ order.paymentType }}
        <span v-if="order.wxTxnId">（订单号：{{ order.wxTxnId }}）</span>
      </span>
      </div>

      <div v-if="order.bankTransferCode" :class="$style.row">
        <span :class="$style.rowKey">转账凭号：</span>
        <span :class="$style.rowValue">{{ order.bankTransferCode }}</span>
      </div>

      <div v-if="order.bankName" :class="$style.row">
        <span :class="$style.rowKey">转账银行：</span>
        <span :class="$style.rowValue">{{ order.bankName }}</span>
      </div>

      <div v-if="order.bankTransferAccountId" :class="$style.row">
        <span :class="$style.rowKey">转账账户：</span>
        <span :class="$style.rowValue">{{ order.bankTransferAccountId }}</span>
      </div>

      <div v-if="order.carrier" :class="$style.row">
        <span :class="$style.rowKey">物流信息：</span>
        <span :class="$style.rowValue">{{ `${order.carrier}（${order.deliveryOrderId}）` }}</span>
      </div>

      <template v-if="order.invoiceRequested">
        <div :class="$style.row">
          <span :class="$style.rowKey">发票状态：</span>
          <span :class="$style.rowValue">{{ order.invoiceIssued ? '已开具' : '已申请' }}</span>
        </div>

        <div :class="$style.row">
          <span :class="$style.rowKey">发票抬头：</span>
          <span :class="$style.rowValue">{{ order.invoiceTitle }}</span>
        </div>

        <div :class="$style.row">
          <span :class="$style.rowKey">发票类型：</span>
          <span :class="$style.rowValue">{{ order.invoiceType }}</span>
        </div>

        <div :class="$style.row">
          <span :class="$style.rowKey">发票接收邮箱：</span>
          <span :class="$style.rowValue">{{ order.invoiceEmail }}</span>
        </div>
      </template>

      <div v-if="consignee" :class="$style.row">
        <span :class="$style.rowKey">收货人：</span>
        <span :class="$style.rowValue">{{ consigneeName }}</span>
      </div>

      <div v-if="consignee" :class="$style.row">
        <span :class="$style.rowKey">收货地址：</span>
        <span :class="$style.rowValue">{{ consigneeAddress }}</span>
      </div>

      <div v-if="plateFiles" :class="$style.row">
        <span :class="$style.rowKey">码牌文件：</span>
        <span :class="$style.rowValue">
            <el-button v-for="aFile in plateFiles"
                       :key="aFile.id"
                       :class="$style.fileDownloadButton"
                       size="medium"
                       type="text"
                       @click="downloadFile(aFile)">
              {{ aFile.name }}
            </el-button>
          </span>
      </div>
    </div>

    <div slot="footer">
      <el-button :class="$style.footerButton"
                 icon="el-icon-close"
                 size="medium"
                 type="plain"
                 @click="close">
        关闭
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {displayAddress, formatEpochToMinute} from '@/common/utils/common-utils';
import {saveAs} from 'file-saver';

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Object,
    }
  },

  data() {
    return {
      visible: this.show,
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  computed: {
    consignee() {
      return this.order.orderDetail.consignee;
    },

    consigneeName() {
      return `${this.consignee.name}（${this.consignee.mobile}）`;
    },

    consigneeAddress() {
      return `${displayAddress(this.consignee.address)}`;
    },

    plateFiles() {
      return this.order.orderDetail.files;
    }
  },

  methods: {
    formatEpochToMinute,
    close() {
      this.visible = false;
    },

    downloadFile(file) {
      saveAs(file.fileUrl, file.name);
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

.content {
  background-color: $lightBackgroundColor;
  padding: 15px;
}

.row {
  display: flex;
  margin-bottom: 5px;
}

.rowKey {
  width: 100px;
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

.fileDownloadButton {
  padding: 0;
  font-weight: normal;
  text-decoration: underline;
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>


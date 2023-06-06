<template>
  <div :class="$style.wrapper">
    <el-dropdown size="medium"
                 trigger="click"
                 @command="handleMoreCommand">
      <el-button size="medium"
                 type="text">
        操作<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="viewOrderDetail"
                          title="查看订单详情">
          订单详情
        </el-dropdown-item>

        <el-dropdown-item v-if="shouldShowInvoiceButton"
                          command="requestInvoice">
          申请发票
        </el-dropdown-item>

        <el-dropdown-item v-if="shouldShowDeliveryButton"
                          command="viewDelivery"
                          title="查看物流动态">
          查看物流
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <ViewOrderDetailDialog :order="detailedOrder"
                           :show.sync="orderDetailDialogVisible">
    </ViewOrderDetailDialog>

    <RequestInvoiceDialog :invoiceTitle="invoiceTitle"
                          :order="order"
                          :show.sync="requestInvoiceDialogVisible">
    </RequestInvoiceDialog>

    <ViewOrderShipmentDialog :shipment="shipment"
                             :show.sync="shipmentDialogVisible">
    </ViewOrderShipmentDialog>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import ViewOrderDetailDialog from '@/console/management/order/ViewOrderDetailDialog';
import orderApi from '@/common/api/order-api';
import tenantApi from '@/common/api/tenant-api';
import router from "@/console/console-router";
import RequestInvoiceDialog from '@/console/management/order/RequestInvoiceDialog';
import ViewOrderShipmentDialog from '@/console/management/order/ViewOrderShipmentDialog';

const orderListStore = createNamespacedHelpers('ORDER_LIST_STORE');

export default {
  props: ['order'],

  components: {
    ViewOrderDetailDialog,
    RequestInvoiceDialog,
    ViewOrderShipmentDialog,
  },

  data() {
    return {
      orderDetailDialogVisible: false,
      detailedOrder: null,

      requestInvoiceDialogVisible: false,
      invoiceTitle: null,

      shipmentDialogVisible: false,
      shipment: null,
    }
  },

  methods: {
    viewOrderDetail() {
      return orderApi.fetchDetailedOrder(this.order.id).then(response => {
        this.detailedOrder = response.data;
        this.orderDetailDialogVisible = true;
      });
    },

    requestInvoice() {
      return tenantApi.fetchTenantInvoiceTitle().then(response => {
        let invoiceTitle = response.data.title;
        if (!invoiceTitle) {
          this.$confirm("当前尚无发票抬头信息，无法开具发票，请先完善发票抬头再开具发票。", '请完善发票抬头', {
            confirmButtonText: '设置发票抬头',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            router.push({name: 'tenant-invoice-setting'});
          }).catch(_ => {
          });
          return;
        }

        this.invoiceTitle = invoiceTitle;
        this.requestInvoiceDialogVisible = true;
      });
    },

    viewDelivery() {
      return orderApi.fetchOrderShipment(this.order.id).then(response => {
        let shipment = response.data;
        if (!shipment.carrier || shipment.nodes.length === 0) {
          this.$message({
            type: 'warning',
            message: `未查询到物流信息。`,
            center: true,
          });
          return;
        }

        this.shipment = shipment;
        this.shipmentDialogVisible = true;
      })
    },

    handleMoreCommand(command) {
      return this[command]();
    },
  },

  computed: {
    shouldShowInvoiceButton() {
      return this.order.statusEnum === 'PAID' && !this.order.invoiceRequested;
    },

    shouldShowDeliveryButton() {
      return this.order.statusEnum === 'PAID' && this.order.orderDetailTypeEnum === 'PLATE_PRINTING';
    },
  }
}
</script>


<style lang="scss" module>
.wrapper {
  display: flex;
  align-items: center;
}

</style>

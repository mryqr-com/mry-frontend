<template>
  <div :class="$style.wrapper">
    <el-table ref="orderListTable"
              :class="$style.theTable"
              :data="orders"
              :height="height"
              highlight-current-row>
      <el-table-column
          :class-name="$style.idColumn"
          column-key="id"
          label="订单号"
          min-width="150">
        <template slot-scope="scope">
          <span :class="$style.orderId">
            {{ scope.row.id }}
            <span v-if="isNewerThan(scope.row,300)" class="marginLeft10 tableTag greenTableTag">新</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
          column-key="createdAt"
          label="下单时间">
        <template slot-scope="scope">
          {{ formatEpochToMinute(scope.row.createdAt) }}
        </template>
      </el-table-column>

      <el-table-column
          label="详情">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>

      <el-table-column
          label="状态">
        <template slot-scope="scope">
          {{ scope.row.status }}
        </template>
      </el-table-column>

      <el-table-column
          label="金额">
        <template slot-scope="scope">
          ￥{{ scope.row.paidPrice }}
        </template>
      </el-table-column>

      <el-table-column
          label="支付方式">
        <template slot-scope="scope">
          {{ scope.row.paymentType }}
        </template>
      </el-table-column>

      <el-table-column
          label="发票">
        <template slot-scope="scope">
          {{ invoiceStatus(scope.row) }}
        </template>
      </el-table-column>

      <el-table-column
          label="操作"
          width="150">
        <template slot-scope="scope">
          <OrderOperationButtons :order="scope.row"></OrderOperationButtons>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {formatEpochToMinute, isNewerThan} from '@/common/utils/common-utils';
import {createNamespacedHelpers} from 'vuex';
import eventBus from '@/common/utils/event-bus';
import ACTIONS from '@/console/management/order/store/order-list-actions';
import OrderOperationButtons from '@/console/management/order/OrderOperationButtons';

const orderListStore = createNamespacedHelpers('ORDER_LIST_STORE');

export default {
  props: ['height'],

  components: {
    OrderOperationButtons,
  },

  created() {
    eventBus.$on('order-list-fetched', this.goToTableTop);
  },

  beforeDestroy() {
    eventBus.$off('order-list-fetched');
  },

  methods: {
    ...orderListStore.mapActions([ACTIONS.LIST_ORDERS]),
    formatEpochToMinute: formatEpochToMinute,
    isNewerThan: isNewerThan,

    goToTableTop() {
      this.$refs.orderListTable.bodyWrapper.scrollTop = 0;
    },

    invoiceStatus(order) {
      if (order.statusEnum === 'PAID' && order.invoiceIssued) {
        return '已开票';
      }

      if (order.statusEnum === 'PAID' && order.invoiceRequested) {
        return '已申请';
      }

      if (order.statusEnum === 'PAID' && !order.invoiceRequested) {
        return '未申请';
      }

      return '';
    }
  },

  computed: {
    ...orderListStore.mapState(['orders']),
  }
}
</script>


<style lang="scss" module>

.wrapper {
}

.theTable {
  width: 100%;
  background-color: $whiteBackgroundColor;

  :global {
    th {
      color: $primaryTextColor;
    }
  }
}

.idColumn {
  padding: 0 !important;
  padding-left: 16px !important;

  :global {
    .cell {
      display: flex;
      align-items: center;
    }
  }
}

.orderId {
  display: flex;
  align-items: center;
}

</style>

<template>
  <div v-if="orderListLoaded" :class="$style.wrapper">
    <div :class="$style.opsBar">
      <div :class="$style.theTitle">订单列表</div>

      <div :class="$style.opsButtons">
        <OrderSearchButton></OrderSearchButton>
        <el-button :class="$style.purchaseButton"
                   icon="el-icon-shopping-cart-2"
                   size="medium"
                   type="primary"
                   @click="gotoPurchasePackagesPage">
          购买套餐
        </el-button>
        <el-button :class="$style.purchaseButton"
                   icon="el-icon-printer"
                   size="medium"
                   type="primary"
                   @click="gotoPurchasePrintingPage">
          印刷服务
        </el-button>
      </div>
    </div>

    <OrderListTable :height="tableHeight"></OrderListTable>

    <el-pagination v-if="hasPagination"
                   :class="$style.pagination"
                   :current-page.sync="thePageIndex"
                   :page-size.sync="thePageSize"
                   :page-sizes="[10, 20, 30, 50]"
                   :total="totalNumber"
                   layout="total,prev,pager,next,sizes"
                   @current-change="onPageIndexChanged"
                   @size-change="onPageSizeChanged">
    </el-pagination>
  </div>
</template>

<script>
import {createNamespacedHelpers, mapGetters} from 'vuex';
import OrderSearchButton from '@/console/management/order/OrderSearchButton';
import ACTIONS from '@/console/management/order/store/order-list-actions';
import OrderListTable from '@/console/management/order/OrderListTable';

const orderListStore = createNamespacedHelpers('ORDER_LIST_STORE');

export default {
  components: {
    OrderSearchButton,
    OrderListTable,
  },

  data() {
    return {
      orderListLoaded: false,
    }
  },

  created() {
    document.title = `订单管理- ${this.tenantName}`;

    return this[ACTIONS.INIT]().then(() => {
      this.orderListLoaded = true;
    });
  },

  computed: {
    ...mapGetters(['tenantName']),
    ...orderListStore.mapState(['totalNumber', 'pageIndex', 'pageSize']),

    hasPagination() {
      return this.totalNumber > this.pageSize;
    },

    tableHeight() {
      if (this.hasPagination) {
        return window.innerHeight - 60 - 24 - 60 - 5 - 48;
      } else {
        return window.innerHeight - 60 - 24 - 60 - 5 - 24;
      }
    },

    thePageIndex: {
      get() {
        return this.pageIndex;
      },

      set(value) {
        this.updatePageIndex(value);
      }
    },

    thePageSize: {
      get() {
        return this.pageSize;
      },

      set(value) {
        this.updatePageSize(value);
      }
    }
  },

  methods: {
    ...orderListStore.mapActions([ACTIONS.INIT, ACTIONS.LIST_ORDERS]),

    ...orderListStore.mapMutations([
      'resetPageIndex',
      'updatePageIndex',
      'updatePageSize'
    ]),

    gotoPurchasePackagesPage() {
      this.$router.push({name: 'purchase-packages'});
    },

    gotoPurchasePrintingPage() {
      this.$router.push({name: 'printing-service'});
    },

    onPageIndexChanged() {
      return this[ACTIONS.LIST_ORDERS]();
    },

    onPageSizeChanged() {
      this.resetPageIndex();
      return this[ACTIONS.LIST_ORDERS]();
    },
  },
}
</script>


<style lang="scss" module>
$content-margin: 24px;
$ops-bar-height: 60px;
$ops-bar-margin-bottom: 5px;
$pagination-height: 48px;

.wrapper {
  height: calc(100vh - #{$consoleTopBarHeight} - #{$content-margin});
  margin: $content-margin;
}

.opsBar {
  padding: 0 16px;
  height: $ops-bar-height;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: $whiteBackgroundColor;
  margin-bottom: $ops-bar-margin-bottom;
}

.theTitle {
  font-size: 15px;
  font-weight: 500;
}

.opsButtons {
  display: flex;
  align-items: center;
}

.purchaseButton {
  margin-left: 16px;
  width: 120px;
}

.pagination {
  height: $pagination-height;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>

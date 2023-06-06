<template>
  <div v-if="listLoaded" :class="$style.wrapper">
    <div :class="$style.opsBar">
      <div :class="$style.theTitle">
        码牌批次
        <HelpDocLinker url="//docs.mryqr.com/console-app-operation/plate-batch/"></HelpDocLinker>
      </div>

      <div :class="$style.opsButtons">
        <PlateBatchSearchButton></PlateBatchSearchButton>
        <PlateBatchAddButton :class="$style.addButton"></PlateBatchAddButton>
      </div>
    </div>

    <PlateBatchListTable :height="tableHeight"></PlateBatchListTable>

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
import {createNamespacedHelpers} from 'vuex';
import ACTIONS from '@/console/app-operation/platebatch/store/platebatch-list-actions';
import PlateBatchAddButton from '@/console/app-operation/platebatch/PlateBatchAddButton';
import PlateBatchListTable from '@/console/app-operation/platebatch/PlateBatchListTable';
import PlateBatchSearchButton from '@/console/app-operation/platebatch/PlateBatchSearchButton';

const plateBatchListStore = createNamespacedHelpers('PLATE_BATCH_LIST_STORE');
const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');


export default {
  components: {
    PlateBatchAddButton,
    PlateBatchListTable,
    PlateBatchSearchButton
  },

  data() {
    return {
      listLoaded: false
    }
  },

  created() {
    document.title = `批量码牌 - ${this.currentAppName}`;

    return this[ACTIONS.INIT](this.currentAppId).then(() => {
      this.listLoaded = true;
    });
  },

  methods: {
    ...plateBatchListStore.mapMutations([
      'resetPageIndex',
      'updatePageIndex',
      'updatePageSize'
    ]),

    ...plateBatchListStore.mapActions([ACTIONS.INIT, ACTIONS.LIST_MY_MANAGED_PLATE_BATCHES]),


    onPageIndexChanged() {
      return this[ACTIONS.LIST_MY_MANAGED_PLATE_BATCHES](this.currentAppId);
    },

    onPageSizeChanged() {
      this.resetPageIndex();
      return this[ACTIONS.LIST_MY_MANAGED_PLATE_BATCHES](this.currentAppId);
    },

  },

  computed: {
    ...plateBatchListStore.mapState(['totalNumber', 'pageIndex', 'pageSize']),
    ...appOperationStore.mapGetters(['currentAppId', 'currentAppName']),

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
  }
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

.addButton {
  margin-left: 16px;
}

.pagination {
  height: $pagination-height;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>

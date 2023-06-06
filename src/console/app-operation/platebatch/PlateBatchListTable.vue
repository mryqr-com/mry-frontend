<template>
  <div :class="$style.wrapper">
    <el-table ref="theTable"
              :class="$style.theTable"
              :data="batches"
              :height="height"
              highlight-current-row
              @sort-change="onSortChange">
      <el-table-column
          class-name="firstColumn"
          column-key="name"
          label="批次名称"
          min-width="150"
          sortable="custom">
        <template slot-scope="scope">
          <span :class="$style.nameContainer">
            <icon :class="$style.theIcon" icon="clone"/>
            <span :class="$style.theName">{{ scope.row.name }}</span>
            <span v-if="isNew(scope.row)" class="tableTag greenTableTag">新</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
          column-key="createdAt"
          label="创建时间"
          sortable="custom">
        <template slot-scope="scope">
          {{ formatEpochToMinute(scope.row.createdAt) }}
        </template>
      </el-table-column>

      <el-table-column
          label="创建人">
        <template slot-scope="scope">
          {{ scope.row.creator }}
        </template>
      </el-table-column>

      <el-table-column
          column-key="totalCount"
          label="码牌总数"
          prop="totalCount"
          sortable="custom">
      </el-table-column>

      <el-table-column
          label="已使用">
        <template slot-scope="scope">
          {{ scope.row.usedCount }}（{{ Math.round(scope.row.usedCount / scope.row.totalCount * 100) }}%）
        </template>
      </el-table-column>

      <el-table-column
          label="未使用">
        <template slot-scope="scope">
          {{
            scope.row.totalCount - scope.row.usedCount
          }}（{{ Math.round((scope.row.totalCount - scope.row.usedCount) / scope.row.totalCount * 100) }}%）
        </template>
      </el-table-column>

      <el-table-column
          label="操作"
          width="200">
        <template slot-scope="scope">
          <PlateBatchOperationButtons :batch="scope.row"></PlateBatchOperationButtons>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import PlateBatchOperationButtons from '@/console/app-operation/platebatch/PlateBatchOperationButtons';
import {formatEpochToMinute, isNew} from '@/common/utils/common-utils';
import eventBus from '@/common/utils/event-bus';
import ACTIONS from '@/console/app-operation/platebatch/store/platebatch-list-actions';

const plateBatchListStore = createNamespacedHelpers('PLATE_BATCH_LIST_STORE');
const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: ['height'],

  components: {PlateBatchOperationButtons},

  created() {
    eventBus.$on('platebatch-list-fetched', this.goToTableTop);
    eventBus.$on('platebatches-sorting-reset', this.resetTableSort);
  },

  beforeDestroy() {
    eventBus.$off('platebatch-list-fetched');
    eventBus.$off('platebatches-sorting-reset');
  },

  methods: {
    ...plateBatchListStore.mapActions([ACTIONS.LIST_MY_MANAGED_PLATE_BATCHES]),
    ...plateBatchListStore.mapMutations([
      'resetPageIndex',
      'updateSorting',
    ]),

    formatEpochToMinute: formatEpochToMinute,
    isNew: isNew,

    goToTableTop() {
      this.$refs.theTable.bodyWrapper.scrollTop = 0;
    },

    resetTableSort() {
      this.$refs.theTable.clearSort();
    },

    onSortChange(sort) {
      let sortedBy = sort.order ? sort.column.columnKey : null;
      let ascSort = sort.order === 'ascending';
      this.updateSorting({sortedBy, ascSort});
      this.resetPageIndex();
      return this[ACTIONS.LIST_MY_MANAGED_PLATE_BATCHES](this.currentAppId);
    },
  },

  computed: {
    ...appOperationStore.mapGetters([
      'currentAppId',
    ]),

    ...plateBatchListStore.mapState(['batches']),
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

    td {
      /*padding-top: 16px;*/
      /*padding-bottom: 16px;*/
    }

    .firstColumn {
      padding-left: 16px;
    }
  }
}

.theName {
  font-weight: 500;
  margin-right: 10px;
}

.theIcon {
  margin-right: 10px;
}

.nameContainer {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}

</style>

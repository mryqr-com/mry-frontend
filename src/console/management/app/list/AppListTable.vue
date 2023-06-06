<template>
  <div :class="$style.wrapper">
    <el-table ref="appListTable"
              :class="$style.theTable"
              :data="apps"
              :height="height"
              highlight-current-row
              @sort-change="onSortChange">
      <el-table-column
          :class-name="$style.nameColumn"
          column-key="name"
          label="应用名称"
          min-width="150"
          sortable="custom">
        <template slot-scope="scope">
          <span :class="[$style.appNameContainer,{[$style.appActive]:!scope.row.locked}]"
                @click="enterAppEditPage(scope.row)">
            <span :class="$style.appIcon" :style="appIconStyle(scope.row.icon)"></span>
            <span :class="$style.appName">{{ scope.row.name }}</span>
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
          column-key="active"
          label="状态"
          sortable="custom">
        <template slot-scope="scope">
          <span v-if="scope.row.active" :class="$style.activatedText">启用</span>
          <span v-else :class="$style.deactivatedText" title="禁用状态下只有应用管理员可以使用该应用">禁用</span>
        </template>
      </el-table-column>

      <el-table-column
          label="操作"
          width="200">
        <template slot-scope="scope">
          <AppOperationButtons :app="scope.row"></AppOperationButtons>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {formatEpochToMinute, isNew} from '@/common/utils/common-utils';
import {createNamespacedHelpers, mapGetters} from 'vuex';
import eventBus from '@/common/utils/event-bus';

import AppOperationButtons from '@/console/management/app/list/AppOperationButtons';
import defaultAppIcon from "@/common/static/app.svg";
import {imageDisplayUrl} from "@/common/utils/image-utils";
import ACTIONS from '@/console/management/app/list/store/app-list-actions';

const appListStore = createNamespacedHelpers('APP_LIST_STORE');

export default {
  props: ['height'],

  components: {AppOperationButtons},

  created() {
    eventBus.$on('app-list-fetched', this.goToTableTop);
    eventBus.$on('apps-sorting-reset', this.resetTableSort);
  },


  beforeDestroy() {
    eventBus.$off('app-list-fetched');
    eventBus.$off('apps-sorting-reset');
  },

  methods: {
    ...appListStore.mapActions([ACTIONS.LIST_MY_MANAGED_APPS]),
    ...appListStore.mapMutations([
      'resetPageIndex',
      'updateSorting',
    ]),

    formatEpochToMinute: formatEpochToMinute,
    isNew: isNew,

    enterAppEditPage(app) {
      if (app.locked) {
        return;
      }

      this.$router.push({
        name: 'app-edit-home',
        params: {appId: app.id}
      });
    },

    appIconStyle(icon) {
      if (!icon) {
        return {
          backgroundImage: `url('${defaultAppIcon}')`
        }
      }

      return {
        backgroundImage: `url('${imageDisplayUrl(icon)}')`
      };
    },

    goToTableTop() {
      this.$refs.appListTable.bodyWrapper.scrollTop = 0;
    },

    resetTableSort() {
      this.$refs.appListTable.clearSort();
    },

    onSortChange(sort) {
      let sortedBy = sort.order ? sort.column.columnKey : null;
      let ascSort = sort.order === 'ascending';
      this.updateSorting({sortedBy, ascSort});
      this.resetPageIndex();
      return this[ACTIONS.LIST_MY_MANAGED_APPS]();
    },
  },

  computed: {
    ...appListStore.mapState(['apps']),
    ...mapGetters(['isTenantAdmin']),

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

.nameColumn {
  padding: 0 !important;
  padding-left: 16px !important;

  :global {
    .cell {
      display: flex;
      align-items: center;
    }
  }
}

.appName {
  font-weight: 500;
  line-height: 1.3em;
  margin-right: 10px;
}

.appNameContainer {
  display: flex;
  align-items: center;
}

.appActive {
  cursor: pointer;
}

.appActive:hover {
  color: $primaryThemeColor;
}

.appIcon {
  margin-right: 10px;
  width: 30px;
  height: 30px;
  background-position: center center;
  background-size: cover;
}

.deactivatedText {
  color: $rejectRed;
}

.activatedText {
  color: $passGreen;
}

</style>

<template>
  <div v-if="appListLoaded" :class="$style.wrapper">
    <div :class="$style.opsBar">
      <div :class="$style.theTitle">应用列表</div>

      <div :class="$style.opsButtons">
        <AppSearchButton></AppSearchButton>
        <el-button v-if="isTenantAdmin"
                   :class="$style.addButton"
                   size="medium"
                   title="应用模板库"
                   @click="gotoAppTemplatePage">
          应用模板库
        </el-button>

        <AppAddButton v-if="isTenantAdmin" :class="$style.addButton"></AppAddButton>
      </div>
    </div>

    <AppListTable :height="tableHeight"></AppListTable>

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
import AppAddButton from '@/console/management/app/list/AppAddButton';
import AppSearchButton from '@/console/management/app/list/AppSearchButton';
import AppListTable from '@/console/management/app/list/AppListTable';
import APP_LIST_ACTION from '@/console/management/app/list/store/app-list-actions';

const appListStore = createNamespacedHelpers('APP_LIST_STORE');

export default {
  components: {
    AppAddButton,
    AppListTable,
    AppSearchButton
  },

  data() {
    return {
      appListLoaded: false,
    }
  },

  created() {
    document.title = `应用管理 - ${this.tenantName}`;

    return this[APP_LIST_ACTION.INIT]().then(() => {
      this.appListLoaded = true;
    });
  },

  methods: {
    ...appListStore.mapActions([APP_LIST_ACTION.INIT, APP_LIST_ACTION.LIST_MY_MANAGED_APPS]),

    ...appListStore.mapMutations([
      'resetPageIndex',
      'updatePageIndex',
      'updatePageSize'
    ]),

    onPageIndexChanged() {
      return this[APP_LIST_ACTION.LIST_MY_MANAGED_APPS]();
    },

    onPageSizeChanged() {
      this.resetPageIndex();
      return this[APP_LIST_ACTION.LIST_MY_MANAGED_APPS]();
    },

    gotoAppTemplatePage() {
      this.$router.push({name: 'app-templates'});
    },
  },

  computed: {
    ...appListStore.mapState(['totalNumber', 'pageIndex', 'pageSize']),
    ...mapGetters(['isTenantAdmin', 'tenantName']),

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

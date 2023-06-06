<template>
  <div :class="$style.wrapper">
    <el-button :class="$style.addButton"
               :disabled="isMaxAppReached"
               :title="buttonTitle"
               icon="el-icon-plus"
               size="medium"
               type="primary"
               @click="showDialog">
      新建应用
    </el-button>
    <CreateAppDialog :show.sync="dialogVisible" @appCreated="onAppCreated"></CreateAppDialog>
  </div>
</template>

<script>
import {createNamespacedHelpers, mapGetters} from 'vuex';
import APP_LIST_ACTION from '@/console/management/app/list/store/app-list-actions';
import CreateAppDialog from '@/console/management/app/CreateAppDialog';

const appListStore = createNamespacedHelpers('APP_LIST_STORE');

export default {
  components: {
    CreateAppDialog
  },

  data() {
    return {
      dialogVisible: false,
    }
  },

  computed: {
    ...mapGetters([
      'isMaxAppReached',
      'isCurrentPlanExpired',
      'currentPlanName',
    ]),

    buttonTitle() {
      if (this.isMaxAppReached) {
        if (this.isCurrentPlanExpired) {
          return `无法新建应用，当前套餐(${this.currentPlanName})已过期，有效套餐已降为免费版，且已达所允许应用数量上限，如需继续请升级或续费。`;
        }
        return `无法新建应用，已达当前套餐(${this.currentPlanName})所允许应用数量上限，如需继续请升级。`;
      } else {
        return '新建应用';
      }
    }
  },

  methods: {
    ...appListStore.mapActions([APP_LIST_ACTION.LIST_MY_MANAGED_APPS]),
    ...appListStore.mapMutations([
      'resetPageIndex',
      'clearSearchTerm',
      'resetSorting',
    ]),

    onAppCreated({appId, name}) {
      this.$message({
        type: 'success',
        message: `应用【${name}】创建成功。`,
        center: true
      });

      this.clearSearchTerm();
      this.resetPageIndex();
      this.resetSorting();

      this.$router.push({
        name: 'app-edit-home',
        params: {appId: appId}
      });

      //要么如上导向编辑页面，要目如下留在本页
      // return this[APP_LIST_ACTION.LIST_MY_MANAGED_APPS]();
    },

    showDialog() {
      this.dialogVisible = true;
    },
  },
}
</script>


<style lang="scss" module>
.wrapper {
}

.addButton {
  width: $pageButtonWidth;
}

</style>

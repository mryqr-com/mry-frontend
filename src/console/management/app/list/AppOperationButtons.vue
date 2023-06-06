<template>
  <div :class="$style.wrapper">
    <el-button v-if="!this.app.locked"
               size="medium"
               title="编辑应用"
               type="text"
               @click.stop="goEditApp">
      编辑
    </el-button>

    <span v-else :class="$style.appLocked" title="锁定状态下无法编辑应用，但是可以正常使用应用">已锁定</span>

    <el-dropdown :class="$style.opsDropdown"
                 size="medium"
                 trigger="click"
                 @command="handleMoreCommand">

      <el-button size="medium"
                 type="text">
        更多<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="setAppManagers" title="设置应用管理员">
          设置管理员
        </el-dropdown-item>

        <el-dropdown-item command="rename" title="重命名应用">
          重命名
        </el-dropdown-item>

        <el-dropdown-item command="copy" title="复制应用">
          复制
        </el-dropdown-item>

        <el-dropdown-item v-if="!this.app.active" command="activate" title="启用应用">
          启用
        </el-dropdown-item>

        <el-dropdown-item v-if="this.app.active"
                          command="deactivate"
                          title="禁用应用，禁用后普通角色不可查看也不可提交，而对于应用管理员以上角色而言不可提交但可查看(主要用于编辑应用时的预览)">
          禁用
        </el-dropdown-item>

        <el-dropdown-item v-if="!this.app.locked" command="lock"
                          title="锁定应用，锁定后应用不可编辑但可以正常访问，主要用于防止应用被误编辑的情况，应用稳定成型后建议锁定">
          锁定
        </el-dropdown-item>

        <el-dropdown-item v-if="this.app.locked" command="unlock" title="解除锁定，解除锁定后方可编辑应用">
          解除锁定
        </el-dropdown-item>

        <el-dropdown-item command="openWebhookDialog" title="配置Webhook集成信息">
          Webhook集成
        </el-dropdown-item>

        <el-dropdown-item v-if="isTenantAdmin" command="deleteApp" title="删除应用，删除后应用下的所有资源都将被连带删除">
          删除
        </el-dropdown-item>

      </el-dropdown-menu>
    </el-dropdown>

    <SetAppManagerDialog :app="app" :show.sync="setManagerDialogVisible"></SetAppManagerDialog>
    <RenameAppDialog :app="app" :show.sync="renameDialogVisible"></RenameAppDialog>
    <DeleteAppConfirmDialog :app="app" :show.sync="confirmDeleteDialogVisible"></DeleteAppConfirmDialog>
    <CopyAppDialog :app="app" :show.sync="copyAppDialogVisible"></CopyAppDialog>
    <UpdateAppWebhookSettingDialog :app="app" :show.sync="webhookSettingDialogVisible"></UpdateAppWebhookSettingDialog>
  </div>
</template>

<script>
import {createNamespacedHelpers, mapGetters} from 'vuex';
import appApi from '@/common/api/app-api';
import SetAppManagerDialog from '@/console/management/app/list/SetAppManagerDialog';
import RenameAppDialog from '@/console/management/app/list/RenameAppDialog';
import CopyAppDialog from '@/console/management/app/list/CopyAppDialog';
import DeleteAppConfirmDialog from '@/console/management/app/list/DeleteAppConfirmDialog';
import UpdateAppWebhookSettingDialog from '@/console/management/app/list/UpdateAppWebhookSettingDialog';

const appListStore = createNamespacedHelpers('APP_LIST_STORE');

export default {
  props: ['app'],

  components: {
    SetAppManagerDialog,
    RenameAppDialog,
    DeleteAppConfirmDialog,
    CopyAppDialog,
    UpdateAppWebhookSettingDialog,
  },

  data() {
    return {
      setManagerDialogVisible: false,
      renameDialogVisible: false,
      copyAppDialogVisible: false,
      confirmDeleteDialogVisible: false,
      webhookSettingDialogVisible: false,
    }
  },

  methods: {
    ...appListStore.mapMutations(['activateAppById', 'deactivateAppById', 'lockAppById', 'unlockAppById']),

    goEditApp() {
      this.$router.push({
        name: 'app-edit-home',
        params: {appId: this.app.id}
      });
    },

    setAppManagers() {
      this.setManagerDialogVisible = true;
    },

    rename() {
      this.renameDialogVisible = true;
    },

    copy() {
      this.copyAppDialogVisible = true;
    },

    activate() {
      return this.$confirm(`确认启用应用【${this.app.name}】？`, '提示', {
        confirmButtonText: '是的，启用',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return appApi.activateApp(this.app.id).then(() => {
          this.$message({
            type: 'success',
            message: `成功启用应用【${this.app.name}】。`,
            center: true
          });

          this.activateAppById(this.app.id);
        });
      });
    },

    deactivate() {
      return this.$confirm(`禁用后，应用将无法使用，确认禁用应用【${this.app.name}】？`, '提示', {
        confirmButtonText: '是的，禁用',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return appApi.deactivateApp(this.app.id).then(() => {
          this.$message({
            type: 'success',
            message: `成功禁用应用【${this.app.name}】。`,
            center: true
          });

          this.deactivateAppById(this.app.id);
        });
      });
    },

    lock() {
      return this.$confirm(`锁定后，应用将无法编辑，但是可以正常使用，确认锁定应用【${this.app.name}】？`, '提示', {
        confirmButtonText: '是的，锁定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return appApi.lockApp(this.app.id).then(() => {
          this.$message({
            type: 'success',
            message: `锁定应用【${this.app.name}】。`,
            center: true
          });

          this.lockAppById(this.app.id);
        });
      });
    },

    unlock() {
      return this.$confirm(`确认为应用【${this.app.name}】解除锁定？`, '提示', {
        confirmButtonText: '是的，解除锁定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return appApi.unlockApp(this.app.id).then(() => {
          this.$message({
            type: 'success',
            message: `成功为应用【${this.app.name}】解除锁定。`,
            center: true
          });

          this.unlockAppById(this.app.id);
        });
      });
    },

    deleteApp() {
      this.confirmDeleteDialogVisible = true;
    },

    openWebhookDialog() {
      this.webhookSettingDialogVisible = true;
    },

    handleMoreCommand(command) {
      return this[command]();
    },
  },

  computed: {
    ...mapGetters([
      'isTenantAdmin',
    ]),
  }
}
</script>


<style lang="scss" module>
.wrapper {
  display: flex;
  align-items: center;
}

.opsDropdown {
  margin-left: 15px;
}

.appLocked {
  color: $oppositeThemeColor;
}
</style>

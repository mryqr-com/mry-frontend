<template>
  <span v-if="shouldCurrentPageShowProfileButton" :class="$style.wrapper">
    <el-dropdown v-if="!isLoggedIn" :class="$style.eldropdown" trigger="click" @command="handleCommand">
      <span :class="$style.content">
        <RoundButton><i class="majoricon i-appstore-fill"></i></RoundButton>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :command="{command:'startLogin',parameters:null}">
          <i class="majoricon i-user"></i>登录
        </el-dropdown-item>

         <el-dropdown-item v-if="canViewGeolocation" :command="{command:'viewGeolocation',parameters:null}">
          <i class="majoricon i-location"></i>查看定位
        </el-dropdown-item>

        <el-dropdown-item :command="{command:'reportOffence',parameters:null}">
          <i class="majoricon i-mail"></i>举报
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-dropdown v-else :class="$style.eldropdown" trigger="click" @command="handleCommand">
      <span :class="$style.content">
        <RoundButton><i class="majoricon i-appstore-fill"></i></RoundButton>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-if="updateButtonViewable" :command="{command:'enterUpdateMode',parameters:null}">
          <i class="majoricon i-edit-square"></i>编辑当前表单
        </el-dropdown-item>

        <el-dropdown-item v-if="canEditBaseInfo" :command="{command:'gotToBaseInfoEditPage',parameters:null}">
          <i class="majoricon i-edit"></i>编辑基本信息
        </el-dropdown-item>

        <el-dropdown-item v-if="canViewBackToHomePage" :command="{command:'goToQrHomePage',parameters:null}">
          <i class="majoricon i-tablet"></i>返回首页
        </el-dropdown-item>

        <template v-if="shouldShowOperationMenus">
          <el-dropdown-item v-for="menuItem in allViewableOperationMenuItems"
                            :key="menuItem.id"
                            :command="{command:'goToOperationPage',parameters:menuItem}">
            <i :class="menuItem.icon" class="majoricon"></i>{{ menuItem.name }}
          </el-dropdown-item>
        </template>

         <el-dropdown-item v-if="canViewGeolocation" :command="{command:'viewGeolocation',parameters:null}">
          <i class="majoricon i-location"></i>查看定位
        </el-dropdown-item>

        <template v-if="!isInIframe()">
          <el-dropdown-item v-if="canOperateApp" :command="{command:'goToAppHomePage',parameters:null}">
            <i class="majoricon i-home"></i>应用首页
          </el-dropdown-item>

          <el-dropdown-item :command="{command:'quit',parameters:null}">
            <i class="majoricon i-logout"></i>退出（{{ memberName }}）
          </el-dropdown-item>
        </template>

        <el-dropdown-item :command="{command:'reportOffence',parameters:null}">
          <i class="majoricon i-mail"></i>举报
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </span>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import loginApi from '@/common/api/login-api';
import {isInIframe} from "@/common/utils/common-utils";
import {viewGeoLocation} from "@/common/utils/geolocation-utils";

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  props: {
    submissionId: {
      type: String,
    }
  },

  methods: {
    isInIframe,
    ...clientQrStore.mapMutations(['setMode']),

    handleCommand(command) {
      return this[command.command](command.parameters);
    },

    startLogin() {
      this.$router.replace({name: 'login', query: {from: location.href}});
    },

    reportOffence() {
      window.location = `${location.origin}/r/MRY337143110947570688/pages/p_VvDFqQ78Q5m5K15vK_UkTg/?referenceData=${location.href}`;
    },

    gotToBaseInfoEditPage() {
      this.$router.replace({name: 'qr-setting'});
    },

    goToQrHomePage() {
      this.$router.push({name: 'new-submission', params: {pageId: this.homePageId}});
    },

    goToAppHomePage() {
      this.$router.push({name: 'app-home', params: {appId: this.appId}});
    },

    enterUpdateMode() {
      this.setMode('UPDATE');
      // this.$message({
      //   message: `切换为更新模式，您可以更新当前表单了`,
      //   customClass: this.$style.updateModeMessageBox,
      //   center: true,
      // });
    },

    goToOperationPage(menuItem) {
      switch (menuItem.type) {
        case 'ALL_SUBMIT_HISTORY': {
          this.$router.push({name: 'qr-submission-history-list', params: {pageId: menuItem.pageId}});
          return;
        }

        case 'SUBMITTER_SUBMISSION': {
          this.$router.push({name: 'qr-my-submission-list', params: {pageId: menuItem.pageId}});
          return;
        }

        case 'TO_BE_APPROVED': {
          this.$router.push({name: 'qr-approve-list', params: {pageId: menuItem.pageId}});
          return;
        }
      }
    },

    viewGeolocation() {
      viewGeoLocation({
        name: this.qrName,
        geolocation: this.qrGeolocation
      });
    },

    quit() {
      return this.$confirm(`确认退出？`, '提示', {
        confirmButtonText: '是的，退出',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        loginApi.logout().then(() => {
          this.$router.replace({name: 'login', query: {forcePageLogin: true}});
        });
      });
    },
  },

  computed: {
    ...clientQrStore.mapGetters([
      'memberName',
      'isLoggedIn',
      'isMemberBelongToTenant',
      'canManageQr',
      'isCurrentHomePage',
      'homePageId',
      'currentPageId',
      'shouldCurrentPageShowProfileButton',
      'canUpdateCurrentSubmission',
      'isReadOnlyMode',
      'isDefaultMode',
      'isApprovalMode',
      'hasAccessToPage',
      'allViewableOperationMenuItems',
      'canOperateApp',
      'appId',
      'isCurrentPageRequireLogin',
      'isGeolocationEnabled',
      'qrGeolocation',
      'qrName',
    ]),

    updateButtonViewable() {
      return (this.isReadOnlyMode || this.isApprovalMode) && this.canUpdateCurrentSubmission;
    },

    canEditBaseInfo() {
      return this.canManageQr && this.isCurrentHomePage && !this.submissionId;//没有submissionId表示当前并不是显式地处理某个submission
    },

    canViewBackToHomePage() {
      return this.hasAccessToPage(this.homePageId) && ((this.currentPageId !== this.homePageId) || this.submissionId);
    },

    shouldShowOperationMenus() {
      return this.isMemberBelongToTenant && this.isCurrentHomePage && !this.submissionId;
    },

    canViewGeolocation() {
      return this.isMemberBelongToTenant && this.isCurrentHomePage && this.isGeolocationEnabled && this.qrGeolocation;
    },
  }
};
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  align-items: center;
}

.eldropdown {
  color: inherit !important;
}

.content {
  display: flex;
  align-items: center;
}

.content:hover {
  filter: brightness(95%);
}

.updateModeMessageBox {
  :global {
    .el-message__content, .el-message__icon {
      color: $oppositeThemeColor;
    }
  }
}

</style>

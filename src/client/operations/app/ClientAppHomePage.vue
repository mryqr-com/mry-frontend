<template>
  <div :class="$style.wrapper">
    <header :class="$style.headerBar">
      <div :class="$style.iconButtonContainer">
        <button :class="$style.headerButton"
                class="majoricon i-appstore plainButton"
                title="我的应用"
                @click="goToMyAppsPage">
        </button>
      </div>
      <span :class="$style.appName">{{ headerName }}</span>

      <div :class="$style.headerSetting">
        <el-dropdown trigger="click" @command="handleSettingCommand">
          <el-button :class="$style.dropdownButton" type="text"><i class="majoricon i-setting"/></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="topApp" icon="el-icon-s-flag">顶置该应用</el-dropdown-item>
            <el-dropdown-item v-if="topAppIds.includes(appId)" command="untopApp" icon="el-icon-circle-close">取消顶置
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>

    <main :class="$style.mainContent">
      <div :class="$style.mainContentTopPlaceHolder"></div>
      <ClientKanbanContainer v-if="allKanbanAttributes.length > 0"
                             :class="$style.kanbanSection"
                             groupId="ALL">
      </ClientKanbanContainer>

      <section :class="$style.navSection">
        <button :class="$style.row" class="plainButton" @click="gotoQrList">
             <span :class="$style.rowLeftTitle">
               <i :class="[$style.rowIcon, $style.qrListIcon]" class="majoricon i-qrcode"/>
               {{ instanceDesignation }}列表
             </span>
          <i :class="$style.rowRightArrow" class="majoricon i-right"/>
        </button>

        <button v-for="menuItem in allViewableAppOperationMenuItems"
                :class="$style.row"
                class="plainButton"
                @click="gotoMenu(menuItem)">
                <span :class="$style.rowLeftTitle">
                <i :class="[$style.rowIcon,menuItem.icon]" :style="rowIconStyle(menuItem)" class="majoricon"/>
                {{ menuItem.name }}
                </span>
          <i :class="$style.rowRightArrow" class="majoricon i-right"/>
        </button>

        <button v-if="canManageApp && hasReports"
                :class="$style.row"
                class="plainButton"
                @click="gotoReportPage">
             <span :class="$style.rowLeftTitle">
               <i :class="[$style.rowIcon, $style.reportIcon]" class="majoricon i-piechart"/>
               统计报表
             </span>
          <i :class="$style.rowRightArrow" class="majoricon i-right"/>
        </button>

        <button v-if="hasViewableGroups"
                :class="$style.row"
                class="plainButton"
                @click="gotoGroupOperationHomePage">
             <span :class="$style.rowLeftTitle">
               <i :class="[$style.rowIcon, $style.groupManageIcon]" class="majoricon i-apartment"/>
               {{ groupDesignation }}列表
             </span>
          <i :class="$style.rowRightArrow" class="majoricon i-right"/>
        </button>

        <button v-if="isAppAssignmentEnabled" :class="$style.row" class="plainButton"
                @click="gotoMyAssignmentListPage">
             <span :class="$style.rowLeftTitle">
               <i :class="[$style.rowIcon, $style.myAssignmentsIcon]" class="majoricon i-carryout"/>
               我的任务
             </span>
          <i :class="$style.rowRightArrow" class="majoricon i-right"/>
        </button>

        <button v-if="hasManagableGroups && isAppAssignmentEnabled"
                :class="$style.row"
                class="plainButton"
                @click="gotoAssignmentListPage">
             <span :class="$style.rowLeftTitle">
               <i :class="[$style.rowIcon, $style.assignmentsIcon]" class="majoricon i-calendar-check"/>
               任务列表
             </span>
          <i :class="$style.rowRightArrow" class="majoricon i-right"/>
        </button>

        <button v-if="isAppManualEnabled"
                :class="$style.row"
                class="plainButton"
                @click="gotoAppManualPage">
             <span :class="$style.rowLeftTitle">
               <i :class="[$style.rowIcon, $style.appManualIcon]" class="majoricon i-file-text"/>
               用户手册
             </span>
          <i :class="$style.rowRightArrow" class="majoricon i-right"/>
        </button>
      </section>
    </main>
  </div>
</template>

<script>
import {createNamespacedHelpers, mapGetters, mapMutations} from 'vuex';
import memberApi from "@/common/api/member-api";
import {isInWx} from "@/common/utils/common-utils";
import ClientKanbanContainer from '@/client/operations/app/kanban/ClientKanbanContainer';

const clientAppOperationStore = createNamespacedHelpers('CLIENT_APP_OPERATION_STORE');

export default {
  components: {
    ClientKanbanContainer
  },

  created() {
    document.title = this.appName;
  },

  computed: {
    ...mapGetters([
      'topAppIds',
    ]),

    ...clientAppOperationStore.mapGetters([
      'appId',
      'appName',
      'instanceDesignation',
      'groupDesignation',
      'allViewableAppOperationMenuItems',
      'hasViewableGroups',
      'allKanbanAttributes',
      'hasReports',
      'canManageApp',
      'isAppManualEnabled',
      'isAppAssignmentEnabled',
      'hasManagableGroups',
    ]),

    headerName() {
      if (isInWx()) {
        return '应用首页';
      }
      return this.appName;
    }
  },

  methods: {
    ...mapMutations([
      'addToppedApp',
      'deleteToppedApp',
    ]),

    handleSettingCommand(command) {
      return this[command]();
    },

    topApp() {
      return memberApi.topApp(this.appId).then(() => {
        this.addToppedApp(this.appId);
        this.$message({
          type: 'success',
          message: `顶置成功。`,
          center: true,
          duration: 1000,
        });
      })
    },

    untopApp() {
      return memberApi.cancelTopApp(this.appId).then(() => {
        this.deleteToppedApp(this.appId);
        this.$message({
          type: 'success',
          message: `成功取消顶置。`,
          center: true,
          duration: 1000,
        });
      })
    },

    goToMyAppsPage() {
      this.$router.push({name: 'default-home'});
    },

    gotoQrList() {
      this.$router.push({name: 'app-qrs'});
    },

    gotoReportPage() {
      this.$router.push({name: 'app-reports'});
    },

    gotoGroupOperationHomePage() {
      this.$router.push({name: 'app-groups'});
    },

    gotoAssignmentListPage() {
      this.$router.push({name: 'client-assignment-list'});
    },

    gotoMyAssignmentListPage() {
      this.$router.push({name: 'client-my-assignment-list'});
    },

    gotoAppManualPage() {
      this.$router.push({name: 'app-manual'});
    },

    gotoMenu(menuItem) {
      switch (menuItem.type) {
        case 'ALL_SUBMIT_HISTORY': {
          this.$router.push({name: 'client-submission-history-list', params: {pageId: menuItem.pageId}});
          return;
        }

        case 'SUBMITTER_SUBMISSION': {
          this.$router.push({name: 'client-my-submission-list', params: {pageId: menuItem.pageId}});
          return;
        }

        case 'TO_BE_APPROVED': {
          this.$router.push({name: 'client-approve-list', params: {pageId: menuItem.pageId}});
          return;
        }
      }
    },

    rowIconStyle(menuItem) {
      let backgroundColor;
      switch (menuItem.type) {
        case 'ALL_SUBMIT_HISTORY': {
          backgroundColor = '#4698ef';
          break;
        }

        case 'SUBMITTER_SUBMISSION': {
          backgroundColor = '#ef5e63';
          break;
        }
        default: {
          backgroundColor = '#07BF9B';
        }
      }

      return {
        backgroundColor: backgroundColor,
      }
    },
  }
};
</script>

<style lang="scss" module>
$rowHeight: 70px;

.wrapper {
  height: 100%;
  overflow-y: auto;
}

.headerBar {
  height: $clientTopBarHeight;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: $clientPageZIndex + 1;
  background-color: white;
  display: flex;
  align-items: center;
  box-shadow: $lightShadow;
}

.iconButtonContainer {
  flex-shrink: 0;
  flex-grow: 0;
  padding: 10px;
}

.headerButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: $clientIconButtonLength;
  height: $clientIconButtonLength;
  color: $regularTextColor;
  font-size: 20px;
}

.appName {
  flex-grow: 1;
  flex-shrink: 0;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  color: $primaryTextColor;
}

.headerSetting {
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: $clientTopBarHeight;
  height: 100%;
}

.dropdownButton {
  color: $regularTextColor;
  width: $clientIconButtonLength;
  height: $clientIconButtonLength;
  padding: 0;
}

.dropdownButton {
  :global {
    .i-setting {
      font-size: 20px;
    }
  }
}

.mainContent {
  margin-top: $clientTopBarHeight;
  height: calc(100vh - #{$clientTopBarHeight});
  overflow-y: auto;
}

.mainContentTopPlaceHolder {
  height: 30px;
}

.kanbanSection {
  margin-bottom: 30px;
}

.navSection {
  position: relative;
  border-top: $primary1pxBorder;
  border-bottom: $primary1pxBorder;
  z-index: $clientPageZIndex;
  margin-bottom: 30px;
}

.row {
  width: 100%;
  border-bottom: $primary1pxBorder;
  height: $rowHeight;
  background-color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  cursor: pointer;
}

.row:last-child {
  border-bottom: none;
}

.rowLeftTitle {
  display: flex;
  align-items: center;
  flex-grow: 1;
  font-size: 15px;
}

.rowIcon {
  font-weight: 500;
  color: white;
  padding: 5px 6px;
  margin-right: 15px;
  border-radius: 2px;
}

.qrListIcon {
  background-color: $primaryThemeColor;
}

.reportIcon {
  background-color: #ff5900;
}

.groupManageIcon {
  background-color: #FF8C00;
}

.myAssignmentsIcon {
  background-color: #0bb4e7;
}

.assignmentsIcon {
  background-color: #49be0e;
}

.appManualIcon {
  background-color: rgba(0, 127, 255, 1);
}

.rowRightArrow {
  flex-grow: 0;
  font-size: 15px;
  font-weight: 500;
  color: $regularTextColor;
}

</style>

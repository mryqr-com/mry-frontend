<template>
  <div :class="$style.wrapper">
    <header :class="$style.headerBar">
      <div :class="$style.iconButtonContainer">
        <button :class="$style.headerButton"
                class="majoricon i-left plainButton"
                title="返回上级"
                @click="goToGroupListPage">
        </button>
      </div>

      <span :class="$style.groupName">{{ groupNameOf(groupId) }}</span>
      <span :class="$style.headerEmptySpanHolder"></span>
    </header>

    <main :class="$style.mainContent">
      <ClientKanbanContainer v-if="allKanbanAttributes.length > 0"
                             :class="$style.kanbanSection"
                             :groupId="groupId">
      </ClientKanbanContainer>

      <section :class="$style.navSection">
        <button :class="$style.row" class="plainButton" @click="gotoQrList">
             <span :class="$style.rowLeftTitle">
               <i :class="[$style.rowIcon, $style.qrListIcon]" class="majoricon i-qrcode"/>
               {{ instanceDesignation }}列表
             </span>
          <i :class="$style.rowRightArrow" class="majoricon i-right"/>
        </button>

        <button v-for="menuItem in allViewableGroupOperationMenuItems"
                :class="$style.row"
                class="plainButton"
                @click="gotoMenu(menuItem)">
                <span :class="$style.rowLeftTitle">
                <i :class="[$style.rowIcon,menuItem.icon]" :style="rowIconStyle(menuItem)" class="majoricon"/>
                {{ menuItem.name }}
                </span>
          <i :class="$style.rowRightArrow" class="majoricon i-right"/>
        </button>

        <button v-if="canManageGroup(groupId) && hasReports"
                :class="$style.row"
                class="plainButton"
                @click="gotoReportPage">
             <span :class="$style.rowLeftTitle">
               <i :class="[$style.rowIcon, $style.reportIcon]" class="majoricon i-piechart"/>
               统计报表
             </span>
          <i :class="$style.rowRightArrow" class="majoricon i-right"/>
        </button>

        <button v-if="isAppAssignmentEnabled"
                :class="$style.row"
                class="plainButton"
                @click="gotoGroupMyAssignmentListPage">
             <span :class="$style.rowLeftTitle">
               <i :class="[$style.rowIcon, $style.myAssignmentsIcon]" class="majoricon i-carryout"/>
               我的任务
             </span>
          <i :class="$style.rowRightArrow" class="majoricon i-right"/>
        </button>

        <button v-if="canManageGroup(groupId) && isAppAssignmentEnabled"
                :class="$style.row"
                class="plainButton"
                @click="gotoAssignmentListPage">
             <span :class="$style.rowLeftTitle">
               <i :class="[$style.rowIcon, $style.assignmentsIcon]" class="majoricon i-calendar-check"/>
               任务列表
             </span>
          <i :class="$style.rowRightArrow" class="majoricon i-right"/>
        </button>

      </section>
    </main>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import ClientKanbanContainer from '@/client/operations/app/kanban/ClientKanbanContainer';

const clientAppOperationStore = createNamespacedHelpers('CLIENT_APP_OPERATION_STORE');

export default {
  props: ['groupId'],

  components: {
    ClientKanbanContainer,
  },

  created() {
    document.title = this.appName;
  },

  computed: {
    ...clientAppOperationStore.mapGetters([
      'managableGroupIds',
      'viewableGroupIds',
      'approvableGroupIds',
      'groupNameOf',
      'allViewableAppOperationMenuItems',
      'instanceDesignation',
      'allKanbanAttributes',
      'appName',
      'hasReports',
      'canManageGroup',
      'isAppAssignmentEnabled',
    ]),

    allViewableGroupOperationMenuItems() {
      return this.allViewableAppOperationMenuItems.filter(item => {
        switch (item.type) {
          case 'ALL_SUBMIT_HISTORY': {
            return this.managableGroupIds.includes(this.groupId);
          }
          case 'SUBMITTER_SUBMISSION': {
            return this.viewableGroupIds.includes(this.groupId);
          }
          case 'TO_BE_APPROVED': {
            return this.approvableGroupIds.includes(this.groupId);
          }
        }
      });
    }
  },

  methods: {
    goToGroupListPage() {
      this.$router.push({name: 'app-groups'});
    },

    gotoQrList() {
      this.$router.push({name: 'client-group-operation-qr-list'});
    },

    gotoReportPage() {
      this.$router.push({name: 'client-group-operation-reports'});
    },

    gotoAssignmentListPage() {
      this.$router.push({name: 'client-group-assignment-list'});
    },

    gotoGroupMyAssignmentListPage() {
      this.$router.push({name: 'client-group-my-assignment-list'});
    },

    gotoMenu(menuItem) {
      switch (menuItem.type) {
        case 'ALL_SUBMIT_HISTORY': {
          this.$router.push({
            name: 'client-group-operation-submission-history-list',
            params: {pageId: menuItem.pageId}
          });
          return;
        }

        case 'SUBMITTER_SUBMISSION': {
          this.$router.push({
            name: 'client-group-operation-submitter-submission-list',
            params: {pageId: menuItem.pageId}
          });
          return;
        }

        case 'TO_BE_APPROVED': {
          this.$router.push({name: 'group-operation-approve-list', params: {pageId: menuItem.pageId}});
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
  flex-shrink: 0;
  flex-grow: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: $clientIconButtonLength;
  height: $clientIconButtonLength;
  color: $regularTextColor;
  font-size: 20px;
}

.groupName {
  flex-grow: 1;
  flex-shrink: 0;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  color: $primaryTextColor;
}

.headerEmptySpanHolder {
  width: calc(#{$clientIconButtonLength} + 20px);
  height: 100%;
}

.mainContent {
  margin-top: calc(#{$clientTopBarHeight} + 30px);
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

.myAssignmentsIcon {
  background-color: #0bb4e7;
}

.assignmentsIcon {
  background-color: #49be0e;
}

.rowRightArrow {
  flex-grow: 0;
  font-size: 15px;
  font-weight: 500;
  color: $regularTextColor;
}
</style>

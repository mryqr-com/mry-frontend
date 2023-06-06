<template>
  <LeftNavedPageWrapper>
    <template v-slot:menu="{fold}">
      <ul>
        <li :class="$style.menuLi">
          <router-link :class="[$style.link,{[$style.foldedLink]:fold}]"
                       :title="`${instanceDesignation}列表`"
                       :to="{name:'qr-list'}"
                       tag="div">
            <span :class="[$style.icon,{[$style.foldedIcon]:fold}]"><icon icon="list"/></span>
            <span v-if="!fold">{{ instanceDesignation }}列表</span>
          </router-link>
        </li>

        <li v-for="menuItem in allViewableAppOperationMenuItems" :class="$style.menuLi">
          <router-link :class="[$style.link,{[$style.foldedLink]:fold}]"
                       :title="menuItem.name"
                       :to="operationMenuLink(menuItem)"
                       tag="div">
            <span :class="[$style.icon,{[$style.foldedIcon]:fold}]"><icon :icon="menuItem.icon"/></span>
            <span v-if="!fold">{{ menuItem.name }}</span>
          </router-link>
        </li>

        <li v-if="canManageCurrentApp" :class="$style.menuLi">
          <router-link :class="[$style.link,{[$style.foldedLink]:fold}]"
                       :to="{name:'app-reports'}"
                       tag="div"
                       title="统计报表">
            <span :class="[$style.icon,{[$style.foldedIcon]:fold}]"><icon icon="chart-bar"/></span>
            <span v-if="!fold">统计报表</span>
          </router-link>
        </li>

        <li :class="$style.menuLi">
          <router-link :class="[$style.link,{[$style.foldedLink]:fold}]"
                       :title="`${groupDesignation}列表`"
                       :to="{name:'group-list'}"
                       tag="div">
            <span :class="[$style.icon,{[$style.foldedIcon]:fold}]"><icon icon="stream"/></span>
            <span v-if="!fold">{{ groupDesignation }}列表</span>
          </router-link>
        </li>

        <li v-if="canManageCurrentApp" :class="$style.menuLi">
          <router-link :class="[$style.link,{[$style.foldedLink]:fold}]"
                       :title="`${groupDesignation}管理`"
                       :to="{name:'group-manage'}"
                       tag="div">
            <span :class="[$style.icon,{[$style.foldedIcon]:fold}]"><icon icon="sitemap"/></span>
            <span v-if="!fold">{{ groupDesignation }}管理</span>
          </router-link>
        </li>

        <li v-if="canManageCurrentApp && currentAppPlateBatchEnabled" :class="$style.menuLi">
          <router-link :class="[$style.link,{[$style.foldedLink]:fold}]"
                       :to="{name:'platebatch-list'}"
                       tag="div"
                       title="批量码牌">
            <span :class="[$style.icon,{[$style.foldedIcon]:fold}]"><icon icon="clone"/></span>
            <span v-if="!fold">批量码牌</span>
          </router-link>
        </li>

        <li v-if="currentAppAssignmentEnabled" :class="$style.menuLi">
          <router-link :class="[$style.link,{[$style.foldedLink]:fold}]"
                       :to="{name:'my-assignment-list'}"
                       tag="div"
                       title="我的任务">
            <span :class="[$style.icon,{[$style.foldedIcon]:fold}]"><icon :icon="['far','calendar-check']"/></span>
            <span v-if="!fold">我的任务</span>
          </router-link>
        </li>

        <li v-if="hasManagableGroups && currentAppAssignmentEnabled" :class="$style.menuLi">
          <router-link :class="[$style.link,{[$style.foldedLink]:fold}]"
                       :to="{name:'assignment-list'}"
                       tag="div"
                       title="任务列表">
            <span :class="[$style.icon,{[$style.foldedIcon]:fold}]"><icon :icon="['far','calendar-minus']"/></span>
            <span v-if="!fold">任务列表</span>
          </router-link>
        </li>

        <li v-if="canManageCurrentApp && currentAppAssignmentEnabled" :class="$style.menuLi">
          <router-link :class="[$style.link,{[$style.foldedLink]:fold}]"
                       :to="{name:'assignment-plan-list'}"
                       tag="div"
                       title="任务设置">
            <span :class="[$style.icon,{[$style.foldedIcon]:fold}]"><icon :icon="['far','calendar-alt']"/></span>
            <span v-if="!fold">任务设置</span>
          </router-link>
        </li>

        <li v-if="currentAppManualEnabled" :class="$style.menuLi">
          <router-link :class="[$style.link,{[$style.foldedLink]:fold}]"
                       :to="{name:'app-manual'}"
                       tag="div"
                       title="用户手册">
            <span :class="[$style.icon,{[$style.foldedIcon]:fold}]"><icon icon="book-open"/></span>
            <span v-if="!fold">用户手册</span>
          </router-link>
        </li>
      </ul>
    </template>

    <div :class="$style.rightSection">
      <AppOperationTopBar></AppOperationTopBar>

      <!--本来可以使用fullPath而不是path的，但是fullPath时markdown的页内跳转将修改URL，导致页面组件会重新渲染-->
      <router-view :key="$route.path"></router-view>
    </div>

  </LeftNavedPageWrapper>
</template>

<script>
import appApi from '@/common/api/app-api';
import {createNamespacedHelpers} from 'vuex';
import AppOperationTopBar from '@/console/app-operation/AppOperationTopBar';
import LeftNavedPageWrapper from '@/console/common/LeftNavedPageWrapper';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  components: {
    AppOperationTopBar,
    LeftNavedPageWrapper
  },

  mounted() {
    if (this.$route.name === 'app-ops') {
      if (this.currentAppLandingPageType === 'GROUP_LIST') {
        this.$router.replace({name: 'group-list'});
        return;
      }

      if (this.currentAppLandingPageType === 'FIRST_QR') {
        return appApi.fetchAppFirstQr(this.currentAppId).then(response => {
          if (response.data) {
            this.$router.replace({name: 'qr-operation-workbench', params: {qrId: response.data.id}});
          } else {
            this.$router.replace({name: 'qr-list'});
          }
        });
      }

      this.$router.replace({name: 'qr-list'});
    }
  },

  computed: {
    ...appOperationStore.mapGetters([
      'hasManagableGroups',
      'canManageCurrentApp',
      'allViewableAppOperationMenuItems',
      'groupDesignation',
      'instanceDesignation',
      'currentAppPlateBatchEnabled',
      'currentAppManualEnabled',
      'currentAppAssignmentEnabled',
      'currentAppLandingPageType',
      'currentAppId',
    ]),
  },

  methods: {
    operationMenuLink(menuItem) {
      switch (menuItem.type) {
        case 'ALL_SUBMIT_HISTORY': {
          return {name: 'submission-history-list', params: {pageId: menuItem.pageId}};
        }

        case 'SUBMITTER_SUBMISSION': {
          return {name: 'my-submission-list', params: {pageId: menuItem.pageId}};
        }

        case 'TO_BE_APPROVED': {
          return {name: 'approve-list', params: {pageId: menuItem.pageId}};
        }
      }
    }
  },

}
</script>


<style lang="scss" module>
.menuLi:hover {
  background-color: $leftBarBackgroundColor;
}

.menuLi {
  :global {
    .router-link-active {
      color: white;
      background-color: $oppositeThemeColor;
    }
  }
}

.link {
  display: flex;
  align-items: center;
  color: $leftBarTextColor;
  padding-top: 18px;
  padding-bottom: 18px;
  padding-left: 30px;
  font-size: 15px;
  cursor: pointer;
}

.foldedLink {
  justify-content: center;
  padding-left: 0;
}

.icon {
  display: inline-block;
  width: 30px;
}

.foldedIcon {
  width: auto;
}

.rightSection {
  height: 100vh;
}

</style>

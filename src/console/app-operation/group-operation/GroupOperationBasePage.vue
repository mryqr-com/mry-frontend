<template>
  <LeftNavedPageWrapper>
    <template v-slot:menu="{fold}">
      <ul>
        <li :class="$style.menuLi">
          <router-link :class="[$style.link,{[$style.foldedLink]:fold}]"
                       :title="`${instanceDesignation}列表`"
                       :to="{name:'group-operation-qr-list',params: { groupId: groupId }}"
                       tag="div">
            <span :class="[$style.icon,{[$style.foldedIcon]:fold}]"><icon icon="list"/></span>
            <span v-if="!fold">{{ instanceDesignation }}列表</span>
          </router-link>
        </li>

        <li v-for="menuItem in allViewableGroupOperationMenuItems" :class="$style.menuLi">
          <router-link :class="[$style.link,{[$style.foldedLink]:fold}]"
                       :title="menuItem.name"
                       :to="operationMenuLink(menuItem)"
                       tag="div">
            <span :class="[$style.icon,{[$style.foldedIcon]:fold}]"><icon :icon="menuItem.icon"/></span>
            <span v-if="!fold">{{ menuItem.name }}</span>
          </router-link>
        </li>

        <li v-if="canManageGroup(groupId) && hasReports" :class="$style.menuLi">
          <router-link :class="[$style.link,{[$style.foldedLink]:fold}]"
                       :to="{name:'group-operation-reports',params: { groupId: groupId }}"
                       tag="div"
                       title="统计报表">
            <span :class="[$style.icon,{[$style.foldedIcon]:fold}]"><icon icon="chart-bar"/></span>
            <span v-if="!fold">统计报表</span>
          </router-link>
        </li>

        <li v-if="currentAppAssignmentEnabled" :class="$style.menuLi">
          <router-link :class="[$style.link,{[$style.foldedLink]:fold}]"
                       :to="{name:'group-my-assignment-list',params: { groupId: groupId }}"
                       tag="div"
                       title="我的任务">
            <span :class="[$style.icon,{[$style.foldedIcon]:fold}]"><icon :icon="['far','calendar-check']"/></span>
            <span v-if="!fold">我的任务</span>
          </router-link>
        </li>

        <li v-if="canManageGroup(groupId) && currentAppAssignmentEnabled" :class="$style.menuLi">
          <router-link :class="[$style.link,{[$style.foldedLink]:fold}]"
                       :to="{name:'group-assignment-list',params: { groupId: groupId }}"
                       tag="div"
                       title="任务列表">
            <span :class="[$style.icon,{[$style.foldedIcon]:fold}]"><icon :icon="['far','calendar-minus']"/></span>
            <span v-if="!fold">任务列表</span>
          </router-link>
        </li>

        <li v-if="canManageGroup(groupId) && currentAppAssignmentEnabled" :class="$style.menuLi">
          <router-link :class="[$style.link,{[$style.foldedLink]:fold}]"
                       :to="{name:'group-assignment-plan-list',params: { groupId: groupId }}"
                       tag="div"
                       title="任务设置">
            <span :class="[$style.icon,{[$style.foldedIcon]:fold}]"><icon :icon="['far','calendar-alt']"/></span>
            <span v-if="!fold">任务设置</span>
          </router-link>
        </li>
      </ul>
    </template>

    <div :class="$style.rightSection">
      <GroupOperationTopBar :groupId="groupId"></GroupOperationTopBar>
      <router-view :key="$route.path"></router-view>
    </div>
  </LeftNavedPageWrapper>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import GroupOperationTopBar from '@/console/app-operation/group-operation/GroupOperationTopBar';
import LeftNavedPageWrapper from '@/console/common/LeftNavedPageWrapper';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: ['groupId'],

  components: {
    GroupOperationTopBar,
    LeftNavedPageWrapper
  },

  computed: {
    ...appOperationStore.mapGetters([
      'managableGroupIds',
      'canManageGroup',
      'viewableGroupIds',
      'approvableGroupIds',
      'allViewableAppOperationMenuItems',
      'instanceDesignation',
      'hasReports',
      'currentAppAssignmentEnabled'
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
    operationMenuLink(menuItem) {
      switch (menuItem.type) {
        case 'ALL_SUBMIT_HISTORY': {
          return {
            name: 'group-operation-submission-history-list',
            params: {groupId: this.groupId, pageId: menuItem.pageId}
          };
        }

        case 'SUBMITTER_SUBMISSION': {
          return {
            name: 'group-operation-submitter-submission-list',
            params: {groupId: this.groupId, pageId: menuItem.pageId}
          };
        }

        case 'TO_BE_APPROVED': {
          return {
            name: 'group-operation-approve-list',
            params: {groupId: this.groupId, pageId: menuItem.pageId}
          };
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

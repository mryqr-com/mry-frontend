<template>
  <div :class="$style.wrapper">
    <header :class="$style.headerBar">
      <div :class="$style.iconButtonContainer">
        <button :class="$style.headerButton"
                class="majoricon i-left plainButton"
                title="返回应用首页"
                @click="goToAppHomePage">
        </button>
      </div>

      <section :class="$style.searchSection">
        <el-input ref="searchBox"
                  v-model="searchTerm"
                  :class="$style.searchInput"
                  :maxlength="50"
                  placeholder="搜索..."
                  size="small"
                  title="搜索">
        </el-input>
      </section>

      <div :class="$style.iconButtonContainer">
        <button v-if="canManageApp && !isAppGroupSynced"
                :class="[$style.headerButton,$style.addGroupButton]"
                :title="addGroupTitle"
                class="majoricon i-plus plainButton"
                @click="openAddGroupDialog">
        </button>
      </div>
    </header>

    <main :class="$style.mainContent">
      <div :class="$style.mainContentTopPlaceHolder"></div>
      <div v-if="finalGroups.length > 0" :class="$style.groupContainer">
        <div v-for="group in finalGroups"
             :class="$style.groupRow"
             @click.self="gotoGroupOperationHome(group)">
        <span :class="$style.groupName" @click="gotoGroupOperationHome(group)">
          <i :class="$style.groupRowIcon" class="majoricon i-folder"/>
          {{ group.name }}
        </span>
          <ClientGroupOperationButtons :class="$style.groupOperationButtons"
                                       :group="group">
          </ClientGroupOperationButtons>
        </div>
      </div>
      <div v-else :class="$style.noDataPlaceholder">无数据</div>
    </main>

    <ClientCreateGroupDialog :show.sync="addGroupDialogVisible"></ClientCreateGroupDialog>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import ClientCreateGroupDialog from '@/client/operations/app/groups/ClientCreateGroupDialog';
import ClientGroupOperationButtons from '@/client/operations/app/groups/ClientGroupOperationButtons';

const clientAppOperationStore = createNamespacedHelpers('CLIENT_APP_OPERATION_STORE');

export default {
  props: ['appId'],

  components: {
    ClientCreateGroupDialog,
    ClientGroupOperationButtons
  },

  data() {
    return {
      addGroupDialogVisible: false,
      searchTerm: null,
    }
  },

  created() {
    document.title = this.appName;
  },

  computed: {
    ...clientAppOperationStore.mapGetters([
      'groupDesignation',
      'canManageApp',
      'viewableGroups',
      'appName',
      'isAppGroupSynced',
    ]),

    addGroupTitle() {
      return this.groupDesignation === '分组' ? '新建分组' : `新建${this.groupDesignation}或分组`;
    },

    finalGroups() {
      if (!this.searchTerm) {
        return this.viewableGroups;
      }

      let keywords = this.searchTerm.split(' ');
      return this.viewableGroups.filter(app => keywords.every(keyword => app.name.indexOf(keyword) > -1));
    }
  },

  methods: {
    goToAppHomePage() {
      this.$router.push({name: 'app-home'});
    },

    gotoGroupOperationHome(group) {
      this.$router.push({name: 'client-group-operation-home', params: {groupId: group.id}});
    },

    openAddGroupDialog() {
      this.addGroupDialogVisible = true;
    },
  }
}
</script>

<style lang="scss" module>
$groupRowHeight: 70px;

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

.headerButton {
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: $clientIconButtonLength;
  height: $clientIconButtonLength;
  font-size: 20px;
  color: $regularTextColor;
}

.iconButtonContainer {
  flex-grow: 0;
  flex-shrink: 0;
  padding: 10px;
}

.addGroupButton:before {
  font-size: 24px;
  color: $regularTextColor;
}

.searchSection {
  flex-shrink: 1;
  flex-grow: 1;
  margin-left: 20px;
  margin-right: 10px;
}

.searchInput {
  width: 100%;
}

.mainContent {
  position: relative;
  z-index: $clientPageZIndex;
  margin-top: $clientTopBarHeight;
  height: calc(100vh - #{$clientTopBarHeight});
  overflow-y: auto;
}

.mainContentTopPlaceHolder {
  height: 30px;
}

.groupContainer {
  border-top: $primary1pxBorder;
}

.groupRow {
  width: 100%;
  height: $groupRowHeight;
  border-bottom: $primary1pxBorder;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px 0 20px;
}

.groupName {
  flex-grow: 1;
  font-size: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.groupRowIcon {
  font-size: 18px;
  font-weight: 500;
  color: #FF8C00;
  margin-right: 15px;
}

.groupOperationButtons {
  flex-grow: 0;
  padding-left: 10px;
  padding-right: 10px;
  margin-top: -10px;
}

.noDataPlaceholder {
  margin-top: 15px;
  color: $secondaryTextColor;
  text-align: center;
}

</style>

<template>
  <div v-if="myAppsLoaded" :class="$style.wrapper">
    <div :class="$style.opsBar">
      <div :class="$style.theTitle">应用列表</div>
      <el-input v-model="searchTerm"
                :class="$style.searchInput"
                :disabled="myApps.length === 0"
                :maxlength="50"
                :spellcheck="false"
                clearable
                placeholder="搜索..."
                size="medium"
                @clear="searchApp"
                @keyup.enter.native="searchApp">

        <el-button slot="append"
                   :class="$style.searchButton"
                   icon="el-icon-search"
                   type="primary"
                   @click="searchApp">
        </el-button>

      </el-input>
    </div>

    <div ref="listArea" :class="$style.listContent">
      <div v-if="myApps.length > 0 && finalApps.length > 0" :class="$style.appContainer">
        <el-row :class="$style.appRow" :gutter="30">
          <el-col v-for="app in finalApps" :key="app.id"
                  :class="$style.appColumn"
                  :lg="{span:'4-8'}"
                  :sm="12"
                  :xs="12">
            <div :class="$style.cardContainer">
              <div :class="$style.topDropdown">
                <el-dropdown trigger="click" @command="handleAppCommand">
                  <el-button :class="$style.dropdownButton" title="更多操作" type="text">...</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="{command:'topApp',parameters:app.id}"
                                      icon="el-icon-s-flag">顶置
                    </el-dropdown-item>

                    <el-dropdown-item v-if="currentMemberTopAppIds.includes(app.id)"
                                      :command="{command:'cancelTopApp',parameters:app.id}"
                                      icon="el-icon-circle-close">取消顶置
                    </el-dropdown-item>

                    <el-dropdown-item v-if="isTenantAdmin && !app.locked"
                                      :command="{command:'editApp',parameters:app.id}"
                                      icon="el-icon-edit-outline">编辑应用
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>

              <div v-if="currentMemberTopAppIds.includes(app.id)" :class="$style.toppedApp">
                <i class="el-icon-s-flag" title="已顶置"></i>
              </div>

              <router-link :class="$style.appCard"
                           :to="{ name: 'app-ops', params: {appId: app.id}}">
                <div :class="$style.imageContainer">
                  <div :class="$style.imageWrapper"
                       :style="appIcon(app.icon)">
                  </div>
                </div>
                <div :class="$style.nameWrapper">{{ app.name }}</div>
              </router-link>
            </div>
          </el-col>
        </el-row>
      </div>

      <div v-else-if="myApps.length === 0" :class="$style.emptyContainer">
        <div>
          <div :class="$style.emptyImageContainer"
               :style="emptyImage">
          </div>
          <div v-if="isTenantAdmin" :class="$style.emptyText">
            <div :class="$style.noText">当前没有应用</div>
            <el-button :class="$style.addAppButton"
                       type="primary"
                       @click="openCreateAppDialog">
              <i class="el-icon-plus"></i>
              新建应用
            </el-button>
          </div>
          <div v-else :class="$style.emptyText">您当前没有可用的应用!</div>
        </div>
      </div>

      <div v-else :class="$style.emptyContainer">
        <div>
          <div :class="$style.emptyImageContainer"
               :style="emptyImage">
          </div>
          <div :class="$style.emptyText">没有搜索结果!</div>
        </div>
      </div>
    </div>

    <CreateAppDialog :show.sync="createAppDialogVisible" @appCreated="onAppCreated"></CreateAppDialog>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';
import CreateAppDialog from '@/console/management/app/CreateAppDialog';
import memberApi from '@/common/api/member-api';

import appApi from '@/common/api/app-api';
import {imageThumbnailUrl} from '@/common/utils/image-utils'
import defaultAppIcon from '@/common/static/app.svg';
import emptyImageUrl from '@/common/static/empty.svg';
import {cloneDeep} from 'lodash-es';

export default {
  components: {
    CreateAppDialog
  },

  data() {
    return {
      createAppDialogVisible: false,
      searchTerm: null,
      myAppsLoaded: false,
      myApps: [],
      filteredApps: []
    }
  },

  created() {
    document.title = `我的应用 - ${this.tenantName}`;

    if (this.cachedMyApps) {
      this.myApps = cloneDeep(this.cachedMyApps);
      this.filteredApps = this.myApps;
      this.myAppsLoaded = true;
      return;
    }

    return appApi.listMyViewableApps().then((response) => {
      let myApps = response.data;
      let originalIndex = 100;
      myApps.forEach(app => app.originalIndex = originalIndex++);
      this.myApps = myApps;
      this.filteredApps = this.myApps;
      this.myAppsLoaded = true;
      this.loadMyAppsCache(cloneDeep(this.myApps));

      //当URL中有autoRedirect参数时，并且只有一个app时，并且非系统管理员，自动跳转到该app，可用于从官网链接过来的场景
      if (this.$route.query.autoRedirect && this.myApps.length === 1) {
        this.$router.replace({name: 'app-ops', params: {appId: this.myApps[0].id}});
      }
    });
  },

  methods: {
    ...mapMutations([
      'addToppedApp',
      'deleteToppedApp',
      'loadMyAppsCache',
    ]),

    onAppCreated({appId, name}) {
      this.$router.push({
        name: 'app-edit-home',
        params: {appId: appId}
      });
    },

    appIcon(icon) {
      if (!icon) {
        return {
          backgroundImage: `url('${defaultAppIcon}')`
        }
      }

      return {
        backgroundImage: `url('${imageThumbnailUrl(icon)}')`
      };
    },

    openCreateAppDialog() {
      this.createAppDialogVisible = true;
    },

    searchApp() {
      this.filteredApps = this.doSearch();
      this.$refs.listArea.scrollTop = 0;
    },

    doSearch() {
      if (!this.searchTerm) {
        return this.myApps;
      }

      let keywords = this.searchTerm.split(' ');
      return this.myApps.filter(app => keywords.every(keyword => app.name.indexOf(keyword) > -1));
    },

    handleAppCommand(command) {
      return this[command.command](command.parameters);
    },

    topApp(appId) {
      return memberApi.topApp(appId).then(() => {
        this.addToppedApp(appId);
      })
    },

    cancelTopApp(appId) {
      return memberApi.cancelTopApp(appId).then(() => {
        this.deleteToppedApp(appId);
      })
    },

    editApp(appId) {
      this.$router.push({
        name: 'app-edit-home',
        params: {appId: appId}
      });
    },
  },

  computed: {
    ...mapGetters([
      'isTenantAdmin',
      'tenantName',
      'currentMemberTopAppIds',
      'cachedMyApps',
    ]),

    emptyImage() {
      return {
        backgroundImage: `url('${emptyImageUrl}')`
      }
    },

    finalApps() {
      this.filteredApps.forEach((app) => {
        let topAppIndex = this.currentMemberTopAppIds.indexOf(app.id);
        app.topAppIndex = topAppIndex !== -1 ? topAppIndex : 100;
      });

      this.filteredApps.sort(function (app, anotherApp) {
        if (app.topAppIndex !== anotherApp.topAppIndex) {
          return app.topAppIndex - anotherApp.topAppIndex;
        }
        return app.originalIndex - anotherApp.originalIndex;//没有在顶置中，按照原顺序排序
      });

      return this.filteredApps;
    }
  }

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

  :global {
    .el-col-lg-4-8 {
      width: 20%;
    }
  }
}

.opsBar {
  padding: 0 16px;
  height: $ops-bar-height;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: $whiteBackgroundColor;
  box-shadow: $primaryShadow;
}

.theTitle {
  font-weight: 500;
}

.searchInput {
  width: 250px;
}

.searchButton {
  color: $regularTextColor !important;
}

.listContent {
  height: calc(100vh - #{$consoleTopBarHeight} - #{$content-margin} - #{$ops-bar-height} - #{$ops-bar-margin-bottom} - #{$content-margin});
  padding: 24px;
  overflow-y: auto;

}

.appContainer {
  width: 980px;
  margin: auto;
}

.appRow {
}

.appColumn {
  margin-top: 0;
  margin-bottom: 30px;
}

.cardContainer {
  position: relative;
  border: $primary1pxBorder;
}

.cardContainer:hover .topDropdown {
  display: block;
}

.topDropdown {
  display: none;
  position: absolute;
  top: 6px;
  right: 12px;
}

.dropdownButton {
  color: $regularTextColor;
  font-weight: 600;
  font-size: 20px;
  padding: 0;
}

.dropdownButton:hover {
  color: $primaryThemeColor;
}

.toppedApp {
  color: #99d6f5;
  position: absolute;
  top: 10px;
  left: 10px;
}

.appCard {
  display: block;
  cursor: pointer;
}

.appCard:link, .appCard:visited, .appCard:hover, .appCard:active {
  color: $regularTextColor;
}

.appCard:hover {
  box-shadow: 0 2px 4px 0 rgba(160, 160, 160, 0.2), 0 5px 10px 0 rgba(93, 93, 93, 0.19);
}

.imageContainer {
  aspect-ratio: 1.1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
}

.imageWrapper {
  background-position: center center;
  background-size: cover;
  width: 60px;
  height: 60px;
}

.nameWrapper {
  border-top: $primary1pxBorder;
  font-size: 14px;
  line-height: 50px;
  height: 50px;
  text-align: center;
  vertical-align: middle;
  overflow: hidden;
  background-color: #f7f7f7;
  color: $primaryTextColor;
}

.emptyContainer {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emptyImageContainer {
  background-position: center center;
  background-size: cover;
  width: 200px;
  height: 200px;
}

.emptyText {
  margin-top: 20px;
  text-align: center;
}

.noText {
  text-align: center;
  margin-bottom: 10px;
}

.addAppButton {
  width: 200px;
}

</style>

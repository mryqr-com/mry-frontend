<template>
  <div v-if="myAppsLoaded" :class="$style.wrapper">
    <header :class="$style.header">
      <div :class="$style.tenantNameContainer">{{ tenantName }}
        <!--        <i :class="$style.settingIcon" class="el-icon-setting" @click="gotoClientMe"/>-->
      </div>

      <div :class="$style.profileContainer">
        <Avatar :avatar="memberAvatar" :class="$style.avatar" @click.native="gotoClientMe"></Avatar>
        <div :class="$style.memberName" @click="gotoClientMe">{{ memberName }}</div>
      </div>
      <el-input v-model="search"
                :class="$style.searchInput"
                clearable
                placeholder="搜索应用..."
                size="medium">
      </el-input>
    </header>

    <main v-if="displayApps.length > 0" :class="$style.mainContent">
      <el-row :gutter="10">
        <el-col v-for="app in displayApps" :key="app.id" :span="8">
          <button :class="$style.appCard" @click="goToApp(app)">

            <span v-if="topAppIds.includes(app.id)" :class="$style.toppedApp">
              <i class="el-icon-s-flag" title="已顶置"></i>
            </span>

            <span :class="$style.appIcon" :style="appIconStyle(app.icon)"></span>
            <span :class="$style.appName">{{ app.name }}</span>
          </button>
        </el-col>
      </el-row>
    </main>

    <div v-else :class="$style.noAppsContainer">
      当前无应用
    </div>
  </div>
</template>

<script>
import {createNamespacedHelpers, mapGetters, mapMutations} from 'vuex';
import appApi from "@/common/api/app-api";
import defaultAppIcon from "@/common/static/app.svg";
import {imageDisplayUrl} from "@/common/utils/image-utils";

const clientAppOperationStore = createNamespacedHelpers('CLIENT_APP_OPERATION_STORE');

export default {
  data() {
    return {
      myAppsLoaded: false,
      myApps: [],
      search: null,
    }
  },

  created() {
    document.title = '我的应用';

    if (this.cachedMyApps) {
      this.myApps = this.cachedMyApps;
      this.myAppsLoaded = true;
      return;
    }

    return appApi.listMyViewableApps().then((response) => {
      let myApps = response.data;

      //当URL中有autoRedirect参数时，并且只有一个app时，并且非系统管理员，自动跳转到该app，微信公众号的菜单中可设置该参数
      if (this.$route.query.autoRedirect && myApps.length === 1) {
        this.$router.replace({name: 'app-ops', params: {appId: myApps[0].id}});
        return;
      }

      let originalIndex = 100;
      myApps.forEach(app => app.originalIndex = originalIndex++);
      myApps.forEach((app) => {
        let topAppIndex = this.topAppIds.indexOf(app.id);
        app.topAppIndex = topAppIndex !== -1 ? topAppIndex : 100;
      });

      myApps.sort(function (app, anotherApp) {
        if (app.topAppIndex !== anotherApp.topAppIndex) {
          return app.topAppIndex - anotherApp.topAppIndex;
        }
        return app.originalIndex - anotherApp.originalIndex;//没有在顶置中，按照原顺序排序
      });

      this.myApps = myApps;
      this.myAppsLoaded = true;
      this.loadMyAppsCache(this.myApps);
    });
  },

  computed: {
    ...mapGetters([
      'memberName',
      'memberAvatar',
      'tenantName',
      'topAppIds',
      'cachedMyApps',
    ]),

    displayApps() {
      if (!this.search) {
        return this.myApps;
      }

      let keywords = this.search.split(' ');
      return this.myApps.filter(app => keywords.every(keyword => app.name.indexOf(keyword) > -1));
    },
  },

  methods: {
    ...mapMutations(['loadMyAppsCache']),

    ...clientAppOperationStore.mapMutations([
      'clearKanbanDataCache',
    ]),

    gotoClientMe() {
      this.$router.push({name: 'client-me'});
    },

    appIconStyle(icon) {
      if (!icon) {
        return {
          backgroundImage: `url('${defaultAppIcon}')`
        }
      }

      return {
        backgroundImage: `url('${imageDisplayUrl(icon)}')`
      };
    },

    goToApp(app) {
      this.clearKanbanDataCache();
      this.$router.push({name: 'app-ops', params: {appId: app.id}});
    },
  }
};
</script>

<style lang="scss" module>
$headerHeight: 165px;

.wrapper {
  height: 100%;
  overflow-y: auto;
}

.header {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: $clientPageZIndex + 1;
  background-color: $primaryThemeColor;
  height: $headerHeight;
  box-shadow: $primaryShadow;
  padding: 10px;
}

.tenantNameContainer {
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.profileContainer {
  padding-top: 10px;
  padding-bottom: 30px;
  display: flex;
  align-items: center;
  color: white;
}

.profileContainer:hover {
  cursor: pointer;
}

.avatar {
  width: 50px;
  height: 50px;
}

.memberName {
  margin-left: 15px;
  font-size: 20px;
  font-weight: 500;
}

.settingIcon {
  font-size: 16px;
  font-weight: 500;
}

.searchInput {
  width: 100%;

  :global {
    .el-input__inner {
      background-color: white !important;
      border-color: white !important;
    }

    .el-input__inner:hover {
      border-color: white !important;
    }

    .el-input__inner:active {
      border-color: white !important;
    }
  }
}

.mainContent {
  background-color: $primaryBackgroundColor;
  position: relative;
  padding: 20px 10px 10px;
  z-index: $clientPageZIndex;
  margin-top: $headerHeight;
  height: calc(100vh - #{$headerHeight});
  overflow-y: auto;
}

.appCard {
  background: white;
  padding: 0;
  border: none;
  outline: none;
  text-decoration: none;
  width: calc((100vw - 40px) / 3);
  height: calc((100vw - 40px) / 3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  margin-bottom: 10px;
  box-shadow: $primaryShadow;
  overflow: hidden;
}

.appIcon {
  background-position: center center;
  background-size: cover;
  width: 36px;
  height: 36px;
  margin-bottom: 10px;
}

.appName {
  font-size: 13px;
  color: $primaryTextColor;
  height: 15px;
  padding-left: 8px;
  padding-right: 8px;
}

.toppedApp {
  color: #99d6f5;
  position: absolute;
  top: 10px;
  left: 10px;
}

.noAppsContainer {
  position: relative;
  z-index: $clientPageZIndex;
  margin-top: $headerHeight;
  height: calc(100vh - #{$headerHeight});
  font-size: 16px;
  font-weight: 500;
  color: $secondaryTextColor;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: $mobileScreenBreakpoint), print {
  .mainContent {
    margin-left: auto;
    margin-right: auto;
    max-width: 1000px;
  }

  .appCard {
    width: 100%;
    height: auto;
    aspect-ratio: 1;
  }
}

</style>

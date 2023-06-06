<template>
  <div v-if="loaded" :class="$style.wrapper">
    <div :class="$style.headerBar">
      <div :class="$style.iconButtonContainer">
        <button :class="$style.headerButton"
                class="majoricon i-left plainButton"
                title="返回应用首页"
                @click="goToAppHomePage">
        </button>
      </div>
      <div :class="$style.appName">
        <div :class="$style.appIconContainer" :style="appIconStyle"></div>
        {{ appName }}
      </div>
      <span :class="$style.headerEmptySpanHolder"></span>
    </div>

    <main v-if="content" :class="$style.mainContent">
      <div :class="$style.title">用户手册</div>
      <MarkdownViewer :markdown-style="markdownStyle" :value="content"></MarkdownViewer>
    </main>
    <div v-else :class="$style.noDataContainer">当前无用户手册
      <el-button :class="$style.backButton" type="primary" @click="goToAppHomePage">返回</el-button>
    </div>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import appManualApi from "@/common/api/app-manual-api";
import defaultAppIcon from "@/common/static/app.svg";
import {imageThumbnailUrl} from "@/common/utils/image-utils";

const clientAppOperationStore = createNamespacedHelpers('CLIENT_APP_OPERATION_STORE');

export default {
  components: {
    MarkdownViewer: () => import(/* webpackChunkName: "markdown-viewer" */ '@/common/components/MarkdownViewer'),
  },

  data() {
    return {
      loaded: false,
      content: null,
      markdownStyle: {
        fontStyle: {
          fontFamily: "默认",
          fontSize: 15,
          bold: false,
          italic: false,
          color: 'rgba(68, 68, 68, 1)',
        },
        lineHeight: 1.8
      },
    }
  },

  created() {
    document.title = this.appName;

    return appManualApi.fetchAppManual(this.appId).then(response => {
      this.loaded = true;
      if (response.data) {
        this.content = response.data.content;
      } else {
        this.content = null;
      }
    });
  },

  computed: {
    ...clientAppOperationStore.mapGetters([
      'appId',
      'appName',
      'appIcon',
    ]),

    appIconStyle() {
      if (!this.appIcon) {
        return {
          backgroundImage: `url('${defaultAppIcon}')`
        }
      }

      return {
        backgroundImage: `url('${imageThumbnailUrl(this.appIcon)}')`
      };
    },
  },

  methods: {
    goToAppHomePage() {
      this.$router.push({name: 'app-home'});
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
  background-color: white;
  height: 100%;
  overflow-y: auto;
}

.headerBar {
  height: $clientTopBarHeight;
  width: 100%;
  background-color: white;
  display: flex;
  align-items: center;
}

.iconButtonContainer {
  flex-shrink: 0;
  flex-grow: 0;
  padding: 10px;
}

.appName {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 10px;
  padding-right: 10px;
}

.headerButton {
  flex-shrink: 0;
  flex-grow: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: $clientIconButtonLength;
  height: $clientIconButtonLength;
  font-size: 20px;
  color: $regularTextColor;
}

.appIconContainer {
  background-position: center center;
  background-size: cover;
  width: 20px;
  height: 20px;
  margin-right: 6px;
}

.title {
  text-align: center;
  font-size: 32px;
  font-weight: 500;
  padding-bottom: 24px;
  padding-top: 24px;
  color: $primaryTextColor;
  border-bottom: $secondary1pxBorder;
  margin-bottom: 24px;
}

.headerEmptySpanHolder {
  width: calc(#{$clientIconButtonLength} + 20px);
  height: 100%;
}

.mainContent {
  padding: 20px;
}

.noDataContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: $secondaryTextColor;
  text-align: center;
  margin-top: 30vh;
}

.backButton {
  width: $pageButtonWidth;
  margin-top: 15px;
}
</style>

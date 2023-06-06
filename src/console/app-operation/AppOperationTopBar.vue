<template>
  <div :class="$style.wrapper">
    <el-popover v-if="canManageCurrentApp"
                placement="right"
                trigger="hover"
                @show="displayAppResourceUsageInfo">
      <div slot="reference" :class="$style.appName">
        <div :class="$style.appIconContainer"
             :style="appIcon">
        </div>
        {{ currentAppName }}
      </div>

      <div v-if="canManageCurrentApp && !isCurrentAppLocked"
           :class="$style.row"
           class=" marginBottom20">
        <el-button icon="el-icon-edit-outline"
                   size="small"
                   type="primary"
                   plain
                   @click="editApp">
          编辑应用
        </el-button>
      </div>

      <template v-if="appResourceUsages">
        <div :class="$style.appUsageTitle">应用资源用量：</div>

        <div :class="$style.row">
          <div :class="$style.rowTitle">{{ instanceDesignation }}数量：</div>
          <div :class="$style.rowValue">
            {{ appResourceUsages.usedQrCount }}
          </div>
        </div>

        <div :class="$style.row">
          <div :class="$style.rowTitle">提交量：</div>
          <div :class="$style.rowValue">
            {{ appResourceUsages.usedSubmissionCount }}
          </div>
        </div>
      </template>
    </el-popover>
    <div v-else :class="$style.appName">
      <div :class="$style.appIconContainer"
           :style="appIcon">
      </div>
      {{ currentAppName }}
    </div>

    <section :class="$style.rightSection">
      <MryCustomerServiceEntry :class="$style.rightSectionIcon"
                               :iconSize="16"
                               :textSize="12"
                               color="#909399">
      </MryCustomerServiceEntry>

      <MryDocumentationEntry :class="$style.rightSectionIcon"
                             :iconSize="16"
                             :textSize="12"
                             color="#909399">
      </MryDocumentationEntry>

      <MryMobileEntry :class="$style.rightSectionIcon"
                      :iconSize="16"
                      :textSize="12">
      </MryMobileEntry>
      <Profile></Profile>
    </section>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import Profile from '@/console/common/Profile';
import appApi from '@/common/api/app-api';
import defaultAppIcon from "@/common/static/app.svg";
import {imageThumbnailUrl} from "@/common/utils/image-utils";

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  components: {
    Profile
  },

  data() {
    return {
      appResourceUsages: null,
    }
  },

  computed: {
    ...appOperationStore.mapGetters([
      'currentAppName',
      'currentAppId',
      'canManageCurrentApp',
      'instanceDesignation',
      'currentAppIcon',
      'isCurrentAppLocked',
    ]),

    appIcon() {
      if (!this.currentAppIcon) {
        return {
          backgroundImage: `url('${defaultAppIcon}')`
        }
      }

      return {
        backgroundImage: `url('${imageThumbnailUrl(this.currentAppIcon)}')`
      };
    },

  },

  methods: {
    displayAppResourceUsageInfo() {
      if (this.appResourceUsages) {
        return;
      }

      return appApi.fetchAppResourceUsages(this.currentAppId).then(response => {
        this.appResourceUsages = response.data;
      });
    },

    editApp() {
      this.$router.push({
        name: 'app-edit-home',
        params: {appId: this.currentAppId}
      });
    }
  }
}
</script>


<style lang="scss" module>
.wrapper {
  display: flex;
  justify-content: space-between;
  height: $consoleTopBarHeight;
  box-shadow: $primaryShadow;
  align-items: center;
  background-color: $whiteBackgroundColor;
  padding: 0 16px;
  position: relative;
}

.appName {
  color: $primaryTextColor;
  font-size: 18px;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.appIconContainer {
  background-position: center center;
  background-size: cover;
  width: 30px;
  height: 30px;
  margin-right: 10px;
}

.appUsageTitle {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
  color: $primaryTextColor;
}

.row {
  width: 250px;
  display: flex;
  height: 32px;
  align-items: center;
  font-size: 13px;
}

.rowTitle {
  flex-shrink: 0;
  margin-right: 10px;
}

.rowValue {
  color: $primaryTextColor;
}

.warningText {
  color: $warningYellow;
}

.rightSection {
  display: flex;
  align-items: center;
}

.rightSectionIcon {
  margin-right: 30px;
}

</style>

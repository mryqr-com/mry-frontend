<template>
  <div :class="$style.wrapper">
    <div :class="$style.leftBar">
    <span :class="$style.appIconContainer"
          :style="appIcon">
    </span>

      <el-breadcrumb separator="/">
        <el-breadcrumb-item :class="$style.breadcrumbText" :to="{name:'qr-list',params: { appId: currentAppId }}">
          {{ currentAppName }}
        </el-breadcrumb-item>

        <el-breadcrumb-item :class="$style.breadcrumbText">
          {{ groupName }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <Profile></Profile>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import Profile from '@/console/common/Profile';
import defaultAppIcon from "@/common/static/app.svg";
import {imageThumbnailUrl} from "@/common/utils/image-utils";

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: ['groupId'],

  components: {
    Profile
  },

  computed: {
    ...appOperationStore.mapGetters([
      'currentAppId',
      'currentAppName',
      'groupNameOf',
      'currentAppIcon',
    ]),

    groupName() {
      return this.groupNameOf(this.groupId);
    },

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
}

.leftBar {
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

.breadcrumbText {
  font-size: 16px;
}

</style>

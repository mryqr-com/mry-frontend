<template>
  <div :class="$style.wrapper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :class="$style.breadcrumbText" :to="{name:'qr-list',params: { appId: currentAppId }}">
        {{ currentAppName }}
      </el-breadcrumb-item>

      <el-breadcrumb-item :class="$style.breadcrumbText"
                          :to="{name:'group-operation-qr-list',params: { appId: currentAppId,groupId:groupId }}">
        {{ groupName }}
      </el-breadcrumb-item>

      <el-breadcrumb-item :class="$style.breadcrumbText">
        {{ qrName }} <i v-if="template" :class="$style.templateIcon" class="el-icon-film" title="模板"></i>
      </el-breadcrumb-item>

    </el-breadcrumb>
    <Profile></Profile>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import Profile from '@/console/common/Profile';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: ['groupId', 'qrName', 'template'],

  components: {
    Profile
  },

  computed: {
    ...appOperationStore.mapGetters([
      'currentAppId',
      'currentAppName',
      'groupNameOf',
    ]),

    groupName() {
      return this.groupNameOf(this.groupId);
    }
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

.breadcrumbText {
  font-size: 16px;
}

.templateIcon {
  color: $oppositeThemeColor;
}

</style>

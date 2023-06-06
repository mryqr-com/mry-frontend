<template>
  <div :class="$style.wrapper" :style="wrapperStyle">
    <Logo :iconFile="tenantLogo" :name="tenantName" size="small"></Logo>
    <img :class="$style.userIcon" :src="userIconSrc" alt="profileIcon"/>
  </div>
</template>

<script>
import {createNamespacedHelpers, mapGetters} from 'vuex';
import {borderStyles, shadowStyles} from '@/common/utils/common-utils';
import userIcon from "@/console/app-edit/icon/user.svg";

const appEditStore = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  computed: {
    ...mapGetters(['tenantName', 'tenantLogo']),
    ...appEditStore.mapGetters([
      'appTopBar',
    ]),

    userIconSrc() {
      return userIcon;
    },

    wrapperStyle() {
      return {
        ...{
          height: this.appTopBar.height + 'px',
          color: this.appTopBar.textColor,
          backgroundColor: this.appTopBar.backgroundColor,
          paddingLeft: this.appTopBar.hPadding + 'px',
          paddingRight: this.appTopBar.hPadding + 'px',
        },
        ...borderStyles(this.appTopBar.border),
        ...shadowStyles(this.appTopBar.shadow)
      }
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.userIcon {
  width: 16px;
}

</style>

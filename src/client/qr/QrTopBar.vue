<template>
  <div id="qrTopBar" :class="$style.wrapper" :style="topBarStyle">
    <Logo :class="$style.theLogo"
          :iconFile="tenantLogo"
          :name="tenantName"
          :style="logoStyle"
          size="small"
          @click="onLogoClick">
    </Logo>

    <ClientTopBarProfile :avatar="memberAvatar"
                         :isLoggedIn="isLoggedIn"
                         :memberName="memberName">
    </ClientTopBarProfile>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import ClientTopBarProfile from '@/client/common/components/ClientTopBarProfile';
import {borderStyles, goToMryOfficialWebsite, shadowStyles} from "@/common/utils/common-utils";

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  components: {
    ClientTopBarProfile
  },

  computed: {
    ...clientQrStore.mapGetters([
      'memberName',
      'memberAvatar',
      'isLoggedIn',
      'tenantName',
      'tenantLogo',
      'appTopBar'
    ]),

    logoStyle() {
      if (!this.tenantLogo) {
        return {
          cursor: 'pointer',
        }
      }
    },

    topBarStyle() {
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
    },
  },

  methods: {
    onLogoClick() {
      if (!this.tenantLogo) {
        goToMryOfficialWebsite();
      }
    }
  },
}
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  z-index: $clientPageZIndex + 2;
  width: 100vw;
}

.theLogo {
  cursor: default;
}
</style>

<template>
  <div v-if="loaded" :class="$style.wrapper">
    <MryOfficialSiteTopBar :class="$style.topBar"></MryOfficialSiteTopBar>
    <router-view :class="$style.content"></router-view>
  </div>
</template>

<script>
import {mapActions} from 'vuex';
import ACTIONS from '@/console/console-root-action';
import MryOfficialSiteTopBar from '@/console/common/components/MryOfficialSiteTopBar';
import mryLogo from "@/common/static/mry.svg";
import {changeFavIcon, isSubdomainCustomized, replaceCurrentUrlWithSubdomain} from "@/common/utils/common-utils";

export default {
  components: {
    MryOfficialSiteTopBar,
  },

  data() {
    return {
      loaded: false,
    }
  },

  created() {
    document.title = '码如云 - 二维码场景应用解决方案';

    if (isSubdomainCustomized()) {
      location.replace(replaceCurrentUrlWithSubdomain('console'));
      return;
    }

    changeFavIcon(mryLogo);
    this[ACTIONS.FETCH_MY_PROFILE]().finally(() => {
      this.loaded = true;
    }).catch(() => {
      console.info("Not logged in.")
    });
  },

  methods: {
    ...mapActions([
      ACTIONS.FETCH_MY_PROFILE,
    ]),
  },
}
</script>

<style lang="scss" module>
.wrapper {
  height: 100%;
  overflow: auto;
  background-color: $lightBackgroundColor;
}

.content {
  margin-top: $consoleTopBarHeight;
}

@media (max-width: $mobileScreenBreakpoint), print {
  .topBar {
    display: none;
  }

  .content {
    margin-top: 0;
  }
}

</style>

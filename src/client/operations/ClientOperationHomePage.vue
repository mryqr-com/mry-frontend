<template>
  <div v-if="profileLoaded" :class="$style.wrapper">
    <router-view :key="clientHomePageRefreshKey"></router-view>
    <MrySupportFooter :class="$style.footer"
                      :shouldHideBottomMryLogo="shouldHideBottomMryLogo">
    </MrySupportFooter>
  </div>
</template>

<script>
import ACTIONS from '@/client/client-root-action';
import MrySupportFooter from '@/client/common/components/MrySupportFooter';

import {mapActions, mapGetters, mapState} from "vuex";
import {changeFavIcon} from "@/common/utils/common-utils";
import {imageThumbnailUrl} from "@/common/utils/image-utils";

export default {
  components: {
    MrySupportFooter,
  },

  data() {
    return {
      profileLoaded: false,
    }
  },

  created() {
    return this[ACTIONS.FETCH_MY_CLIENT_PROFILE]().then(() => {
      this.$nextTick(() => {
        if (this.tenantLogo) {
          changeFavIcon(imageThumbnailUrl(this.tenantLogo));
        }
        document.title = this.tenantName;
      });
      this.profileLoaded = true;
    });
  },

  computed: {
    ...mapState(['clientHomePageRefreshKey']),
    ...mapGetters([
      'tenantLogo',
      'tenantName',
      'shouldHideBottomMryLogo',
    ]),
  },

  methods: {
    ...mapActions([
      ACTIONS.FETCH_MY_CLIENT_PROFILE,
    ]),
  },
};

</script>

<style lang="scss" module>
.wrapper {
  height: 100%;
  background-color: $primaryBackgroundColor;
}

.footer {
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translatex(-50%);
  margin: 0 auto;
  height: 50px;
  z-index: $clientPageZIndex - 1;
}

</style>

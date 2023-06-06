<template>
  <div :class="$style.wrapper">
    <el-button :disabled="!canOpen"
               size="medium"
               type="text"
               @click="openQrPage">
      打开
    </el-button>

    <el-button v-if="canViewGeolocation"
               size="medium"
               type="text"
               @click="viewGeolocation">
      查看定位
    </el-button>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import {viewGeoLocation} from "@/common/utils/geolocation-utils";

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: ['qr', 'canOpen'],

  computed: {
    ...appOperationStore.mapGetters(['currentAppGeolocationEnabled']),

    canViewGeolocation() {
      return this.currentAppGeolocationEnabled && this.qr.geolocation;
    },
  },

  methods: {
    openQrPage() {
      this.$emit('openQrPage', this.qr);
    },

    viewGeolocation() {
      viewGeoLocation({
        name: this.qr.name,
        geolocation: this.qr.geolocation
      });
    },
  },
}
</script>


<style lang="scss" module>
.wrapper {
  display: flex;
  align-items: center;
}

</style>

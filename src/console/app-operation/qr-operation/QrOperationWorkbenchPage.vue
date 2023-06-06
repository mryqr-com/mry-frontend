<template>
  <div :class="$style.wrapper">
    <iframe :class="$style.theIframe" :src="currentQrSrc" allow="geolocation"></iframe>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  created() {
    document.title = `${this.currentQrName} - ${this.currentAppName}`;
  },

  computed: {
    ...appOperationStore.mapGetters([
      'allableApprovablePages',
      'currentAppName',
    ]),

    ...appOperationStore.mapState(['currentQrSrc', 'currentQrName']),
  }
}
</script>


<style lang="scss" module>
.wrapper {
  border-top: $primary1pxBorder;
  width: 100%;
  height: calc(100vh - 60px);
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='150px' width='80px'><text x='0' y='15' fill='gray'>正在加载...</text>正在加载...</svg>") center center no-repeat;
}

.theIframe {
  width: 100%;
  height: 100%;
}
</style>

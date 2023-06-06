<template>
  <router-view v-if="appLoaded" :key="$route.path + clientAppOperationPageRefreshKey"></router-view>
</template>

<script>
import appApi from '@/common/api/app-api';

import {createNamespacedHelpers, mapState} from "vuex";
import ACTIONS from "@/client/operations/app/store/client-app-operation-actions";

const clientAppOperationStore = createNamespacedHelpers('CLIENT_APP_OPERATION_STORE');

export default {
  props: ['appId'],

  data() {
    return {
      appLoaded: false
    }
  },

  created() {
    return this[ACTIONS.FETCH_OPERATION_APP](this.appId).then(() => {
      this.appLoaded = true;
      document.title = this.appName;

      if (this.$route.name === 'app-ops') {
        if (this.appLandingPageType === 'GROUP_LIST') {
          this.$router.replace({name: 'app-groups'});
          return;
        }

        if (this.appLandingPageType === 'QR_LIST') {
          this.$router.replace({name: 'app-qrs'});
          return;
        }

        if (this.appLandingPageType === 'FIRST_QR') {
          return appApi.fetchAppFirstQr(this.appId).then(response => {
            if (response.data) {
              this.$router.replace({name: 'qr-home', params: {plateId: response.data.plateId}});
            } else {
              this.$router.replace({name: 'app-home'});
            }
          });
        }

        this.$router.replace({name: 'app-home'});
      }
    });
  },

  computed: {
    ...mapState(['clientAppOperationPageRefreshKey']),
    ...clientAppOperationStore.mapGetters([
      'appName',
      'appLandingPageType'
    ]),
  },

  methods: {
    ...clientAppOperationStore.mapActions([
      ACTIONS.FETCH_OPERATION_APP,
    ]),
  },
};
</script>

<style lang="scss" module>
</style>

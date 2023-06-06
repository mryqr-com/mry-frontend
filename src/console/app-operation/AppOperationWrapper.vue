<template>
  <router-view v-if="appLoaded" :key="appOperationPageRefreshKey"></router-view>
</template>

<script>
import {createNamespacedHelpers, mapState} from 'vuex';
import ACTIONS from '@/console/app-operation/store/app-operation-actions';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

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
    });
  },

  computed: {
    ...mapState(['appOperationPageRefreshKey']),
  },

  methods: {
    ...appOperationStore.mapActions([
      ACTIONS.FETCH_OPERATION_APP,
    ]),
  },

}
</script>


<style lang="scss" module>

</style>

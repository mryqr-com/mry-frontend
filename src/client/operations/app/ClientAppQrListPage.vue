<template>
  <ClientQrList :selectableGroups="allableViewableGroups"
                groupId="ALL"
                upperLinkName="app-home">
  </ClientQrList>
</template>

<script>
import ClientQrList from '@/client/operations/app/qrs/ClientQrList';
import {createNamespacedHelpers} from "vuex";

const clientAppOperationStore = createNamespacedHelpers('CLIENT_APP_OPERATION_STORE');

export default {
  components: {
    ClientQrList
  },

  created() {
    document.title = `${this.instanceDesignation}列表`
  },

  computed: {
    ...clientAppOperationStore.mapGetters([
      'allableViewableGroups',
      'instanceDesignation',
    ])
  }
};
</script>

<style lang="scss" module>

</style>

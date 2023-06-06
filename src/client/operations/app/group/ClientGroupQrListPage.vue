<template>
  <ClientQrList :groupId="groupId"
                :selectableGroups="[]"
                upperLinkName="client-group-operation-home">
  </ClientQrList>
</template>

<script>
import ClientQrList from '@/client/operations/app/qrs/ClientQrList';
import {createNamespacedHelpers} from "vuex";

const clientAppOperationStore = createNamespacedHelpers('CLIENT_APP_OPERATION_STORE');

export default {
  props: {
    groupId: {
      type: String,
      required: true
    },
  },

  components: {
    ClientQrList
  },

  created() {
    document.title = `${this.instanceDesignation}列表`
  },

  computed: {
    ...clientAppOperationStore.mapGetters([
      'instanceDesignation',
    ])
  }
};
</script>

<style lang="scss" module>

</style>

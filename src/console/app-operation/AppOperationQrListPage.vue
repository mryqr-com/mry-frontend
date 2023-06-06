<template>
  <QrList :selectableGroups="allableViewableGroups" groupId="ALL"></QrList>
</template>

<script>
import QrList from '@/console/app-operation/qrs/QrList';
import {createNamespacedHelpers} from "vuex";

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  components: {QrList},

  created() {
    document.title = `${this.instanceDesignation}列表 - ${this.currentAppName}`;
  },

  computed: {
    ...appOperationStore.mapGetters([
      'allableViewableGroups',
      'currentAppName',
      'instanceDesignation',
    ]),
  }
}
</script>


<style lang="scss" module>

</style>

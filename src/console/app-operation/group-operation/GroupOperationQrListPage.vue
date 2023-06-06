<template>
  <QrList :groupId="groupId" :selectableGroups="[]"></QrList>
</template>

<script>
import QrList from '@/console/app-operation/qrs/QrList';
import {createNamespacedHelpers} from "vuex";

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: {
    groupId: {
      type: String,
      required: true
    },
  },

  components: {QrList},

  created() {
    document.title = `${this.instanceDesignation}列表 - ${this.groupNameOf(this.groupId)}`;
  },

  computed: {
    ...appOperationStore.mapGetters([
      'groupNameOf',
      'instanceDesignation',
    ]),
  },
}
</script>


<style lang="scss" module>

</style>

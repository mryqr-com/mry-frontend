<template>
  <div :class="$style.wrapper">
    <ReportingList :groupId="groupId"></ReportingList>
  </div>
</template>

<script>
import ReportingList from '@/console/app-operation/report/ReportingList';
import {createNamespacedHelpers} from "vuex";

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: {
    groupId: {
      type: String,
      required: true
    },
  },

  components: {
    ReportingList,
  },

  created() {
    document.title = `统计报表 - ${this.groupNameOf(this.groupId)}`;
  },

  computed: {
    ...appOperationStore.mapGetters([
      'groupNameOf',
    ]),
  },
}
</script>

<style lang="scss" module>
.wrapper {
}

</style>

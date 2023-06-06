<template>
  <div :class="$style.wrapper">
    <AssignmentQrList :assignmentId="assignmentId"
                      title="任务列表"
                      titleLinkName="assignment-list">
    </AssignmentQrList>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import AssignmentQrList from '@/console/app-operation/assignment/qrs/AssignmentQrList';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: {
    assignmentId: {
      type: String,
      required: true,
    }
  },

  components: {
    AssignmentQrList,
  },

  created() {
    document.title = `任务列表 - ${this.currentAppName}`;
  },

  computed: {
    ...appOperationStore.mapGetters([
      'currentAppName',
    ]),
  },
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>

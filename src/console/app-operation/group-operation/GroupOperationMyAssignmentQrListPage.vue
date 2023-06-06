<template>
  <div :class="$style.wrapper">
    <AssignmentQrList :assignmentId="assignmentId"
                      title="我的任务"
                      titleLinkName="group-my-assignment-list">
    </AssignmentQrList>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import AssignmentQrList from '@/console/app-operation/assignment/qrs/AssignmentQrList';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: {
    groupId: {
      type: String,
    },

    assignmentId: {
      type: String,
      required: true,
    }
  },

  components: {
    AssignmentQrList,
  },

  created() {
    document.title = `我的任务 - ${this.groupNameOf(this.groupId)}`;
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

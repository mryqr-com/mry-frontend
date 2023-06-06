<template>
  <div :class="$style.wrapper">
    <AssignmentList :initAssignmentPlanId="initAssignmentPlanId"
                    groupId="ALL">
    </AssignmentList>
  </div>
</template>

<script>
import AssignmentList from '@/console/app-operation/assignment/assignments/AssignmentList';
import {createNamespacedHelpers} from "vuex";

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: {
    initAssignmentPlanId: {
      type: String,
    },
  },

  components: {
    AssignmentList,
  },

  created() {
    document.title = `任务列表 - ${this.currentAppName}`;
  },

  computed: {
    ...appOperationStore.mapGetters([
      'currentAppName',
    ]),
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

</style>

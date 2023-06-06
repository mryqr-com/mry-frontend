<template>
  <div :class="$style.wrapper">
    <AssignmentList :groupId="groupId"
                    :initAssignmentPlanId="initAssignmentPlanId">
    </AssignmentList>
  </div>
</template>

<script>
import AssignmentList from '@/console/app-operation/assignment/assignments/AssignmentList';
import {createNamespacedHelpers} from "vuex";

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: {
    groupId: {
      type: String,
      required: true
    },

    initAssignmentPlanId: {
      type: String,
    },
  },

  components: {
    AssignmentList,
  },

  created() {
    document.title = `任务列表 - ${this.groupNameOf(this.groupId)}`;
  },

  computed: {
    ...appOperationStore.mapGetters([
      'groupNameOf',
    ]),
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

</style>

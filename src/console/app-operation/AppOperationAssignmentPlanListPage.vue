<template>
  <div :class="$style.wrapper">
    <AssignmentPlanList @nameClicked="onNameClicked"></AssignmentPlanList>
  </div>
</template>

<script>
import AssignmentPlanList from '@/console/app-operation/assignment/plans/AssignmentPlanList';
import {createNamespacedHelpers} from "vuex";

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  components: {
    AssignmentPlanList,
  },

  created() {
    document.title = `任务设置 - ${this.currentAppName}`;
  },

  computed: {
    ...appOperationStore.mapGetters([
      'currentAppName',
    ]),
  },

  methods: {
    onNameClicked(assignmentPlanId) {
      this.$router.push({name: 'assignment-list', params: {initAssignmentPlanId: assignmentPlanId}});
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>

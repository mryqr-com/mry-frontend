<template>
  <div :class="$style.wrapper">
    <AssignmentPlanList :groupId="groupId" @nameClicked="onNameClicked"></AssignmentPlanList>
  </div>
</template>

<script>
import AssignmentPlanList from '@/console/app-operation/assignment/plans/AssignmentPlanList';
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
    AssignmentPlanList,
  },

  created() {
    document.title = `任务设置 - ${this.groupNameOf(this.groupId)}`;
  },

  computed: {
    ...appOperationStore.mapGetters([
      'groupNameOf',
    ]),
  },

  methods: {
    onNameClicked(assignmentPlanId) {
      this.$router.push({name: 'group-assignment-list', params: {initAssignmentPlanId: assignmentPlanId}});
    }
  },
}
</script>

<style lang="scss" module>
.wrapper {
}

</style>

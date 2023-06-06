<template>
  <el-select v-model="theAssignmentPlan"
             :class="$style.wrapper"
             size="medium"
             @change="onAssignmentPlanChanged">
    <el-option
        v-for="plan in assignmentPlans"
        :key="plan.id"
        :label="plan.name"
        :value="plan.id">
    </el-option>
  </el-select>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import ASSIGNMENT_LIST_ACTIONS from "@/console/app-operation/assignment/assignments/store/assignment-list-actions";

const assignmentListStore = createNamespacedHelpers('ASSIGNMENT_LIST_STORE');

export default {
  props: {
    assignmentPlans: {
      type: Array,
      required: true
    }
  },

  methods: {
    ...assignmentListStore.mapActions([
      ASSIGNMENT_LIST_ACTIONS.LIST_ASSIGNMENTS
    ]),

    ...assignmentListStore.mapMutations([
      'updateAssignmentPlanId',
      'resetPageIndex',
      'goToTableTop',
    ]),

    onAssignmentPlanChanged() {
      this.resetPageIndex();
      return this[ASSIGNMENT_LIST_ACTIONS.LIST_ASSIGNMENTS]().then(() => {
        this.goToTableTop();
      });
    }
  },

  computed: {
    ...assignmentListStore.mapState(['assignmentPlanId']),

    theAssignmentPlan: {
      get() {
        return this.assignmentPlanId;
      },

      set(value) {
        return this.updateAssignmentPlanId(value);
      }
    }
  }
}
</script>


<style lang="scss" module>
.wrapper {
}

</style>

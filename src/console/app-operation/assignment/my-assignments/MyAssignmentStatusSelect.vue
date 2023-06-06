<template>
  <el-select v-model="theStatus"
             :class="$style.wrapper"
             size="medium"
             @change="onStatusChanged">
    <el-option v-for="status in allStatuses"
               :key="status.key"
               :label="status.name"
               :value="status.key">
    </el-option>
  </el-select>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import MY_ASSIGNMENT_LIST_ACTIONS
  from "@/console/app-operation/assignment/my-assignments/store/my-assignment-list-actions";
import assignmentStatuses from '@/common/utils/assignment-statuses';

const myAssignmentListStore = createNamespacedHelpers('MY_ASSIGNMENT_LIST_STORE');

export default {
  methods: {
    ...myAssignmentListStore.mapActions([
      MY_ASSIGNMENT_LIST_ACTIONS.LIST_MY_ASSIGNMENTS
    ]),

    ...myAssignmentListStore.mapMutations([
      'updateStatus',
      'resetPageIndex',
      'goToTableTop',
    ]),

    onStatusChanged() {
      this.resetPageIndex();
      return this[MY_ASSIGNMENT_LIST_ACTIONS.LIST_MY_ASSIGNMENTS]().then(() => {
        this.goToTableTop();
      });
    }
  },

  computed: {
    ...myAssignmentListStore.mapState(['status']),

    allStatuses() {
      return [...[{key: 'ALL', name: '全部'}], ...assignmentStatuses];
    },

    theStatus: {
      get() {
        return this.status;
      },

      set(value) {
        return this.updateStatus(value);
      }
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

</style>

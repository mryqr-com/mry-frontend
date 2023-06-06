<template>
  <el-select v-model="theStatus"
             :class="$style.wrapper"
             size="medium"
             @change="onStatusChanged">
    <el-option
        v-for="status in allStatuses"
        :key="status.key"
        :label="status.name"
        :value="status.key">
    </el-option>
  </el-select>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import ASSIGNMENT_LIST_ACTIONS from "@/console/app-operation/assignment/assignments/store/assignment-list-actions";
import assignmentStatuses from '@/common/utils/assignment-statuses';

const assignmentListStore = createNamespacedHelpers('ASSIGNMENT_LIST_STORE');

export default {
  methods: {
    ...assignmentListStore.mapActions([
      ASSIGNMENT_LIST_ACTIONS.LIST_ASSIGNMENTS
    ]),

    ...assignmentListStore.mapMutations([
      'updateStatus',
      'resetPageIndex',
      'goToTableTop',
    ]),

    onStatusChanged() {
      this.resetPageIndex();
      return this[ASSIGNMENT_LIST_ACTIONS.LIST_ASSIGNMENTS]().then(() => {
        this.goToTableTop();
      });
    }
  },

  computed: {
    ...assignmentListStore.mapState(['status']),

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

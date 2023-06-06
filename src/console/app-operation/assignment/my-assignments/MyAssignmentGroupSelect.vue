<template>
  <el-select v-model="theGroup"
             :class="$style.wrapper"
             filterable
             size="medium"
             @change="onGroupChanged">
    <el-option v-for="group in allableViewableGroups"
               :key="group.id"
               :label="group.name"
               :value="group.id">
    </el-option>
  </el-select>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import MY_ASSIGNMENT_LIST_ACTIONS
  from "@/console/app-operation/assignment/my-assignments/store/my-assignment-list-actions";

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');
const myAssignmentListStore = createNamespacedHelpers('MY_ASSIGNMENT_LIST_STORE');

export default {
  methods: {
    ...myAssignmentListStore.mapActions([
      MY_ASSIGNMENT_LIST_ACTIONS.LIST_MY_ASSIGNMENTS
    ]),

    ...myAssignmentListStore.mapMutations([
      'updateGroupId',
      'resetPageIndex',
      'goToTableTop',
    ]),

    onGroupChanged() {
      this.resetPageIndex();
      return this[MY_ASSIGNMENT_LIST_ACTIONS.LIST_MY_ASSIGNMENTS]().then(() => {
        this.goToTableTop();
      });
    }
  },

  computed: {
    ...appOperationStore.mapGetters(['allableViewableGroups']),
    ...myAssignmentListStore.mapState(['groupId']),

    theGroup: {
      get() {
        return this.groupId;
      },

      set(value) {
        return this.updateGroupId(value);
      }
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

</style>

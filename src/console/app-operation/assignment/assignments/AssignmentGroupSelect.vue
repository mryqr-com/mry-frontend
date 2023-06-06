<template>
  <el-select v-model="theGroup"
             :class="$style.wrapper"
             filterable
             size="medium"
             @change="onGroupChanged">
    <el-option
        v-for="group in groups"
        :key="group.id"
        :label="group.name"
        :value="group.id">
    </el-option>
  </el-select>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import ASSIGNMENT_LIST_ACTIONS from "@/console/app-operation/assignment/assignments/store/assignment-list-actions";

const assignmentListStore = createNamespacedHelpers('ASSIGNMENT_LIST_STORE');

export default {
  props: {
    groups: {
      type: Array,
      required: true
    }
  },

  methods: {
    ...assignmentListStore.mapActions([
      ASSIGNMENT_LIST_ACTIONS.LIST_ASSIGNMENTS
    ]),

    ...assignmentListStore.mapMutations([
      'updateGroupId',
      'resetPageIndex',
      'goToTableTop',
    ]),

    onGroupChanged() {
      this.resetPageIndex();
      return this[ASSIGNMENT_LIST_ACTIONS.LIST_ASSIGNMENTS]().then(() => {
        this.goToTableTop();
      });
    }
  },

  computed: {
    ...assignmentListStore.mapState(['groupId']),

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

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
import SUBMISSION_LIST_ACTIONS from "@/console/app-operation/submissions/store/submission-list-actions";

const submissionListStore = createNamespacedHelpers('SUBMISSION_LIST_STORE');

export default {
  props: {
    groups: {
      type: Array,
      required: true
    }
  },

  methods: {
    ...submissionListStore.mapActions([
      SUBMISSION_LIST_ACTIONS.LIST_SUBMISSIONS
    ]),

    ...submissionListStore.mapMutations([
      'updateGroupId',
      'resetPageIndex',
      'goToTableTop',
      'resetFilterables',
      'resetSorting',
    ]),

    onGroupChanged() {
      this.resetPageIndex();
      // this.resetFilterables();
      // this.resetSorting();
      return this[SUBMISSION_LIST_ACTIONS.LIST_SUBMISSIONS]().then(() => {
        this.goToTableTop();
      });
    }
  },

  computed: {
    ...submissionListStore.mapState(['groupId']),

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

<template>
  <el-select v-model="theOperator"
             :class="$style.wrapper"
             filterable
             size="medium"
             @change="onOperatorChanged"
             @focus="onFocus">
    <el-option v-for="member in allMembers"
               :key="member.id"
               :label="member.showName"
               :value="member.id">
    </el-option>
  </el-select>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import ASSIGNMENT_LIST_ACTIONS from "@/console/app-operation/assignment/assignments/store/assignment-list-actions";
import memberApi from "@/common/api/member-api";

const assignmentListStore = createNamespacedHelpers('ASSIGNMENT_LIST_STORE');

export default {
  data() {
    return {
      allMembers: [{id: 'ALL', name: '全部', showName: '全部'}],
    }
  },

  methods: {
    ...assignmentListStore.mapActions([
      ASSIGNMENT_LIST_ACTIONS.LIST_ASSIGNMENTS
    ]),

    ...assignmentListStore.mapMutations([
      'updateOperatorId',
      'resetPageIndex',
      'goToTableTop',
    ]),

    onFocus() {
      if (this.allMembers.length > 1) {
        return;
      }

      return memberApi.listMemberReferences().then((members) => {
        this.allMembers = [{id: 'ALL', name: '全部', showName: '全部'}, ...members];
      });
    },

    onOperatorChanged() {
      this.resetPageIndex();
      return this[ASSIGNMENT_LIST_ACTIONS.LIST_ASSIGNMENTS]().then(() => {
        this.goToTableTop();
      });
    }
  },

  computed: {
    ...assignmentListStore.mapState(['operatorId']),

    theOperator: {
      get() {
        return this.operatorId;
      },

      set(value) {
        return this.updateOperatorId(value);
      }
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

</style>

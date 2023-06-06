<template>
  <el-select v-model="theCreatedBy"
             :class="$style.wrapper"
             filterable
             size="medium"
             @change="onSubmitterChanged"
             @focus="onFocus">
    <el-option
        v-for="member in allMembers"
        :key="member.id"
        :label="member.showName"
        :value="member.id">
      <span style="float: left">{{ member.showName }}</span>
    </el-option>
  </el-select>
</template>

<script>
import memberApi from '@/common/api/member-api';
import {createNamespacedHelpers} from 'vuex';
import SUBMISSION_LIST_ACTIONS from "@/console/app-operation/submissions/store/submission-list-actions";

const submissionListStore = createNamespacedHelpers('SUBMISSION_LIST_STORE');

export default {
  data() {
    return {
      allMembers: []
    }
  },

  created() {
    this.allMembers = [{id: 'ALL', name: '全部', showName: '全部'}];
  },

  methods: {
    ...submissionListStore.mapActions([
      SUBMISSION_LIST_ACTIONS.LIST_SUBMISSIONS
    ]),

    ...submissionListStore.mapMutations([
      'updateCreatedBy',
      'resetPageIndex',
      'goToTableTop',
      'resetFilterables',
      'resetSorting',
    ]),

    onFocus() {
      if (this.allMembers.length > 1) {
        return;
      }

      return memberApi.listMemberReferences().then((members) => {
        this.allMembers = [{id: 'ALL', name: '全部', showName: '全部'}, ...members];
      });
    },

    onSubmitterChanged() {
      this.resetPageIndex();
      // this.resetFilterables();//切换提交者时，不reset，这样用户体验一致一些
      // this.resetSorting();
      return this[SUBMISSION_LIST_ACTIONS.LIST_SUBMISSIONS]().then(() => {
        this.goToTableTop();
      });
    }
  },

  computed: {
    ...submissionListStore.mapState(['createdBy']),

    theCreatedBy: {
      get() {
        return this.createdBy;
      },

      set(value) {
        return this.updateCreatedBy(value);
      }
    }
  }
}
</script>


<style lang="scss" module>
.wrapper {
}

</style>

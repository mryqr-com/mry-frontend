<template>
  <el-select v-model="thePageId"
             :class="$style.wrapper"
             filterable
             size="medium"
             @change="onPageChanged">
    <el-option
        v-for="page in pages"
        :key="page.id"
        :label="page.name"
        :value="page.id">
    </el-option>
  </el-select>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import SUBMISSION_LIST_ACTIONS from "@/console/app-operation/submissions/store/submission-list-actions";

const submissionListStore = createNamespacedHelpers('SUBMISSION_LIST_STORE');

export default {
  props: {
    pages: {
      type: Array,
      required: true
    },
  },

  methods: {
    ...submissionListStore.mapActions([
      SUBMISSION_LIST_ACTIONS.LIST_SUBMISSIONS
    ]),

    ...submissionListStore.mapMutations([
      'updatePageId',
      'resetPageIndex',
      'goToTableTop',
      'resetFilterables',
      'resetSorting',
      'refreshTable',
    ]),

    onPageChanged() {
      this.resetPageIndex();
      this.resetFilterables();//由于不同页面的filter和sort字段不同，因此切换页面时需要重置此二者
      this.resetSorting();
      this.refreshTable();//切换页面时可能导致表格错乱，需要refresh一下
      return this[SUBMISSION_LIST_ACTIONS.LIST_SUBMISSIONS]().then(() => {
        this.goToTableTop();
      });
    }
  },

  computed: {
    ...submissionListStore.mapState(['pageId']),

    thePageId: {
      get() {
        return this.pageId;
      },

      set(value) {
        return this.updatePageId(value);
      }
    }
  }
}
</script>


<style lang="scss" module>
.wrapper {
}

</style>

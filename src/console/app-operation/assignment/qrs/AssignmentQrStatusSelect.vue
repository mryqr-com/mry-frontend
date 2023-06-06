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
import ASSIGNMENT_QR_LIST_ACTIONS from "@/console/app-operation/assignment/qrs/store/assignment-qr-list-actions";

const assignmentQrListStore = createNamespacedHelpers('ASSIGNMENT_QR_LIST_STORE');

export default {
  methods: {
    ...assignmentQrListStore.mapActions([
      ASSIGNMENT_QR_LIST_ACTIONS.LIST_ASSIGNMENT_QRS
    ]),

    ...assignmentQrListStore.mapMutations([
      'updateStatus',
      'resetPageIndex',
      'goToTableTop',
    ]),

    onStatusChanged() {
      this.resetPageIndex();
      return this[ASSIGNMENT_QR_LIST_ACTIONS.LIST_ASSIGNMENT_QRS]().then(() => {
        this.goToTableTop();
      });
    },
  },

  computed: {
    ...assignmentQrListStore.mapState(['status']),

    allStatuses() {
      return [
        {key: 'ALL', name: '全部'},
        {key: 'FINISHED', name: '已完成'},
        {key: 'UNFINISHED', name: '未完成'}
      ];
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

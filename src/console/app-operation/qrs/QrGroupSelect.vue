<template>
  <el-select v-model="theGroup"
             :class="$style.wrapper"
             filterable
             size="medium"
             @change="onGroupChanged">
    <el-option v-for="group in groups"
               :key="group.id"
               :label="group.name"
               :value="group.id">
    </el-option>
  </el-select>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import QR_LIST_ACTIONS from "@/console/app-operation/qrs/store/qr-list-actions";

const qrListStore = createNamespacedHelpers('QR_LIST_STORE');

export default {
  props: {
    groups: {
      type: Array,
      required: true
    }
  },

  methods: {
    ...qrListStore.mapActions([
      QR_LIST_ACTIONS.LIST_MY_VIEWABLE_QRS
    ]),

    ...qrListStore.mapMutations([
      'updateGroupId',
      'resetPageIndex',
      'resetFilterables',
      'resetSorting',
      'resetBatchSelectedQrs',
      'goToTableTop',
    ]),

    onGroupChanged() {
      this.resetPageIndex();
      // this.resetSorting();
      // this.resetFilterables();
      this.resetBatchSelectedQrs();
      return this[QR_LIST_ACTIONS.LIST_MY_VIEWABLE_QRS]().then(() => {
        this.goToTableTop();
      });
    },
  },

  computed: {
    ...qrListStore.mapState(['groupId']),

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

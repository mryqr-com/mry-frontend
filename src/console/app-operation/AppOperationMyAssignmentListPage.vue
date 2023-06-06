<template>
  <div :class="$style.wrapper">
    <MyAssignmentList groupId="ALL"></MyAssignmentList>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import MyAssignmentList from '@/console/app-operation/assignment/my-assignments/MyAssignmentList';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  components: {
    MyAssignmentList,
  },

  created() {
    document.title = `我的任务 - ${this.currentAppName}`;
  },

  computed: {
    ...appOperationStore.mapGetters([
      'currentAppName',
    ]),
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

</style>

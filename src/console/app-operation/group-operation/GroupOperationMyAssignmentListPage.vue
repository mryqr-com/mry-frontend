<template>
  <div :class="$style.wrapper">
    <MyAssignmentList :groupId="groupId"></MyAssignmentList>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import MyAssignmentList from '@/console/app-operation/assignment/my-assignments/MyAssignmentList';

const appOperationStore = createNamespacedHelpers('APP_OPERATION_STORE');

export default {
  props: {
    groupId: {
      type: String,
      required: true
    },
  },

  components: {
    MyAssignmentList,
  },

  created() {
    document.title = `我的任务 - ${this.groupNameOf(this.groupId)}`;
  },

  computed: {
    ...appOperationStore.mapGetters([
      'groupNameOf',
    ]),

  }
}
</script>

<style lang="scss" module>
.wrapper {
}

</style>

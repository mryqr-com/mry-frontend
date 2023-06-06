<template>
  <div :class="$style.wrapper">
    <el-button size="medium"
               type="text"
               @click="requestMyAssignmentQrList">
      详情
    </el-button>
  </div>
</template>

<script>

export default {
  props: ['assignment'],

  methods: {
    requestMyAssignmentQrList() {
      this.$router.push({name: 'my-assignment-qr-list', params: {assignmentId: this.assignment.id}});
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  align-items: center;
}

</style>

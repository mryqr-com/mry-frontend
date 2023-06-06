<template>
  <div :class="$style.wrapper">
    <el-dropdown trigger="click" @command="handleCommand">
      <span :class="$style.dropdownButton">...</span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="viewSubmission">查看</el-dropdown-item>

        <template v-if="canManageQr">
          <el-dropdown-item command="deleteQr">删除</el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import submissionApi from "@/common/api/submission-api";
import {qrUrlWithSubmission} from "@/common/utils/common-utils";

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');
const clientQrSubmissionListStore = createNamespacedHelpers('CLIENT_QR_SUBMISSION_LIST_STORE');

export default {
  props: ['submission'],

  computed: {
    ...clientQrStore.mapGetters([
      'canManageQr',
    ]),
  },

  methods: {
    ...clientQrSubmissionListStore.mapMutations([
      'deleteSubmissionById',
      'setActiveSubmission',
    ]),

    handleCommand(command) {
      return this[command]();
    },

    viewSubmission() {
      this.setActiveSubmission(this.submission.id);
      let url = qrUrlWithSubmission(this.submission.plateId, this.submission.pageId, this.submission.id);
      window.open(url, '_blank');
    },

    deleteQr() {
      return this.$confirm(`确认删除？`, '提示', {
        confirmButtonText: '是的，删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return submissionApi.deleteSubmission(this.submission.id).then(() => {
          this.$message({
            type: 'success',
            message: `成功删除。`,
            center: true,
            duration: 1000,
          });
          this.deleteSubmissionById(this.submission.id);
        })
      });
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.dropdownButton {
  color: $secondaryTextColor;
  font-weight: 600;
  font-size: 20px;
  padding: 0 8px 10px;
  cursor: pointer;
}

.dropdownButton:hover {
  color: $primaryThemeColor;
}
</style>

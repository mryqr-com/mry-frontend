<template>
  <div :class="$style.wrapper">
    <div v-if="submission.creatorName" :class="$style.submitter">
      {{ submitterDesignationOf(submission.pageId) }}：{{ submission.creatorName }}
    </div>
    <div>{{ submitAtDesignationOf(submission.pageId) }}：{{ formatEpochToMinute(submission.createdAt) }}</div>
    <el-button v-if="approvalButtonViewable"
               :class="$style.submitButton"
               size="small"
               type="primary"
               @click="enterApprovalMode">
      审批
    </el-button>
  </div>
</template>

<script>
import {formatEpochToMinute} from '@/common/utils/common-utils';
import {createNamespacedHelpers} from 'vuex';

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  props: ['submission'],

  methods: {
    ...clientQrStore.mapMutations(['setMode']),
    formatEpochToMinute: formatEpochToMinute,
    enterApprovalMode() {
      this.setMode('APPROVAL');
      this.$emit('approvalEntered');
    }
  },

  computed: {
    ...clientQrStore.mapGetters([
      'mode',
      'canApproveCurrentSubmission',
      'isReadOnlyMode',
      'submitterDesignationOf',
      'submitAtDesignationOf',
    ]),

    notApprovedYet() {
      return this.submission && !this.submission.approval;
    },

    approvalButtonViewable() {
      return this.isReadOnlyMode && this.notApprovedYet && this.canApproveCurrentSubmission;
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
  border-top: 3px solid #797979;
  padding-left: 10px;
  padding-right: 10px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: $formPageTopSectionBackgroundColor;
  font-size: 13px;
}

.submitter {
  margin-right: 5px;
}

.submitButton {
  margin-left: 5px;
}

</style>

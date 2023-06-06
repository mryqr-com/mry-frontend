<template>
  <div :class="[$style.wrapper,{[$style.notPassed]:!approval.passed}]">
    <div :class="$style.headerInfo">
      <span>审批结果：
        <span :class="[{[$style.passedText]:approval.passed,[$style.notPassedText]:!approval.passed}]">
        {{ status }}
        </span>
      </span>
      <span>审批人：{{ approval.approverName ? approval.approverName : '无' }}</span>
      <span>时间：{{ formatEpochToMinute(approval.approvedAt) }}</span>
    </div>

    <div :class="$style.approvalTitle">审批意见：</div>
    <el-input :class="$style.approvalNote"
              :maxlength="1000"
              :readonly="true"
              :rows="3"
              :spellcheck="false"
              :value="approval.note"
              type="textarea">
    </el-input>
  </div>
</template>

<script>
import {formatEpochToMinute} from '@/common/utils/common-utils';
import {createNamespacedHelpers} from 'vuex';

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  props: ['approval'],

  methods: {
    formatEpochToMinute
  },

  computed: {
    ...clientQrStore.mapGetters([
      'currentPageApprovalPassedText',
      'currentPageApprovalNotPassedText'
    ]),

    status() {
      return this.approval.passed ? this.currentPageApprovalPassedText : this.currentPageApprovalNotPassedText;
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
  pointer-events: none;
  border-top: 3px solid $passGreen;
  padding: 15px 10px;
  background-color: $formPageTopSectionBackgroundColor;
  font-size: 13px;
}

.notPassed {
  border-top-color: $rejectRed !important;
}

.passedText {
  color: $passGreen !important;
}

.notPassedText {
  color: $rejectRed !important;
}

.headerInfo {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  line-height: 1.5em;
  margin-bottom: 20px;
}

.approvalTitle {
  padding-bottom: 5px;
}

.approvalNote {
  :global {
    textarea {
      background-color: transparent;
    }
  }
}

</style>

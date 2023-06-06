<template>
  <div :class="$style.wrapper">
    <div :class="$style.approvalTitle">审批意见：</div>
    <el-input v-model="note"
              :class="$style.approvalNote"
              :maxlength="1000"
              :rows="5"
              :spellcheck="false"
              placeholder="请填入审批意见"
              type="textarea">
    </el-input>

    <div :class="$style.approvalButtonSection">
      <button :class="[$style.approvalButton,$style.rejectApprovalButton]" @click="submit(false)">
        {{ currentPageApprovalNotPassedText }}
      </button>
      <button :class="[$style.approvalButton,$style.passApprovalButton]" @click="submit(true)">
        {{ currentPageApprovalPassedText }}
      </button>
    </div>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  props: ['submission'],

  data() {
    return {
      note: null,
    }
  },

  methods: {
    submit(pass) {
      this.$emit('submitted', {passed: pass, note: this.note});
    }
  },

  computed: {
    ...clientQrStore.mapGetters([
      'currentPageApprovalPassedText',
      'currentPageApprovalNotPassedText'
    ]),
  }

}
</script>

<style lang="scss" module>
.wrapper {
  border-top: 3px solid #797979;
  padding: 15px 10px;
  background-color: $formPageTopSectionBackgroundColor;
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

.approvalButtonSection {
  text-align: center;
  margin-top: 30px;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.approvalButton {
  margin: 0 10px;
  color: white;
  outline: none;
  text-decoration: none;
  cursor: pointer;
  border: none;
  text-align: center;
  height: 36px;
  line-height: 36px;
  width: 150px;
}

.approvalButton:hover {
  filter: brightness(110%);
}

.rejectApprovalButton {
  background-color: $rejectRed;
}

.passApprovalButton {
  background-color: $passGreen;
}

</style>

<template>
  <ControlWrapper :control="control" :index="index">
    <div :class="[$style.contentWrapper,{[$style.viewOnlyControl]: viewOnly}]">
      <ClientDropdown v-if="allMembers" v-model="theModel"
                      :class="[$style.theDropdown,{[$style.errorBordered]: hasError}]"
                      :filterable="control.filterable"
                      :max="control.minMaxSetting.max"
                      :multiple="control.multiple"
                      :options="allMembers"
                      :placeholder="control.placeholder"
                      :viewOnly="viewOnly"
                      key-field="id"
                      label-field="showName"
                      maxErrorMessage="已达最大可选成员数"
                      value-field="id">
      </ClientDropdown>

      <div v-if="fetchMembersFailed" :class="$style.fetchMembersFailedError">
        无法获取成员列表！
      </div>

      <ErrorMessageTransition>
        <div v-if="hasError">
          <div v-if="control.fillableSetting.errorTips">
            <ErrorMessage>
              {{ control.fillableSetting.errorTips }}
            </ErrorMessage>
          </div>

          <div v-else>
            <ErrorMessage v-if="hasRequiredError">
              请选择成员
            </ErrorMessage>

            <ErrorMessage v-if="hasMinError">
              至少需要选择{{ control.minMaxSetting.min }}名成员
            </ErrorMessage>

            <ErrorMessage v-if="hasMaxError">
              最多只能选择{{ control.minMaxSetting.max }}名成员
            </ErrorMessage>
          </div>
        </div>
      </ErrorMessageTransition>

    </div>
  </ControlWrapper>
</template>

<script>
import {requiredIf} from 'vuelidate/lib/validators'
import memberApi from "@/common/api/member-api";
import {createNamespacedHelpers} from 'vuex';

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  props: ['control', 'index', 'answer', 'viewOnly'],

  data() {
    return {
      allMembers: null,
      fetchMembersFailed: false
    }
  },

  mounted() {
    this.allMembers = null;
    this.fetchMembersFailed = false;
    memberApi.listMemberReferencesForTenant(this.qrTenantId).then((members) => {
      this.allMembers = members;
      if (this.answer.memberIds.length !== 0) {
        this.answer.memberIds = this.answer.memberIds.filter(memberId => {
          return this.allMembers.some(member => {
            return member.id === memberId;
          });
        })
      }
    }).catch((e) => {
      this.fetchMembersFailed = true;
      console.error("Failed to fetch members references.", e);
    });
  },

  computed: {
    ...clientQrStore.mapGetters(['qrTenantId']),

    hasError() {
      return this.$v.answer.memberIds.$dirty && this.$v.answer.memberIds.$invalid;
    },

    hasRequiredError() {
      return this.$v.answer.memberIds.$dirty && !this.$v.answer.memberIds.required;
    },

    hasMinError() {
      return this.$v.answer.memberIds.$dirty && !this.$v.answer.memberIds.minValid;
    },

    hasMaxError() {
      return this.$v.answer.memberIds.$dirty && !this.$v.answer.memberIds.maxValid;
    },

    theModel: {
      get: function () {
        if (this.control.multiple) {
          return this.answer.memberIds;
        } else {
          return this.answer.memberIds[0];
        }
      },

      set: function (val) {
        if (!Array.isArray(val)) {
          this.answer.memberIds = [val];
        } else {
          this.answer.memberIds = val;
        }
      }
    }
  },

  methods: {
    isMinValid(memberIds) {
      if (this.control.multiple) {
        let length = memberIds ? memberIds.length : 0;
        return length >= this.control.minMaxSetting.min;
      }
      return true;
    },

    isMaxValid(memberIds) {
      if (this.control.multiple) {
        let length = memberIds ? memberIds.length : 0;
        return this.control.minMaxSetting.max >= length;
      }
      return true;
    }
  },

  validations() {
    return {
      answer: {
        memberIds: {
          required: requiredIf(() => {
            return this.control.fillableSetting.mandatory;
          }),
          minValid: (memberIds) => this.isMinValid(memberIds),
          maxValid: (memberIds) => this.isMaxValid(memberIds),
        }
      }
    }
  }
}
</script>

<style lang="scss" module>
.contentWrapper {
}

.viewOnlyControl {
  pointer-events: none;
}

.errorBordered {
  :global {
    .el-input__inner, .multiselect__tags, select {
      border: 1px solid red !important;
    }
  }
}

.fetchMembersFailedError {
  color: $oppositeThemeColor;
  text-align: center;
}

@media (min-width: $mobileScreenBreakpoint), print {
  .theDropdown {
    max-width: $maxControlSelectionWidth;
  }
}
</style>

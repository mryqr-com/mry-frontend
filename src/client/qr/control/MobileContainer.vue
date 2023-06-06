<template>
  <ControlWrapper :control="control" :index="index">
    <div :class="[$style.contentWrapper,{[$style.viewOnlyControl]: viewOnly}]">
      <el-input v-model.trim="answer.mobileNumber"
                :class="[$style.theInput,{elementInputErrorBordered: hasError}]"
                :maxlength="11"
                :placeholder="control.placeholder"
                :spellcheck="false"
                prefix-icon="el-icon-mobile-phone"
                type="tel"
                @focus="reset">
      </el-input>

      <ErrorMessageTransition>
        <div v-if="hasError">
          <div v-if="control.fillableSetting.errorTips">
            <ErrorMessage>
              {{ control.fillableSetting.errorTips }}
            </ErrorMessage>
          </div>

          <div v-else>
            <ErrorMessage v-if="hasRequiredError">
              请填入手机号
            </ErrorMessage>
            <ErrorMessage v-if="hasFormatError">
              手机号格式不正确
            </ErrorMessage>
          </div>
        </div>
      </ErrorMessageTransition>
    </div>
  </ControlWrapper>

</template>

<script>
import {requiredIf} from 'vuelidate/lib/validators'

export default {
  props: ['control', 'index', 'answer', 'viewOnly'],

  methods: {
    reset() {
      this.$v.$reset();
    },

    isMobileNumber(input) {
      if (!input) {
        return true;
      }

      return /^1[3456789]\d{9}$/.test(input);
    },
  },

  computed: {
    hasError() {
      return this.$v.answer.mobileNumber.$dirty && this.$v.answer.mobileNumber.$invalid;
    },

    hasRequiredError() {
      return this.$v.answer.mobileNumber.$dirty && !this.$v.answer.mobileNumber.required;
    },

    hasFormatError() {
      return this.$v.answer.mobileNumber.$dirty && !this.$v.answer.mobileNumber.isMobileNumber;
    },

  },

  validations() {
    return {
      answer: {
        mobileNumber: {
          required: requiredIf(() => {
            return this.control.fillableSetting.mandatory;
          }),
          isMobileNumber: (value) => this.isMobileNumber(value),
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

@media (min-width: $mobileScreenBreakpoint), print {
  .theInput {
    max-width: $maxControlInputWidth;
  }
}

</style>

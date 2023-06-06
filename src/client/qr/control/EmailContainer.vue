<template>
  <ControlWrapper :control="control" :index="index">
    <div :class="[$style.contentWrapper,{[$style.viewOnlyControl]: viewOnly}]">
      <el-input v-model.trim="answer.email"
                :class="[$style.theInput,{elementInputErrorBordered: hasError}]"
                :maxlength="50"
                :placeholder="control.placeholder"
                :spellcheck="false"
                prefix-icon="el-icon-message"
                type="email"
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
              请填入邮箱地址
            </ErrorMessage>

            <ErrorMessage v-if="hasFormatError">
              邮箱地址格式不正确
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

    isEmail(input) {
      if (!input) {
        return true;
      }

      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(input).toLowerCase());
    },
  },

  computed: {
    hasError() {
      return this.$v.answer.email.$dirty && this.$v.answer.email.$invalid;
    },

    hasRequiredError() {
      return this.$v.answer.email.$dirty && !this.$v.answer.email.required;
    },

    hasFormatError() {
      return this.$v.answer.email.$dirty && !this.$v.answer.email.isEmail;
    },
  },

  validations() {
    return {
      answer: {
        email: {
          required: requiredIf(() => {
            return this.control.fillableSetting.mandatory;
          }),
          isEmail: (value) => this.isEmail(value),
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

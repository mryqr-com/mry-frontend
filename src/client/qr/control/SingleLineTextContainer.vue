<template>
  <ControlWrapper :control="control" :index="index">
    <div :class="[$style.contentWrapper,{[$style.viewOnlyControl]: viewOnly}]">
      <el-input v-model="answer.content"
                :class="[$style.theInput,{elementInputErrorBordered: hasError}]"
                :maxlength="control.minMaxSetting.max"
                :placeholder="control.placeholder"
                :spellcheck="false">
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
              请填写该项
            </ErrorMessage>

            <ErrorMessage v-if="hasMinError">
              至少需要填写{{ control.minMaxSetting.min }}个字符
            </ErrorMessage>

            <ErrorMessage v-if="hasMaxError">
              最多只能填写{{ control.minMaxSetting.max }}个字符
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

  computed: {
    hasError() {
      return this.$v.answer.content.$dirty && this.$v.answer.content.$invalid;
    },

    hasRequiredError() {
      return this.$v.answer.content.$dirty && !this.$v.answer.content.required;
    },

    hasMinError() {
      return this.$v.answer.content.$dirty && !this.$v.answer.content.minValid;
    },

    hasMaxError() {
      return this.$v.answer.content.$dirty && !this.$v.answer.content.maxValid;
    },
  },

  methods: {
    isMinValid(content) {
      let length = content ? content.length : 0;
      return length >= this.control.minMaxSetting.min;
    },

    isMaxValid(content) {
      let length = content ? content.length : 0;
      return this.control.minMaxSetting.max >= length;
    }
  },

  validations() {
    return {
      answer: {
        content: {
          required: requiredIf(() => {
            return this.control.fillableSetting.mandatory;
          }),
          minValid: (content) => this.isMinValid(content),
          maxValid: (content) => this.isMaxValid(content),
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
    max-width: $maxControlContentWidth;
  }
}

</style>

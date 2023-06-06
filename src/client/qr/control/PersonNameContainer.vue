<template>
  <ControlWrapper :control="control" :index="index">
    <div :class="[$style.contentWrapper,{[$style.viewOnlyControl]: viewOnly}]">
      <el-input v-model="answer.name"
                :class="[$style.theInput,{elementInputErrorBordered: hasError}]"
                :maxlength="50"
                :placeholder="control.placeholder"
                :spellcheck="false"
                prefix-icon="el-icon-user">
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
      return this.$v.answer.name.$dirty && this.$v.answer.name.$invalid;
    },

    hasRequiredError() {
      return this.$v.answer.name.$dirty && !this.$v.answer.name.required;
    },
  },

  validations() {
    return {
      answer: {
        name: {
          required: requiredIf(() => {
            return this.control.fillableSetting.mandatory;
          }),
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

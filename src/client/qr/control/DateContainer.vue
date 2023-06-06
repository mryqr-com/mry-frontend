<template>
  <ControlWrapper :control="control" :index="index">
    <div :class="[$style.contentWrapper,{[$style.viewOnlyControl]: viewOnly}]">
      <MobileDatePicker v-if="isMobile()"
                        v-model="answer.date"
                        :class="[$style.theDateInput, {inputErrorBordered: hasError}]"
                        :placeholder="control.placeholder">
      </MobileDatePicker>

      <el-date-picker v-if="!isMobile()"
                      v-model="answer.date"
                      :class="[$style.theDateInput,{elementInputErrorBordered: hasError}]"
                      :placeholder="control.placeholder"
                      type="date"
                      value-format="yyyy-MM-dd">
      </el-date-picker>

      <ErrorMessageTransition>
        <div v-if="hasError">
          <div v-if="control.fillableSetting.errorTips">
            <ErrorMessage>
              {{ control.fillableSetting.errorTips }}
            </ErrorMessage>
          </div>

          <div v-else>
            <ErrorMessage>
              请填写日期
            </ErrorMessage>
          </div>
        </div>
      </ErrorMessageTransition>

    </div>
  </ControlWrapper>
</template>

<script>
import MobileDatePicker from '@/common/components/MobileDatePicker';
import {requiredIf} from 'vuelidate/lib/validators'
import {isMobileBrowser} from '@/common/utils/common-utils';

export default {
  components: {MobileDatePicker},
  props: ['control', 'index', 'answer', 'viewOnly'],

  methods: {
    isMobile() {
      return isMobileBrowser();
    }
  },

  computed: {
    hasError() {
      return this.$v.answer.date.$dirty && this.$v.answer.date.$invalid;
    },
  },

  validations() {
    return {
      answer: {
        date: {
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

.theDateInput {
  width: 100% !important;
}

@media (min-width: $mobileScreenBreakpoint), print {
  .theDateInput {
    max-width: $maxControlInputWidth;
  }
}
</style>

<template>
  <ControlWrapper :control="control" :index="index">
    <div :class="[$style.contentWrapper,{[$style.viewOnlyControl]: viewOnly}]">
      <MobileTimePicker v-if="isMobile()"
                        v-model="answer.time"
                        :class="[$style.theTimeInput, {inputErrorBordered: hasError}]"
                        :placeholder="control.placeholder">
      </MobileTimePicker>

      <el-time-picker v-if="!isMobile()"
                      v-model="answer.time"
                      :class="[$style.theTimeInput,{elementInputErrorBordered: hasError}]"
                      :picker-options="{format:'HH:mm'}"
                      :placeholder="control.placeholder"
                      format="HH:mm"
                      value-format="HH:mm">
      </el-time-picker>

      <ErrorMessageTransition>
        <div v-if="hasError">
          <div v-if="control.fillableSetting.errorTips">
            <ErrorMessage>
              {{ control.fillableSetting.errorTips }}
            </ErrorMessage>
          </div>

          <div v-else>
            <ErrorMessage>
              请填写时间
            </ErrorMessage>
          </div>
        </div>
      </ErrorMessageTransition>
    </div>
  </ControlWrapper>

</template>

<script>
import {requiredIf} from 'vuelidate/lib/validators';
import MobileTimePicker from '@/common/components/MobileTimePicker';
import {isMobileBrowser} from '@/common/utils/common-utils';

export default {
  components: {MobileTimePicker},
  props: ['control', 'index', 'answer', 'viewOnly'],

  methods: {
    isMobile() {
      return isMobileBrowser();
    }
  },

  computed: {
    hasError() {
      return this.$v.answer.time.$dirty && this.$v.answer.time.$invalid;
    },
  },

  validations() {
    return {
      answer: {
        time: {
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

.theTimeInput {
  width: 100% !important;
}

@media (min-width: $mobileScreenBreakpoint), print {
  .theTimeInput {
    max-width: $maxControlInputWidth;
  }
}

</style>

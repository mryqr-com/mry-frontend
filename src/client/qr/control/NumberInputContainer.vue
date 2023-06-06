<template>
  <ControlWrapper :control="control" :index="index">
    <div :class="[$style.contentWrapper,{[$style.viewOnlyControl]: shouldViewOnly}]">
      <div :class="$style.answerContainer">
        <el-input v-model="answer.number"
                  :class="[$style.theInput,
                  {elementInputErrorBordered: hasError},
                  {[$style.autoCalculate]:control.shouldAutoCalculate}]"
                  :placeholder="control.placeholder"
                  prefix-icon="el-icon-s-grid"
                  type="number"
                  @change="onChange">
        </el-input>
        <div v-if="control.suffix" :class="$style.suffix">{{ control.suffix }}</div>
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
              请填写该项
            </ErrorMessage>

            <div v-else>
              <ErrorMessage v-if="hasMinError">
                最小值为{{ control.minMaxSetting.min }}
              </ErrorMessage>

              <ErrorMessage v-if="hasMaxError">
                最大值为{{ control.minMaxSetting.max }}
              </ErrorMessage>

              <ErrorMessage v-if="hasPrecisionError">
                {{ precisionErrorMessage }}
              </ErrorMessage>
            </div>
          </div>
        </div>
      </ErrorMessageTransition>
    </div>
  </ControlWrapper>

</template>

<script>
import {requiredIf} from 'vuelidate/lib/validators'
import eventBus from "@/common/utils/event-bus";
import submissionApi from '@/common/api/submission-api';
import {createNamespacedHelpers} from "vuex";

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  props: ['control', 'index', 'answer', 'answers', 'viewOnly'],

  created() {
    eventBus.$on('answerChanged', this.onOtherAnswerChanged);
  },

  beforeDestroy() {
    eventBus.$off('answerChanged');
  },

  methods: {
    isNumber(input) {
      return !!input && !isNaN(input) && !isNaN(parseFloat(input));
    },

    isMaxValid(input) {
      if (!this.isNumber(input)) {
        return true;
      }

      return this.isNumber(input) && input <= this.control.minMaxSetting.max;
    },

    isMinValid(input) {
      if (!this.isNumber(input)) {
        return true;
      }

      return this.isNumber(input) && input >= this.control.minMaxSetting.min;
    },

    isPrecisionValid(number) {
      let realNumber = parseFloat(number);
      if (isNaN(realNumber)) {
        return true;
      }

      let e = 1;
      while (Math.round(realNumber * e) / e !== realNumber) e *= 10;
      let precision = Math.log(e) / Math.LN10;
      return precision <= this.control.precision;
    },

    onChange() {
      if (!this.$v.answer.number.$invalid) {
        eventBus.$emit('answerChanged', this.control.id);
      }
    },

    onOtherAnswerChanged(controlId) {
      if (!this.control.shouldAutoCalculate) {
        return;
      }

      if (!this.autoCalculateDependentControlIds.includes(controlId)) {
        return;
      }

      let dependentAnswers = this.answers.filter(answer => {
        return this.autoCalculateDependentControlIds.includes(answer.controlId);
      });

      //严格讲应该保证所有所依赖的answer都有值时才掉后端autoCalculate接口，但是前端没有isFilled()判断，另外有时当值从有值变为无值时其实也需要出发后端autoCalculate接口
      if (dependentAnswers.length === 0) {
        return;
      }

      let query = {
        appId: this.appId,
        pageId: this.currentPageId,
        controlId: this.control.id,
        answers: dependentAnswers
      };

      submissionApi.autoCalculateNumberInput(query).then(response => {
        this.answer.number = response.data.number;
      });
    }
  },

  computed: {
    ...clientQrStore.mapGetters(['appId', 'currentPageId']),

    autoCalculateDependentControlIds() {
      return this.control.autoCalculateSetting.aliasContext.controlAliases.map(alias => alias.controlId);
    },

    shouldViewOnly() {
      return this.viewOnly || this.control.shouldAutoCalculate;
    },

    hasError() {
      return this.$v.answer.number.$dirty && this.$v.answer.number.$invalid;
    },

    hasRequiredError() {
      return this.$v.answer.number.$dirty && !this.$v.answer.number.required;
    },

    hasMinError() {
      return this.$v.answer.number.$dirty && !this.$v.answer.number.minValid;
    },

    hasMaxError() {
      return this.$v.answer.number.$dirty && !this.$v.answer.number.maxValid;
    },

    hasPrecisionError() {
      return this.$v.answer.number.$dirty && !this.$v.answer.number.precisionValid;
    },

    precisionErrorMessage() {
      if (this.control.precision === 0) {
        return '请填写整数';
      } else {
        return `最多保留${this.control.precision}位小数`
      }
    }
  },

  validations() {
    if (this.control.shouldAutoCalculate) {
      return {
        answer: {
          number: {}
        }
      };
    }

    return {
      answer: {
        number: {
          required: requiredIf(() => {
            return this.control.fillableSetting.mandatory;
          }),
          maxValid: (value) => this.isMaxValid(value),
          minValid: (value) => this.isMinValid(value),
          precisionValid: (value) => this.isPrecisionValid(value)
        }
      }
    }
  }
}
</script>

<style lang="scss" module>
.contentWrapper {

  :global {
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    input[type=number] {
      -moz-appearance: textfield;
    }
  }
}

.viewOnlyControl {
  pointer-events: none;
}

.answerContainer {
  display: flex;
  align-items: center;
}

.theInput {
  flex-basis: 100px;
  flex-grow: 1;
}

.autoCalculate {
  :global {
    .el-input__inner {
      background-color: $lightBackgroundColor !important;
    }
  }
}

.suffix {
  height: $formPageInputHeight;
  line-height: $formPageInputHeight;
  overflow: hidden;
  padding-left: 2px;
}

@media (min-width: $mobileScreenBreakpoint), print {
  .contentWrapper {
    max-width: $maxControlInputWidth;
  }
}

</style>

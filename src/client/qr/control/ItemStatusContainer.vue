<template>
  <ControlWrapper :control="control" :index="index">
    <div :class="[$style.contentWrapper,{[$style.viewOnlyControl]: shouldViewOnly}]">
      <ClientDropdown v-model="answer.optionId"
                      :class="[$style.theDropdown,
                      {inputErrorBordered: hasError,elementInputErrorBordered:hasError},
                      {[$style.autoCalculate]:control.shouldAutoCalculate}]"
                      :options="control.options"
                      :placeholder="control.placeholder"
                      :style="{'--status-color': currentColor}"
                      :viewOnly="shouldViewOnly"
                      key-field="id"
                      label-field="name"
                      value-field="id">
      </ClientDropdown>

      <ErrorMessageTransition>
        <div v-if="hasError">
          <div v-if="control.fillableSetting.errorTips">
            <ErrorMessage>
              {{ control.fillableSetting.errorTips }}
            </ErrorMessage>
          </div>

          <div v-else>
            <ErrorMessage>
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
import eventBus from "@/common/utils/event-bus";
import {createNamespacedHelpers} from "vuex";
import submissionApi from "@/common/api/submission-api";

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  props: ['control', 'index', 'answer', 'answers', 'viewOnly'],

  created() {
    eventBus.$on('answerChanged', this.onOtherAnswerChanged);
  },

  beforeDestroy() {
    eventBus.$off('answerChanged');
  },

  computed: {
    ...clientQrStore.mapGetters(['appId', 'currentPageId']),

    shouldViewOnly() {
      return this.viewOnly || this.control.shouldAutoCalculate;
    },

    autoCalculateDependentControlIds() {
      return this.control.autoCalculateSetting.aliasContext.controlAliases.map(alias => alias.controlId);
    },

    currentColor() {
      if (!this.answer.optionId) {
        return null;
      }

      return this.control.options.find(o => {
        return o.id === this.answer.optionId
      }).color;
    },

    hasError() {
      return this.$v.answer.optionId.$dirty && this.$v.answer.optionId.$invalid;
    },
  },

  methods: {
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

      submissionApi.autoCalculateItemStatus(query).then(response => {
        this.answer.optionId = response.data.optionId;
      });
    }
  },

  validations() {
    if (this.control.shouldAutoCalculate) {
      return {
        answer: {
          optionId: {}
        }
      };
    }

    return {
      answer: {
        optionId: {
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

.theDropdown {
  input, select {
    color: var(--status-color);
  }
}

.autoCalculate {
  background-color: $lightBackgroundColor;
}

@media (min-width: $mobileScreenBreakpoint), print {
  .theDropdown {
    max-width: $maxControlSelectionWidth;
  }
}

</style>

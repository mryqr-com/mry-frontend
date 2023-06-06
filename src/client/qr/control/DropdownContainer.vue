<template>
  <ControlWrapper :control="control" :index="index">
    <div :class="[$style.contentWrapper,{[$style.viewOnlyControl]: viewOnly}]">
      <ClientDropdown v-model="theModel"
                      :class="[$style.theDropdown,{[$style.errorBordered]: hasError}]"
                      :filterable="control.filterable"
                      :max="control.minMaxSetting.max"
                      :multiple="control.multiple"
                      :options="control.options"
                      :placeholder="control.placeholder"
                      :viewOnly="viewOnly"
                      key-field="id"
                      label-field="name"
                      value-field="id"
                      @change="onChange">
      </ClientDropdown>

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
              至少需要选择{{ control.minMaxSetting.min }}项
            </ErrorMessage>

            <ErrorMessage v-if="hasMaxError">
              最多只能选择{{ control.minMaxSetting.max }}项
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

export default {
  props: ['control', 'index', 'answer', 'viewOnly'],

  computed: {
    hasError() {
      return this.$v.answer.optionIds.$dirty && this.$v.answer.optionIds.$invalid;
    },

    hasRequiredError() {
      return this.$v.answer.optionIds.$dirty && !this.$v.answer.optionIds.required;
    },

    hasMinError() {
      return this.$v.answer.optionIds.$dirty && !this.$v.answer.optionIds.minValid;
    },

    hasMaxError() {
      return this.$v.answer.optionIds.$dirty && !this.$v.answer.optionIds.maxValid;
    },

    theModel: {
      get: function () {
        if (this.control.multiple) {
          return this.answer.optionIds;
        } else {
          return this.answer.optionIds[0];
        }
      },

      set: function (val) {
        if (!Array.isArray(val)) {
          this.answer.optionIds = [val];
        } else {
          this.answer.optionIds = val;
        }
      }
    }
  },

  methods: {
    onChange() {
      eventBus.$emit('answerChanged', this.control.id);
    },

    isMinValid(optionIds) {
      if (this.control.multiple) {
        let length = optionIds ? optionIds.length : 0;
        return length >= this.control.minMaxSetting.min;
      }
      return true;
    },

    isMaxValid(optionIds) {
      if (this.control.multiple) {
        let length = optionIds ? optionIds.length : 0;
        return this.control.minMaxSetting.max >= length;
      }
      return true;
    }
  },

  validations() {
    return {
      answer: {
        optionIds: {
          required: requiredIf(() => {
            return this.control.fillableSetting.mandatory;
          }),
          minValid: (optionIds) => this.isMinValid(optionIds),
          maxValid: (optionIds) => this.isMaxValid(optionIds),
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

@media (min-width: $mobileScreenBreakpoint), print {
  .theDropdown {
    max-width: $maxControlSelectionWidth;
  }
}
</style>

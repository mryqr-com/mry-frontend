<template>
  <ControlWrapper :control="control" :index="index">
    <div :class="[$style.contentWrapper,{[$style.viewOnlyControl]: viewOnly}]">
      <el-checkbox-group v-model="answer.optionIds" :class="$style.checkboxGroup" :max="control.minMaxSetting.max">
        <el-checkbox v-for="option in control.options"
                     :key="option.id"
                     :class="$style.theBox"
                     :label="option.id"
                     @change="onChange">
          {{ option.name }}
        </el-checkbox>
      </el-checkbox-group>

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
  },

  methods: {
    onChange() {
      eventBus.$emit('answerChanged', this.control.id);
    },

    isMinValid(optionIds) {
      return optionIds.length >= this.control.minMaxSetting.min;
    },

    isMaxValid(optionIds) {
      return this.control.minMaxSetting.max >= optionIds.length;
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
  :global {
    .el-checkbox-group {
      width: 100%;
    }

    .el-checkbox {
      margin-right: 0;
    }

    .el-checkbox__input {
      margin-left: 10px;
    }

    .el-checkbox__label {
      padding-left: 13px;
    }

  }
}

.viewOnlyControl {
  pointer-events: none;
}

.checkboxGroup {
  border: $primary1pxBorder;
}

.theBox {
  display: block;
  height: $formPageInputHeight;
  line-height: $formPageInputHeight;
  border-bottom: $primary1pxBorder;
}

.theBox:last-child {
  border-bottom: none;
}

@media (min-width: $mobileScreenBreakpoint), print {
  .checkboxGroup {
    border: none;

    :global {
      .el-checkbox__input {
        margin-left: 0;
      }
    }
  }

  .theBox {
    border-bottom: none;
  }
}

</style>

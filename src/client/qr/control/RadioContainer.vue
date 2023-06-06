<template>
  <ControlWrapper :control="control" :index="index">
    <div :class="[$style.contentWrapper,{[$style.viewOnlyControl]: viewOnly}]">
      <el-radio-group v-model="answer.optionId" :class="$style.radioGroup">
        <el-radio v-for="option in control.options"
                  :key="option.id"
                  :class="$style.theRadio"
                  :label="option.id"
                  @click.prevent.native="onRadioClicked(option.id)">
          {{ option.name }}
        </el-radio>
      </el-radio-group>

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
import eventBus from "@/common/utils/event-bus";

export default {
  props: ['control', 'index', 'answer', 'viewOnly'],

  computed: {
    hasError() {
      return this.$v.answer.optionId.$dirty && this.$v.answer.optionId.$invalid;
    },

    hasRequiredError() {
      return this.$v.answer.optionId.$dirty && !this.$v.answer.optionId.required;
    }
  },

  methods: {
    onRadioClicked(optionId) {
      if (this.answer.optionId === optionId) {
        this.answer.optionId = null;
      } else {
        this.answer.optionId = optionId;
      }
      eventBus.$emit('answerChanged', this.control.id);
    }
  },

  validations() {
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
  :global {
    .el-radio-group {
      width: 100%;
    }

    .el-radio {
      margin-right: 0;
    }

    .el-radio__input {
      margin-left: 10px;
    }
  }
}

.viewOnlyControl {
  pointer-events: none;
}

.radioGroup {
  border: $primary1pxBorder;
}

.theRadio {
  display: block;
  height: $formPageInputHeight;
  line-height: $formPageInputHeight;
  border-bottom: $primary1pxBorder;
}

.theRadio:last-child {
  border-bottom: none;
}


@media (min-width: $mobileScreenBreakpoint), print {
  .radioGroup {
    border: none;

    :global {
      .el-radio__input {
        margin-left: 0;
      }
    }
  }

  .theRadio {
    border-bottom: none;
  }
}

</style>

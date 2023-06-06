<template>
  <ControlWrapper :control="control" :index="index">
    <div :class="[$style.contentWrapper,{[$style.viewOnlyControl]: viewOnly}]">
      <el-rate v-model="answer.rank"
               :class="$style.theRate"
               :max="control.max"
               @change="onChange">
      </el-rate>

      <ErrorMessageTransition>
        <ErrorMessage v-if="hasError" :class="$style.error">
          {{ errorMessage }}
        </ErrorMessage>
      </ErrorMessageTransition>
    </div>
  </ControlWrapper>
</template>

<script>

import eventBus from "@/common/utils/event-bus";

export default {
  props: ['control', 'index', 'answer', 'viewOnly'],

  methods: {
    isRequired(input) {
      return input > 0;
    },

    onChange() {
      eventBus.$emit('answerChanged', this.control.id);
    },

  },

  computed: {
    hasError() {
      return this.$v.answer.rank.$dirty && this.$v.answer.rank.$invalid;
    },

    errorMessage() {
      return this.control.fillableSetting.errorTips ? this.control.fillableSetting.errorTips : '请填写该项';
    }
  },

  validations() {
    if (this.control.fillableSetting.mandatory) {
      return {
        answer: {
          rank: {
            required: (value) => this.isRequired(value),
          }
        }
      }
    } else {
      return {
        answer: {
          rank: {}
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

.theRate {
  height: 24px;
  margin-top: 8px;
  margin-bottom: 8px;

  :global {
    .el-rate__icon {
      font-size: 24px;
    }
  }
}

.error {
  padding-top: 3px;
}

</style>

<template>
  <ControlWrapper :control="control" :index="index">
    <div :class="[$style.contentWrapper,{[$style.viewOnlyControl]: viewOnly}]">
      <div :class="$style.checkArea">
        <PointChecker v-for="(item,index) in control.options"
                      :key="item.id"
                      v-model="answer.checks[item.id]"
                      :class="$style.checker">
          {{ index + 1 }}.&nbsp;{{ item.name }}
        </PointChecker>
      </div>

      <ErrorMessageTransition>
        <div v-if="hasError">
          <div v-if="control.fillableSetting.errorTips">
            <ErrorMessage>
              {{ control.fillableSetting.errorTips }}
            </ErrorMessage>
          </div>

          <div v-else>
            <ErrorMessage>
              请填完所有检查项
            </ErrorMessage>
          </div>
        </div>
      </ErrorMessageTransition>

    </div>
  </ControlWrapper>

</template>

<script>
import PointChecker from '@/common/components/PointChecker';

export default {
  props: ['control', 'index', 'answer', 'viewOnly'],

  components: {
    PointChecker
  },

  methods: {
    required() {
      if (this.control.fillableSetting.mandatory) {
        return Object.values(this.answer.checks).every(c => c !== 'NONE');
      }

      return Object.values(this.answer.checks).every(c => c !== 'NONE') ||
          Object.values(this.answer.checks).every(c => c === 'NONE');
    }
  },

  computed: {
    hasError() {
      return this.$v.answer.checks.$dirty && this.$v.answer.checks.$invalid;
    },
  },

  validations() {
    return {
      answer: {
        checks: {
          required: () => this.required(),
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

.checkArea {
  border: $primary1pxBorder;
}

.checker {
  border-bottom: $primary1pxBorder;
}

.checker:last-child {
  border-bottom: none;
}

@media (min-width: $mobileScreenBreakpoint), print {
  .contentWrapper {
    max-width: $maxControlContentWidth;
  }
}

</style>

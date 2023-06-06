<template>
  <ControlWrapper :control="control" :index="index">
    <div :class="[$style.contentWrapper,{[$style.viewOnlyControl]: viewOnly}]">
      <el-input v-model="answer.content"
                :class="[$style.theInput,{elementInputErrorBordered: hasError}]"
                :maxlength="control.minMaxSetting.max"
                :placeholder="control.placeholder"
                :spellcheck="false">
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

            <ErrorMessage v-if="hasMinError">
              至少需要填写{{ control.minMaxSetting.min }}个字符
            </ErrorMessage>

            <ErrorMessage v-if="hasMaxError">
              最多只能填写{{ control.minMaxSetting.min }}个字符
            </ErrorMessage>

            <ErrorMessage v-if="hasFormatError">
              {{ formatErrorMessage }}
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
      return this.$v.answer.content.$dirty && this.$v.answer.content.$invalid;
    },

    hasRequiredError() {
      return this.$v.answer.content.$dirty && !this.$v.answer.content.required;
    },

    hasMinError() {
      return this.$v.answer.content.$dirty && !this.$v.answer.content.minValid;
    },

    hasMaxError() {
      return this.$v.answer.content.$dirty && !this.$v.answer.content.maxValid;
    },

    hasFormatError() {
      return this.$v.answer.content.$dirty && !this.$v.answer.content.formatValid;
    },

    formatErrorMessage() {
      switch (this.control.identifierFormatType) {
        case "ID_CARD": {
          return "请填写正确格式的身份证号码";
        }

        case "CAR_PLATE_ID": {
          return "请填写正确格式的车牌号码，比如：京A12345或沪AD12345";
        }

        case "NUMBER_ONLY": {
          return "请填写纯数字";
        }
      }

      return "格式不正确";
    }
  },

  methods: {
    isMinValid(content) {
      let length = content ? content.length : 0;
      return length >= this.control.minMaxSetting.min;
    },

    isMaxValid(content) {
      let length = content ? content.length : 0;
      return this.control.minMaxSetting.max >= length;
    },

    isFormatValid(content) {
      if (!content || this.control.identifierFormatType === 'NONE') {
        return true;
      }

      switch (this.control.identifierFormatType) {
        case "ID_CARD": {
          return /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(content);
        }

        case "CAR_PLATE_ID": {
          return /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[a-zA-Z](([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})$/.test(content);
        }

        case "NUMBER_ONLY": {
          return /^[0-9]*$/.test(content);
        }

        case "REGEX": {
          if (!this.control.formatRegex ||
              !this.control.formatRegex.startsWith('/') ||
              (this.control.formatRegex.match(/\//g) || []).length !== 2) {//检查正则表达式本身的格式
            return true;//不是合法正则时，不做检查，因此返回true
          }

          try {
            let regex = eval(this.control.formatRegex);
            if (regex instanceof RegExp) {
              return regex.test(content);
            }
            return true;
          } catch (err) {
            return true;
          }

        }
      }
      return true;
    }
  },

  validations() {
    return {
      answer: {
        content: {
          required: requiredIf(() => {
            return this.control.fillableSetting.mandatory;
          }),
          minValid: (content) => this.isMinValid(content),
          maxValid: (content) => this.isMaxValid(content),
          formatValid: (content) => this.isFormatValid(content),
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

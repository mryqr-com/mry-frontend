<template>
  <ControlWrapper :control="control" :index="index">
    <RichTextViewer v-if="viewOnly"
                    :content="answer.content?answer.content:'无数据'">
    </RichTextViewer>

    <div v-else>
      <RichTextInput v-model="answer.content"
                     :ossRequest="submissionOssRequest"
                     :placeholder="control.placeholder"
                     :stickyHeader="true"
                     :stickyTop="stickyTop">
      </RichTextInput>

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
              最多只能填写{{ control.minMaxSetting.max }}个字符
            </ErrorMessage>
          </div>
        </div>
      </ErrorMessageTransition>

    </div>
  </ControlWrapper>
</template>

<script>
import {requiredIf} from 'vuelidate/lib/validators';
import {createNamespacedHelpers} from "vuex";

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  components: {
    RichTextViewer: () => import(/* webpackChunkName: "rich-text-viewer" */ '@/common/components/RichTextViewer'),
    RichTextInput: () => import(/* webpackChunkName: "rich-text-input" */ '@/common/components/RichTextInput'),
  },

  props: ['control', 'index', 'answer', 'viewOnly'],

  computed: {
    ...clientQrStore.mapGetters([
      'submissionOssRequest'
    ]),

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

    stickyTop() {
      let topBar = document.getElementById("qrTopBar");
      return topBar ? topBar.clientHeight + 'px' : '0';
    },
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
        }
      }
    }
  }
}
</script>

<style lang="scss" module>
</style>

<template>
  <ControlWrapper :control="control" :index="index">
    <i v-if="!viewOnly"
       slot="titleSuffix"
       :class="$style.markdownIcon"
       class="majoricon i-edit-square"
       title="在Markdown编辑器中打开"
       @click="markdownDialogVisible=true">
    </i>

    <MarkdownViewer v-if="viewOnly"
                    :value="answer.content?answer.content:'无数据'">
    </MarkdownViewer>

    <div v-else>
      <el-input v-model="answer.content"
                :class="[$style.theInput,{elementInputErrorBordered: hasError}]"
                :maxlength="control.minMaxSetting.max"
                :placeholder="control.placeholder"
                :rows="control.rows"
                type="textarea">
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
              最多只能填写{{ control.minMaxSetting.max }}个字符
            </ErrorMessage>
          </div>
        </div>
      </ErrorMessageTransition>

      <DialogedMarkdownInput v-if="!isInMobile()"
                             v-model="answer.content"
                             :oss-request="submissionOssRequest"
                             :show.sync="markdownDialogVisible"
                             :title="control.name">
      </DialogedMarkdownInput>
    </div>
  </ControlWrapper>
</template>

<script>
import {requiredIf} from 'vuelidate/lib/validators';
import {isMobileBrowser} from '@/common/utils/common-utils';

import {createNamespacedHelpers} from "vuex";

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  components: {
    MarkdownViewer: () => import(/* webpackChunkName: "markdown-viewer" */ '@/common/components/MarkdownViewer'),
    DialogedMarkdownInput: () => import(/* webpackChunkName: "dialoged-markdown-editor" */ '@/common/components/DialogedMarkdownInput'),
  },

  props: ['control', 'index', 'answer', 'viewOnly'],

  data() {
    return {
      markdownDialogVisible: false
    }
  },

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
  },

  methods: {
    isInMobile() {
      return isMobileBrowser();
    },

    isMinValid(content) {
      let length = content ? content.length : 0;
      return length >= this.control.minMaxSetting.min;
    },

    isMaxValid(content) {
      let length = content ? content.length : 0;
      return this.control.minMaxSetting.max >= length;
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
        }
      }
    }
  }
}
</script>

<style lang="scss" module>
.markdownIcon {
  display: none;
}

@media (min-width: $mobileScreenBreakpoint), print {
  .theInput {
    max-width: $maxControlContentWidth;
  }

  .markdownIcon {
    display: inline;
    cursor: pointer;
    font-weight: normal;
  }

  .markdownIcon:hover {
    color: $primaryThemeColor;
  }
}

</style>

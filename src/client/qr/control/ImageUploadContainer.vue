<template>
  <ControlWrapper :control="control" :index="index">
    <div :class="$style.contentWrapper">
      <MultipleFileUploader v-model="answer.images"
                            :buttonStyle="control.buttonStyle"
                            :buttonText="control.buttonText"
                            :compressType="control.compressType"
                            :displayCount="true"
                            :dnd="!isInMobile"
                            :dndAreaHeight="50"
                            :dndAreaText="control.buttonText"
                            :hideButtonWhenMax="true"
                            :imageOnly="true"
                            :max="control.max"
                            :nameEditable="control.nameEditable"
                            :onlyOnSite="control.onlyOnSite"
                            :ossRequest="submissionOssRequest"
                            :perMaxSize="10"
                            :sortable="control.sortable"
                            :viewOnly="viewOnly">
      </MultipleFileUploader>

      <ErrorMessageTransition>
        <div v-if="hasError">
          <div v-if="control.fillableSetting.errorTips">
            <ErrorMessage>
              {{ control.fillableSetting.errorTips }}
            </ErrorMessage>
          </div>

          <div v-else>
            <ErrorMessage v-if="hasRequiredError">
              请上传图片
            </ErrorMessage>

            <ErrorMessage v-if="hasMaxError">
              最多只能上传{{ control.max }}张图片
            </ErrorMessage>
          </div>
        </div>
      </ErrorMessageTransition>
    </div>
  </ControlWrapper>
</template>

<script>
import {requiredIf} from 'vuelidate/lib/validators'
import {createNamespacedHelpers} from 'vuex';
import {isMobileBrowser} from '@/common/utils/common-utils';

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  props: ['control', 'index', 'answer', 'viewOnly'],

  components: {
    MultipleFileUploader: () => import(/* webpackChunkName: "multi-file-uploader" */ '@/common/components/MultipleFileUploader'),
  },

  computed: {
    ...clientQrStore.mapGetters([
      'submissionOssRequest'
    ]),

    isInMobile() {
      return isMobileBrowser();
    },

    hasError() {
      return this.$v.answer.images.$dirty && this.$v.answer.images.$invalid;
    },

    hasRequiredError() {
      return this.$v.answer.images.$dirty && !this.$v.answer.images.required;
    },

    hasMaxError() {
      return this.$v.answer.images.$dirty && !this.$v.answer.images.maxValid;
    },

  },

  methods: {
    isMaxValid(images) {
      return this.control.max >= images.length;
    }
  },

  validations() {
    return {
      answer: {
        images: {
          required: requiredIf(() => {
            return this.control.fillableSetting.mandatory;
          }),
          maxValid: (images) => this.isMaxValid(images),
        }
      }
    }
  }
}
</script>

<style lang="scss" module>
.contentWrapper {
}

@media (min-width: $mobileScreenBreakpoint), print {
  .contentWrapper {
    max-width: $maxControlContentWidth;
  }
}

</style>

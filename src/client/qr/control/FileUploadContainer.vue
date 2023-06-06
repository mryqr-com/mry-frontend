<template>
  <ControlWrapper :control="control" :index="index">
    <div v-if="isVideoAudioDisabled && !viewOnly">
      <ErrorMessage>
        当前套餐过低，无法上传音视频文件，请联系管理员以升级
      </ErrorMessage>
    </div>
    <div v-else :class="$style.contentWrapper">
      <MultipleFileUploader v-model="answer.files"
                            :acceptTypes="acceptFileTypes"
                            :buttonStyle="control.buttonStyle"
                            :buttonText="control.buttonText"
                            :dnd="!isInMobile"
                            :dndAreaHeight="50"
                            :dndAreaText="control.buttonText"
                            :hideButtonWhenMax="true"
                            :max="control.max"
                            :nameEditable="control.nameEditable"
                            :ossRequest="submissionOssRequest"
                            :perMaxSize="control.perMaxSize"
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
              请上传文件
            </ErrorMessage>

            <ErrorMessage v-if="hasMaxError">
              最多只能上传{{ control.max }}个文件
            </ErrorMessage>
          </div>
        </div>
      </ErrorMessageTransition>
    </div>
  </ControlWrapper>

</template>

<script>
import {requiredIf} from 'vuelidate/lib/validators';
import {accept} from '@/common/utils/mime-utils';
import {createNamespacedHelpers} from 'vuex';
import {isMobileBrowser} from "@/common/utils/common-utils";

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  props: ['control', 'index', 'answer', 'viewOnly'],

  components: {
    MultipleFileUploader: () => import(/* webpackChunkName: "multi-file-uploader" */ '@/common/components/MultipleFileUploader'),
  },

  computed: {
    ...clientQrStore.mapGetters([
      'submissionOssRequest',
      'isVideoAudioAllowed'
    ]),

    isVideoAudioDisabled() {
      return !this.isVideoAudioAllowed && (this.control.category === 'VIDEO' || this.control.category === 'AUDIO');
    },

    acceptFileTypes() {
      return accept[this.control.category];
    },

    isInMobile() {
      return isMobileBrowser();
    },

    hasError() {
      return this.$v.answer.files.$dirty && this.$v.answer.files.$invalid;
    },

    hasRequiredError() {
      return this.$v.answer.files.$dirty && !this.$v.answer.files.required;
    },

    hasMaxError() {
      return this.$v.answer.files.$dirty && !this.$v.answer.files.maxValid;
    },

  },

  methods: {
    isMaxValid(files) {
      return this.control.max >= files.length;
    }
  },

  validations() {
    return {
      answer: {
        files: {
          required: requiredIf(() => {
            return this.control.fillableSetting.mandatory;
          }),
          maxValid: (files) => this.isMaxValid(files),
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

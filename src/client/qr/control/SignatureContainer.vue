<template>
  <ControlWrapper :control="control" :index="index">
    <div :class="$style.contentWrapper">
      <img v-if="alreadySigned" :class="$style.signatureImage" :src="signatureImageUrl" alt="签名"/>
      <div v-else-if="viewOnly">无数据</div>

      <div v-else>
        <StyledButton v-if="!isSigned && !showPad"
                      :buttonStyle="control.buttonStyle"
                      :class="$style.startSignatureButton"
                      @click="displayPad">
          <i class="el-icon-edit"></i>&nbsp;{{ control.buttonText }}
        </StyledButton>

        <div v-if="padLoaded && showPad" :class="$style.padInput">
          <div :class="[$style.padArea,{[$style.padAreaSigned]:isSigned}]">
            <VueSignaturePad ref="signaturePad" height="100%" width="100%"/>
          </div>

          <div v-if="!isSigned" :class="$style.opsArea">
            <PlainButton :class="$style.opsButton" :disabled="signatureLoading" @click="saveSignature">保存
              <i v-show="signatureLoading" :class="$style.loadingIcon" class="el-icon-loading"></i>
            </PlainButton>
            <PlainButton :class="$style.opsButton" :disabled="signatureLoading" @click="clearSignature">清空</PlainButton>
            <PlainButton :class="$style.opsButton" :disabled="signatureLoading" @click="cancelSignature">取消
            </PlainButton>
          </div>

          <div v-if="isSigned" :class="$style.opsDeleteArea">
            <div :class="$style.tips">如需重签，可点击删除按钮</div>
            <PlainButton :class="$style.opsButton" :disabled="signatureLoading" @click="deleteSignature">删除
            </PlainButton>
          </div>
        </div>
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
              请完成签名
            </ErrorMessage>
          </div>
        </div>
      </ErrorMessageTransition>
    </div>
  </ControlWrapper>
</template>

<script>
import Vue from "vue";
import {createNamespacedHelpers} from "vuex";
import {imageThumbnailUrlWide} from '@/common/utils/image-utils'
import {createOssClient, getOssToken} from '@/common/utils/aliyun-utils';
import uuid from 'short-uuid';
import {dataURItoFile} from "@/common/utils/common-utils";
import {requiredIf} from "vuelidate/lib/validators";

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  props: ['control', 'index', 'answer', 'viewOnly'],

  data() {
    return {
      alreadySigned: false,
      padLoaded: false,
      showPad: false,
      signatureLoading: false,
    }
  },

  created() {
    if (this.answer.signature) {
      this.alreadySigned = true;
      return;
    }

    import(/* webpackChunkName: "signature-pad" */ 'vue-signature-pad').then(module => {
      Vue.use(module.default);
      this.padLoaded = true;
    });
  },

  computed: {
    ...clientQrStore.mapGetters([
      'submissionOssRequest'
    ]),

    isSigned() {
      return !!this.answer.signature;
    },

    signatureImageUrl() {
      return imageThumbnailUrlWide(this.answer.signature);
    },

    hasError() {
      return this.$v.answer.signature.$dirty && this.$v.answer.signature.$invalid;
    },
  },

  methods: {
    displayPad() {
      this.showPad = true;
      this.$nextTick(() => {
        this.$refs.signaturePad.openSignaturePad();
        this.$refs.signaturePad.clearSignature();
        let canvasElement = this.$refs.signaturePad.$el.getElementsByTagName('canvas')[0];
        canvasElement.oncontextmenu = function (e) {
          e.preventDefault();
          e.stopPropagation();
        }

        canvasElement.addEventListener('touchstart', function (e) {
          e.preventDefault();
        });

        canvasElement.addEventListener('touchend', function (e) {
          e.preventDefault();
        });
      });
    },

    saveSignature() {
      let type = 'image/png';
      let {isEmpty, data} = this.$refs.signaturePad.saveSignature(type, 0);
      if (isEmpty) {
        this.$message({
          type: 'error',
          message: '请完成签名再保存。',
          center: true,
          duration: 1000,
        });
        return;
      }

      this.signatureLoading = true;
      let imageFile = dataURItoFile(data, this.control.id + '-signature.png');
      return getOssToken(this.submissionOssRequest).then(token => {
        return createOssClient(token).then(client => {
          let id = uuid.generate();
          let fileKey = `${token.folder}/${id}-${imageFile.name}`;
          return client.put(fileKey, imageFile).then(result => {
            this.$refs.signaturePad.lockSignaturePad();
            this.answer.signature = {
              id: id,
              name: imageFile.name,
              ossKey: fileKey,
              fileUrl: result.url,
              type: type,
              size: imageFile.size,
            };
          });
        });
      }).finally(() => {
        this.signatureLoading = false;
      });
    },

    cancelSignature() {
      this.$refs.signaturePad.clearSignature();
      this.showPad = false;
      this.answer.signature = null;
    },

    deleteSignature() {
      this.$refs.signaturePad.clearSignature();
      this.showPad = false;
      let signature = this.answer.signature;

      //由前端直接删除OSS上的资源，如果不删除请注释掉
      if (signature) {
        getOssToken(this.submissionOssRequest).then(token => {
          createOssClient(token).then(client => {
            client.delete(signature.ossKey);
          });
        });
      }
      this.answer.signature = null;
    },

    clearSignature() {
      this.$refs.signaturePad.clearSignature();
    }
  },

  validations() {
    return {
      answer: {
        signature: {
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
.signatureImage {
  width: 120px;
  border: $primary1pxBorder;
}

.padInput {
  border: $primary1pxBorder;
}

.padArea {
  height: 200px;
  border-bottom: $primary1pxBorder;
}

.padAreaSigned {
  pointer-events: none;
}

.opsArea {
  max-width: 400px;
  margin: auto;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.opsDeleteArea {
  padding: 10px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tips {
  color: $secondaryTextColor;
}

.opsButton {
  flex-shrink: 0;
  font-size: 14px !important;
  width: 100px !important;
  height: 32px !important;
  color: $regularTextColor !important;
}

.loadingIcon {
  margin-left: 2px;
}

@media (min-width: $mobileScreenBreakpoint), print {
  .contentWrapper {
    max-width: $maxControlContentWidth;
  }

  .startSignatureButton {
    width: $maxControlInputWidth !important;
  }

  .padArea {
    height: 300px;
  }

}

</style>

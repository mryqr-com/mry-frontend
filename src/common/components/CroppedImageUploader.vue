<template>
  <div :class="$style.wrapper">
    <img v-if="value"
         :alt="value.name"
         :class="[$style.theImage,{[$style.circleImage]:type === 'circle'}]"
         :src="imageDisplayUrl(value)"/>

    <input ref="fileInput"
           :accept="imageAccept"
           :class="$style.fileInput"
           type="file"
           @change="loadImage($event)"
           @click="$refs.fileInput.value=null">

    <StyledButton v-if="!value" :buttonStyle="buttonStyle" @click="selectImage">
      {{ uploadButtonText }}
    </StyledButton>

    <StyledButton v-if="value" :buttonStyle="buttonStyle" @click="deleteImage ">
      {{ deleteButtonText }}
    </StyledButton>

    <el-dialog :append-to-body="true"
               :close-on-click-modal="false"
               :customClass="$style.elDialog"
               :title="cropperTitle"
               :visible.sync="dialogVisible">
      <cropper ref="cropper"
               :class="$style.cropper"
               :src="cropperImageSrc"
               :stencil-component="stencilComponent"
               :stencil-props="stencilProps"
               defaultBoundaries="fit"
               imageRestriction="fit-area">
      </cropper>

      <div slot="footer" :class="$style.footer">
        <el-button :class="$style.footerButton"
                   icon="el-icon-close"
                   type="plain"
                   @click="cancelCrop">
          取消
        </el-button>
        <el-button :class="$style.footerButton"
                   :disabled="uploadLoading"
                   :icon="cropButtonIcon"
                   type="primary"
                   @click="cropAndUpload">
          {{ cropButtonText }}
        </el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import 'vue-advanced-cropper/dist/style.css';
import {CircleStencil, Cropper, RectangleStencil} from 'vue-advanced-cropper';
import {createOssClient, getOssToken} from "@/common/utils/aliyun-utils";
import uuid from "short-uuid";
import {imageDisplayUrl} from "@/common/utils/image-utils";
import {accept} from "@/common/utils/mime-utils";

export default {
  props: {
    value: {
      type: Object,
    },

    uploadButtonText: {
      type: String,
      default: '上传图片'
    },

    deleteButtonText: {
      type: String,
      default: '删除图片'
    },

    buttonStyle: {
      type: Object,
    },

    cropperTitle: {
      type: String,
      default: '裁剪图片'
    },

    type: {
      type: String,
      default: 'circle',
    },

    cropType: {
      type: String,
      default: 'ANY_CROP'
    },

    ossRequest: {
      type: Object,
      required: true
    },

    compressType: {
      type: String,
      default: 'MEDIUM'
    },
  },

  components: {
    Cropper,
    CircleStencil,
    RectangleStencil,
  },

  data() {
    return {
      dialogVisible: false,
      cropperImageSrc: null,
      uploadLoading: false,
    }
  },

  computed: {
    imageAccept() {
      return accept.IMAGE.join(',');
    },

    stencilComponent() {
      return this.type === 'circle' ?
          this.$options.components.CircleStencil :
          this.$options.components.RectangleStencil;
    },

    stencilProps() {
      return this.type === 'circle' ?
          {
            previewClass: this.$style.circlePreview
          } :
          {
            aspectRatio: this.aspectRatio,
          }
    },

    cropButtonIcon() {
      return this.uploadLoading ? "el-icon-loading" : "el-icon-check";
    },

    cropButtonText() {
      return this.uploadLoading ? '正在上传' : '确定';
    },

    aspectRatio() {
      let typeMapping = {
        NO_CROP: 0,
        ANY_CROP: 0,
        TWO_TO_ONE: 2,
        FOUR_TO_THREE: 4 / 3,
        SIXTEEN_TO_NINE: 16 / 9,
        ONE_TO_ONE: 1,
        NINE_TO_SIXTEEN: 9 / 16,
        THREE_TO_FOUR: 3 / 4,
        ONE_TO_TWO: 1 / 2,
      };

      return typeMapping[this.cropType];
    }

  },

  methods: {
    imageDisplayUrl,

    selectImage() {
      this.uploadLoading = false;
      this.$refs.fileInput.click();
    },

    loadImage(event) {
      const {files} = event.target;
      let theFile = files[0];
      if (files && theFile) {
        if (this.cropperImageSrc) {
          URL.revokeObjectURL(this.cropperImageSrc)
        }

        const blob = URL.createObjectURL(theFile);
        const reader = new FileReader();
        reader.onload = (e) => {
          this.cropperImageSrc = blob;
          this.dialogVisible = true;
        };
        reader.readAsArrayBuffer(theFile);
      }
    },

    cropAndUpload() {
      this.uploadLoading = true;
      const {canvas} = this.$refs.cropper.getResult();
      let _this = this;
      return canvas.toBlob(function (blob) {
        let theImage = new File([blob], `${uuid.generate()}.jpeg`, {type: 'image/jpeg'});

        let compressionType = {
          VERY_HIGH: 1.5,
          HIGH: 0.8,
          MEDIUM: 0.3,
          LOW: 0.15
        };

        let compressOptions = {
          maxSizeMB: compressionType[_this.compressType],
        };

        if (theImage.size < compressOptions.maxSizeMB * 1000 * 1024) {
          return _this.uploadImage(theImage);
        }

        return import(/* webpackChunkName: "browser-image-compression" */ 'browser-image-compression').then(({default: _}) => {
          return _(theImage, compressOptions).then((compressedImage) => {
            return _this.uploadImage(compressedImage);
          });
        });
      }, 'image/jpeg', 1);
    },

    uploadImage(image) {
      return getOssToken(this.ossRequest).then(token => {
        return createOssClient(token).then(client => {
          let key = `${token.folder}/${image.name}`;
          return client.put(key, image).then(result => {
            let uploadedImage = {
              id: uuid.generate(),
              name: image.name,
              fileUrl: result.url,
              ossKey: key,
              type: 'image/jpeg',
              size: image.size,
            };
            this.$emit('input', uploadedImage);
            this.$emit('uploaded', uploadedImage);
            this.dialogVisible = false;
          });
        });
      }).finally(() => {
        this.uploadLoading = false;
      });
    },

    deleteImage() {
      return this.$confirm(`确认删除？`, '提示', {
        confirmButtonText: '是的，删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ossKey = this.value.ossKey;
        this.$emit('input', null);
        this.$emit('deleted');

        //由前端直接删除OSS上的资源，如果不删除请注释掉
        // if (ossKey) {
        //   getOssToken(this.ossRequest).then(token => {
        //     createOssClient(token).then(client => {
        //       client.delete(ossKey);
        //     });
        //   });
        // }
        this.dialogVisible = false;
      });
    },

    cancelCrop() {
      this.dialogVisible = false;
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.theImage {
  width: 100%;
  margin-bottom: 5px;
}

.circleImage {
  border-radius: 50%;
}

.fileInput {
  display: none;
}

.elDialog {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  width: 100%;
  min-height: 100%;
}

.cropper {
  margin: auto;
  max-height: 500px;
}

.circlePreview {
  border: dashed 1px rgba(255, 255, 255, 0.8);
}

.footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.footerButton {
  margin-right: 20px;
  margin-left: 20px;
  width: $dialogButtonWidth;
}

@media (min-width: $mobileScreenBreakpoint) {
  .elDialog {
    margin-top: 10vh !important;
    margin-bottom: 50px !important;
    height: auto;
    width: 600px;
    min-height: auto;
  }

  .cropper {
    min-width: 560px;
    min-height: 400px;
    max-height: 600px;
  }
}
</style>

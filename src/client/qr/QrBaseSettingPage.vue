<template>
  <div v-if="loaded" :class="$style.wrapper">
    <div :class="$style.title">基本设置</div>
    <div :class="$style.content">
      <el-form ref="theForm"
               :hide-required-asterisk="true"
               :model="theModel"
               :rules="rules"
               label-position="top"
               @submit.native.prevent>

        <el-form-item ref="qr-name" label="名称" prop="name">
          <el-input v-model="theModel.name"
                    :maxlength="50"
                    :spellcheck="false">
          </el-input>
        </el-form-item>

        <el-form-item v-if="isQrIntroductionEnabled" ref="qr-description" prop="description">
          <div slot="label">
            简介
            <i :class="$style.markdownIcon"
               class="majoricon i-edit-square"
               title="在Markdown编辑器中打开"
               @click="markdownDialogVisible=true"></i>
          </div>
          <el-input v-model="theModel.description"
                    :maxlength="50000"
                    rows="3"
                    type="textarea">
          </el-input>
        </el-form-item>

        <el-form-item v-if="isHomePageHeaderImageReplaceable" ref="qr-header-image" label="首页图片" prop="headerImage">
          <SingleFileUploader v-if="headerImageCropType === 'NO_CROP'"
                              v-model="theModel.headerImage"
                              :class="$style.headerImageUploader"
                              :dnd="!isInMobile"
                              :dndAreaHeight="50"
                              :imageOnly="true"
                              :ossRequest="qrManageOssRequest"
                              buttonText="上传首页图片"
                              dndAreaText="上传首页图片">
          </SingleFileUploader>

          <CroppedImageUploader v-else
                                v-model="theModel.headerImage"
                                :class="$style.headerImageUploader"
                                :cropType="headerImageCropType"
                                :ossRequest="qrManageOssRequest"
                                type="rectangle"
                                uploadButtonText="上传首页图片">
          </CroppedImageUploader>

        </el-form-item>

        <el-form-item v-for="attribute in manualInputAttributes"
                      :key="attribute.id"
                      :ref="attribute.id"
                      :label="attribute.name+'：'"
                      :prop="`manualAttributeValues.${attribute.id}`"
                      :rules="attribute.valueType === 'TEXT_VALUE'?[ {max: 100, message: '长度不能超过100个字符', trigger: 'change'}]:null">
          <div v-if="attribute.valueType === 'DOUBLE_VALUE'" :class="$style.numberInputRow">
            <el-input-number v-model.number="theModel.manualAttributeValues[attribute.id]"
                             :class="$style.numberInput"
                             :max="10000000"
                             :min="-10000000"
                             :precision="attribute.precision">
            </el-input-number>
            {{ attribute.suffix }}
          </div>
          <el-input v-else
                    v-model="theModel.manualAttributeValues[attribute.id]"
                    :maxlength="100"
                    :spellcheck="false">
          </el-input>
        </el-form-item>

        <el-form-item v-if="isGeolocationEnabled" ref="qr-geolocation" label="定位" prop="geolocation">
          <TiandituGeolocationInput v-model="theModel.geolocation"></TiandituGeolocationInput>
        </el-form-item>

        <el-form-item v-if="isQrCustomIdManualEditable" ref="qr-custom-id" :label="customIdDesignation" prop="customId">
          <el-input v-model.trim="theModel.customId"
                    :maxlength="50"
                    :spellcheck="false">
          </el-input>
        </el-form-item>

        <div :class="$style.buttonArea">
          <el-button :class="$style.aButton"
                     icon="el-icon-close"
                     plain
                     @click="cancel">
            取消
          </el-button>
          <el-button :class="$style.aButton"
                     icon="el-icon-check"
                     type="primary"
                     @click="onSubmit">
            保存
          </el-button>
        </div>
      </el-form>
    </div>

    <DialogedMarkdownInput v-if="!isInMobile"
                           v-model="theModel.description"
                           :oss-request="qrManageOssRequest"
                           :show.sync="markdownDialogVisible"
                           :title="`编辑简介`">
    </DialogedMarkdownInput>
  </div>
</template>

<script>
import {createNamespacedHelpers, mapMutations} from 'vuex';
import qrApi from '@/common/api/qr-api';
import TiandituGeolocationInput from '@/common/components/geolocation/TiandituGeolocationInput';
import PageHeaderContainer from '@/client/qr/PageHeaderContainer';
import {isMobileBrowser} from '@/common/utils/common-utils';
import SingleFileUploader from '@/common/components/SingleFileUploader';

import validations from "@/common/utils/validations";

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  components: {
    TiandituGeolocationInput,
    PageHeaderContainer,
    SingleFileUploader,
    DialogedMarkdownInput: () => import(/* webpackChunkName: "dialoged-markdown-editor" */ '@/common/components/DialogedMarkdownInput'),
    CroppedImageUploader: () => import(/* webpackChunkName: "cropped-image-uploader" */ '@/common/components/CroppedImageUploader'),
  },

  data() {
    return {
      markdownDialogVisible: false,
      loaded: false,
      theModel: {
        name: null,
        description: null,
        headerImage: null,
        manualAttributeValues: {},
        geolocation: null,
        customId: null
      },
      rules: {
        name: [
          {required: true, message: '请输入名称', trigger: 'change'},
          {max: 50, message: '名称长度不能超过50个字符', trigger: 'change'},
        ],
        customId: [
          {max: 50, message: '长度不能超过50个字符', trigger: 'change'},
          {validator: validations.NO_SPACE_RULE, trigger: 'change'}
        ],
      }
    }
  },
  created() {
    return qrApi.fetchQrBaseSetting(this.qrId).then((response) => {
      let theSetting = response.data;
      this.theModel.name = theSetting.name;
      this.theModel.description = theSetting.description;
      this.theModel.headerImage = theSetting.headerImage;
      this.theModel.manualAttributeValues = theSetting.manualAttributeValues;
      this.theModel.geolocation = theSetting.geolocation;
      this.theModel.customId = theSetting.customId;
      this.loaded = true;
    });
  },

  computed: {
    ...clientQrStore.mapGetters([
      'qrId',
      'homePageId',
      'appName',
      'isGeolocationEnabled',
      'manualInputAttributes',
      'isHomePageHeaderImageReplaceable',
      'qrManageOssRequest',
      'headerImageCropType',
      'customIdDesignation',
      'isQrIntroductionEnabled',
      'isQrCustomIdManualEditable'
    ]),

    validations() {
      return validations;
    },

    isInMobile() {
      return isMobileBrowser();
    },
  },
  methods: {
    ...mapMutations(['refreshWholeClient']),
    ...clientQrStore.mapMutations(['updateQrBaseSetting']),

    onSubmit() {
      return this.$refs['theForm'].validate().then(() => {
        return qrApi.updateQrBaseSetting(this.qrId, this.theModel).then(() => {
          this.updateQrBaseSetting(this.theModel);
          this.$router.replace({name: 'new-submission', params: {pageId: this.homePageId}});
          this.$message({
            type: 'success',
            message: `基本信息更新成功。`,
            center: true,
            duration: 1000,
          });
          // this.refreshWholeClient();//启用这个用于即时更新自定义属性值（比如定位），但是有可能还未来得及更新页面就已经刷新了，所以暂时注释掉
        });
      });
    },

    cancel() {
      this.$router.replace({name: 'new-submission', params: {pageId: this.homePageId}});
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
  min-height: 100%;
  overflow-y: auto;
  margin-right: auto;
  margin-left: auto;
  z-index: $clientPageZIndex;
  position: relative;
  box-shadow: $pageShadow;
  background-color: white;

  :global {
    .el-form-item__label {
      margin-top: 10px;
      line-height: normal;
      font-weight: 500;
      padding-bottom: 5px !important;
    }
  }
}

.title {
  font-size: 18px;
  font-weight: 500;
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
}

.content {
  padding-right: $narrowPageVPadding;
  padding-left: $narrowPageVPadding;
}

.numberInputRow {
  display: flex;
  align-items: center;
  justify-content: center;
}

.numberInput {
  width: 100%;
  flex-grow: 1;
  margin-right: 2px;

  :global {
    .el-input__inner {
      text-align: left;
      padding-left: 8px !important;
    }

    .el-input-number__increase {
      display: none;
    }

    .el-input-number__decrease {
      display: none;
    }
  }
}

.buttonArea {
  padding-top: 20px;
  padding-bottom: 50px;
  text-align: center;
}

.aButton {
  width: $pageButtonWidth;
}

.markdownIcon {
  display: none;
}

@media (min-width: $mobileScreenBreakpoint), print {
  .wrapper {
    width: $mobileScreenBreakpoint;
    min-height: auto;
  }

  .content {
    padding-right: $widePageVPadding;
    padding-left: $widePageVPadding;
  }

  .headerImageUploader {
    width: $maxControlContentWidth;
  }

  .markdownIcon {
    cursor: pointer;
    display: inline;
    font-weight: normal;
  }

  .markdownIcon:hover {
    color: $primaryThemeColor;
  }
}


</style>

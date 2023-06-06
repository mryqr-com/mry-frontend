<template>
  <div v-if="localSetting" :class="$style.wrapper">
    <PanelContent helpUrl="//docs.mryqr.com/app-design/plate-template-setting" title="码牌基本设置">
      <div class="singleLineTitle marginTop10">码牌尺寸(宽 x 高)</div>
      <el-select v-model="localSetting.size"
                 class="settingMarginBottom block"
                 size="mini"
                 title="码牌尺寸"
                 @change="onSizeChanged">
        <el-option v-for="aSize in sizeTypes"
                   :key="aSize.key"
                   :label="sizeTypeLabel(aSize)"
                   :value="aSize.key">
        </el-option>
      </el-select>

      <template v-if="localSetting.size === 'CUSTOM'">
        <div class="keyValueSettingContainer">
          宽度(mm)：
          <el-input-number v-model="localWidthInMM"
                           :max="150"
                           :min="40"
                           :step="1"
                           :stepStrictly="true"
                           controls-position="right"
                           size="mini"
                           title="码牌宽度"
                           @change="onCustomWidthChange">
          </el-input-number>
        </div>

        <div class="keyValueSettingContainer">
          高度(mm)：
          <el-input-number v-model="localHeightInMM"
                           :max="150"
                           :min="40"
                           :step="1"
                           :stepStrictly="true"
                           controls-position="right"
                           size="mini"
                           title="码牌高度"
                           @change="onCustomHeightChange">
          </el-input-number>
        </div>
      </template>

      <div class="singleLineTitle marginTop10">背景图片</div>
      <SingleFileUploader v-model="localSetting.backgroundImage"
                          :dnd="true"
                          :dndAreaHeight="36"
                          :imageOnly="true"
                          :ossRequest="appEditOssRequest"
                          class="settingMarginBottom"
                          dndAreaText="上传背景图片"
                          title="码牌的背景图片">
      </SingleFileUploader>

      <div class="keyValueSettingContainer">
        圆角半径：
        <el-input-number v-model="localSetting.borderRadius"
                         :max="100"
                         :min="0"
                         :step="1"
                         :stepStrictly="true"
                         controls-position="right"
                         size="mini"
                         title="码牌圆角半径">
        </el-input-number>
      </div>

      <div class="keyValueSettingContainer">
        内边距：
        <el-input-number v-model="localSetting.padding"
                         :max="100"
                         :min="0"
                         :step="1"
                         :stepStrictly="true"
                         controls-position="right"
                         size="mini"
                         title="码牌内边距">
        </el-input-number>
      </div>

      <div class="keyValueSettingContainer">
        背景色：
        <MryColorPicker v-model="localSetting.backgroundColor" title="码牌背景色"></MryColorPicker>
      </div>

      <div v-if="isMryAppTemplateManageTenant" :class="$style.templatesSection">
        <el-button :class="$style.templateLibraryButton"
                   :disabled="apiInProgress"
                   size="medium"
                   @click="createTemplate">
          加入码牌模板库
        </el-button>
        <div :class="$style.templateTip">
          制作模板时，竖版统一用60*90mm，横版统一用70*50mm
        </div>
      </div>
    </PanelContent>
  </div>
</template>

<script>
import {createNamespacedHelpers, mapGetters} from "vuex";
import {cloneDeep, isEqual} from 'lodash-es';
import ACTIONS from "@/console/app-edit/store/app-edit-actions";
import plateSizeTypes from '@/common/utils/plate-size-types';
import eventBus from "@/common/utils/event-bus";
import plateTemplateApi from '@/common/api/plate-template-api';
import SingleFileUploader from '@/common/components/SingleFileUploader';
import {PLATE_IMAGE_SCALE} from "@/common/utils/common-utils";

const appEditStore = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  components: {
    SingleFileUploader,
  },

  data() {
    return {
      localSetting: null,
      apiInProgress: false,
      localWidthInMM: 0,
      localHeightInMM: 0,
    }
  },

  mounted() {
    this.localSetting = cloneDeep(this.theSetting);
  },

  watch: {
    theSetting: {
      handler: function () {
        this.localSetting = cloneDeep(this.theSetting);
      },
      deep: true
    },

    localSetting: {
      handler: function () {
        if (!isEqual(this.localWidthInMM, this.localSetting.width / PLATE_IMAGE_SCALE)) {
          this.localWidthInMM = this.localSetting.width / PLATE_IMAGE_SCALE;
        }

        if (!isEqual(this.localHeightInMM, this.localSetting.height / PLATE_IMAGE_SCALE)) {
          this.localHeightInMM = this.localSetting.height / PLATE_IMAGE_SCALE;
        }

        if (!isEqual(this.localSetting, this.theSetting)) {
          this.theSetting = this.localSetting;
        }
      },
      deep: true
    },

  },

  computed: {
    ...mapGetters(['isMryAppTemplateManageTenant']),
    ...appEditStore.mapGetters([
      'plateSetting',
      'plateConfig',
      'appId',
      'appEditOssRequest',
    ]),

    sizeTypes() {
      return plateSizeTypes;
    },

    theSetting: {
      get() {
        return this.plateConfig;
      },

      set(setting) {
        this[ACTIONS.UPDATE_PLATE_CONFIG](setting);
      }
    }
  },

  methods: {
    ...appEditStore.mapActions([
      ACTIONS.UPDATE_PLATE_CONFIG,
    ]),

    sizeTypeLabel(aSize) {
      if (aSize.key === 'CUSTOM') {
        return aSize.name;
      }

      let orientation = aSize.width > aSize.height ? '横版' : '竖版';
      orientation = aSize.width === aSize.height ? '方版' : orientation;

      return `${aSize.name}（${orientation}）`;
    },

    onSizeChanged(size) {
      if (size !== 'CUSTOM') {
        this.localSetting.width = plateSizeTypes.find(aSize => aSize.key === size).width;
        this.localSetting.height = plateSizeTypes.find(aSize => aSize.key === size).height;
      }

      eventBus.$emit('plateSizeTypeChanged');
    },

    onCustomWidthChange(number) {
      this.localSetting.width = number * PLATE_IMAGE_SCALE;
      eventBus.$emit('plateCustomSizeChanged');
    },

    onCustomHeightChange(number) {
      this.localSetting.height = number * PLATE_IMAGE_SCALE;
      eventBus.$emit('plateCustomSizeChanged');
    },

    createTemplate() {
      let command = {
        appId: this.appId,
        plateSetting: this.plateSetting,
      }

      this.apiInProgress = true;
      return plateTemplateApi.createPlateTemplate(command).then(() => {
        this.$message({
          type: 'success',
          message: `成功添加到码牌模板库。`,
          center: true
        });
      }).finally(() => {
        this.apiInProgress = false;
      });
    },

  }

}
</script>

<style lang="scss" module>
.wrapper {
}

.templatesSection {
  margin-top: 30px;
}

.templateLibraryButton {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  display: block;
  margin-left: 0 !important;
}

.templateTip {
  margin-top: 15px;
  line-height: 1.3em;
}
</style>

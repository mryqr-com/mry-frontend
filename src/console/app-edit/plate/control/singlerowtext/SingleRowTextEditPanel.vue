<template>
  <div :class="$style.wrapper">
    <EditTitle>基本设置</EditTitle>

    <TextValueInput v-model="value.textValue" class="marginTop10"></TextValueInput>

    <div class="keyValueSettingContainer">
      字体：
      <el-popover placement="bottom"
                  trigger="click"
                  width="300">
        <el-button slot="reference"
                   :class="$style.commonInput"
                   class="rightInputWidth"
                   size="mini"
                   title="设置字体"
                   type="plain">
          设置字体...
        </el-button>
        <FontStyleInput v-model="value.fontStyle"></FontStyleInput>
      </el-popover>
    </div>

    <div class="keyValueSettingContainer">
      对齐方式：
      <el-radio-group v-model="value.alignType"
                      size="mini">
        <el-radio-button label="JUSTIFY" title="左对齐">
          <icon icon="align-left"/>
        </el-radio-button>
        <el-radio-button label="CENTER" title="居中">
          <icon icon="align-center"/>
        </el-radio-button>
        <el-radio-button label="RIGHT" title="右对齐">
          <icon icon="align-right"/>
        </el-radio-button>
      </el-radio-group>
    </div>

    <div class="keyValueSettingContainer">
      高度：
      <el-input-number v-model="value.height"
                       :class="$style.commonInput"
                       :max="500"
                       :min="20"
                       :step="1"
                       :stepStrictly="true"
                       controls-position="right"
                       size="mini"
                       title="高度">
      </el-input-number>
    </div>

    <div class="keyValueSettingContainer">
      文本间距：
      <el-input-number v-model="value.letterSpacing"
                       :class="$style.commonInput"
                       :max="50"
                       :min="0"
                       :step="1"
                       :stepStrictly="true"
                       controls-position="right"
                       size="mini"
                       title="文本间距">
      </el-input-number>
    </div>

    <div class="singleLineTitle marginTop15">Logo图片</div>
    <SingleFileUploader v-model="value.logo"
                        :dnd="true"
                        :dndAreaHeight="36"
                        :imageOnly="true"
                        :ossRequest="appEditOssRequest"
                        class="settingMarginBottom"
                        dndAreaText="上传Logo图片"
                        title="Logo图片">
    </SingleFileUploader>

    <div v-if="value.logo" class="keyValueSettingContainer">
      Logo尺寸：
      <el-input-number v-model="value.logoHeight"
                       :class="$style.commonInput"
                       :max="100"
                       :min="10"
                       :step="1"
                       :stepStrictly="true"
                       controls-position="right"
                       size="mini"
                       title="Logo尺寸">
      </el-input-number>
    </div>

    <div v-if="value.logo" class="keyValueSettingContainer">
      Logo离文本距离：
      <el-input-number v-model="value.logoTextSpacing"
                       :class="$style.commonInput"
                       :max="100"
                       :min="0"
                       :step="1"
                       :stepStrictly="true"
                       controls-position="right"
                       size="mini"
                       title="Logo离文本距离">
      </el-input-number>
    </div>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import TextValueInput from '@/console/app-edit/plate/TextValueInput';
import SingleFileUploader from '@/common/components/SingleFileUploader';

const appEditStore = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
  },

  components: {
    TextValueInput,
    SingleFileUploader,
  },

  computed: {
    ...appEditStore.mapGetters(['appEditOssRequest'])
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.commonInput {
  width: 125.5px !important; //为了迁就对齐方式控件
}
</style>

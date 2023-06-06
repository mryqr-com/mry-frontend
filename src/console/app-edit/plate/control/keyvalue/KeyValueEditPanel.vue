<template>
  <div :class="$style.wrapper">
    <EditTitle>内容设置</EditTitle>
    <NamedTextValuesEditor v-model="value.textValues"></NamedTextValuesEditor>

    <div class="keyValueSettingContainer marginTop10">
      字体：
      <el-popover placement="bottom"
                  trigger="click"
                  width="300">
        <el-button slot="reference"
                   :class="$style.commonInput"
                   class="rightInputWidth"
                   size="mini"
                   title="字体"
                   type="plain">
          设置字体...
        </el-button>
        <FontStyleInput v-model="value.fontStyle"></FontStyleInput>
      </el-popover>
    </div>

    <div class="keyValueSettingContainer">
      行高：
      <el-input-number v-model="value.lineHeight"
                       :class="$style.commonInput"
                       :max="200"
                       :min="20"
                       :step="1"
                       :stepStrictly="true"
                       controls-position="right"
                       size="mini"
                       title="行高">
      </el-input-number>
    </div>

    <div class="keyValueSettingContainer">
      文本对齐方式：
      <el-radio-group v-model="value.textHorizontalAlignType"
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

    <EditTitle>二维码样式</EditTitle>
    <el-checkbox v-model="value.qrEnabled" class="settingMarginBottom block" size="mini" title="是否显示二维码">显示二维码
    </el-checkbox>

    <template v-if="value.qrEnabled">
      <QrImageSettingInput v-model="value.qrImageSetting"></QrImageSettingInput>
      <div class="singleLineTitle" title="垂直对齐方式">垂直对齐</div>
      <el-radio-group v-model="value.verticalAlignType"
                      class="settingMarginBottom"
                      size="mini">
        <el-radio-button label="TOP" title="顶部对齐">顶部对齐</el-radio-button>
        <el-radio-button label="MIDDLE" title="居中对齐">居中对齐</el-radio-button>
        <el-radio-button label="BOTTOM" title="底部对齐">底部对齐</el-radio-button>
      </el-radio-group>

      <div class="singleLineTitle" title="水平位置">水平位置</div>
      <el-radio-group v-model="value.horizontalPositionType"
                      class="settingMarginBottom"
                      size="mini">
        <el-radio-button label="LEFT" title="文本左侧">文本左侧</el-radio-button>
        <el-radio-button label="RIGHT" title="文本左侧">文本右侧</el-radio-button>
      </el-radio-group>

      <div class="keyValueSettingContainer">
        与文本间距：
        <el-input-number v-model="value.horizontalGutter"
                         :class="$style.commonInput"
                         :max="100"
                         :min="0"
                         :step="1"
                         :stepStrictly="true"
                         controls-position="right"
                         size="mini"
                         title="与文本间距">
        </el-input-number>
      </div>
    </template>
  </div>
</template>

<script>
import QrImageSettingInput from '@/console/app-edit/plate/QrImageSettingInput';
import NamedTextValuesEditor from '@/console/app-edit/plate/NamedTextValuesEditor';

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
  },

  components: {
    QrImageSettingInput,
    NamedTextValuesEditor,
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

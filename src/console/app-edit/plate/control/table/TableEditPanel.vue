<template>
  <div :class="$style.wrapper">
    <EditTitle>单元格内容</EditTitle>
    <NamedTextValuesEditor v-model="value.contentTextValues"></NamedTextValuesEditor>

    <EditTitle>单元格样式</EditTitle>
    <div class="keyValueSettingContainer">
      单元格字体：
      <el-popover placement="bottom"
                  trigger="click"
                  width="300">
        <el-button slot="reference"
                   :class="$style.commonInput"
                   class="rightInputWidth"
                   size="mini"
                   title="设置内容字体"
                   type="plain">
          设置字体...
        </el-button>
        <FontStyleInput v-model="value.contentFontStyle"></FontStyleInput>
      </el-popover>
    </div>

    <div class="keyValueSettingContainer">
      单元格高度：
      <el-input-number v-model="value.cellHeight"
                       :class="$style.commonInput"
                       :max="200"
                       :min="20"
                       :step="1"
                       :stepStrictly="true"
                       controls-position="right"
                       size="mini"
                       title="单元格高度">
      </el-input-number>
    </div>

    <div class="keyValueSettingContainer">
      边框宽度：
      <el-input-number v-model="value.borderWidth"
                       :class="$style.commonInput"
                       :max="5"
                       :min="1"
                       :step="1"
                       :stepStrictly="true"
                       controls-position="right"
                       size="mini"
                       title="边框宽度">
      </el-input-number>
    </div>

    <div class="keyValueSettingContainer">
      边框颜色：
      <MryColorPicker v-model="value.borderColor" title="边框颜色"></MryColorPicker>
    </div>

    <EditTitle>表头设置</EditTitle>
    <el-checkbox v-model="value.headerEnabled" class="settingMarginBottom block" size="mini" title="是否显示表头">显示表头
    </el-checkbox>
    <template v-if="value.headerEnabled">
      <TextValueInput v-model="value.headerTextValue"></TextValueInput>

      <div class="keyValueSettingContainer">
        表头字体：
        <el-popover placement="bottom"
                    trigger="click"
                    width="300">
          <el-button slot="reference"
                     :class="$style.commonInput"
                     class="rightInputWidth"
                     size="mini"
                     title="设置表头字体"
                     type="plain">
            设置字体...
          </el-button>
          <FontStyleInput v-model="value.headerFontStyle"></FontStyleInput>
        </el-popover>
      </div>

      <div class="keyValueSettingContainer">
        表头高度：
        <el-input-number v-model="value.headerHeight"
                         :class="$style.commonInput"
                         :max="200"
                         :min="20"
                         :step="1"
                         :stepStrictly="true"
                         controls-position="right"
                         size="mini"
                         title="表头高度">
        </el-input-number>
      </div>

      <div class="keyValueSettingContainer">
        对齐方式：
        <el-radio-group v-model="value.headerAlignType"
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
    </template>

    <EditTitle>二维码样式</EditTitle>
    <el-checkbox v-model="value.qrEnabled" class="settingMarginBottom block" size="mini" title="是否显示二维码">显示二维码
    </el-checkbox>

    <template v-if="value.qrEnabled">
      <QrImageSettingInput v-model="value.qrImageSetting"></QrImageSettingInput>

      <div class="keyValueSettingContainer">
        占用单元格行数：
        <el-input-number v-model="value.qrRows"
                         :class="$style.commonInput"
                         :max="10"
                         :min="1"
                         :step="1"
                         :stepStrictly="true"
                         controls-position="right"
                         size="mini"
                         title="二维码所占用的单元格行数">
        </el-input-number>
      </div>
    </template>
  </div>
</template>

<script>
import TextValueInput from '@/console/app-edit/plate/TextValueInput';
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
    TextValueInput,
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

<template>
  <div :class="$style.wrapper">
    <div class="singleLineTitle">字体</div>
    <FontStyleInput v-model="value.fontStyle" class="marginBottom5"></FontStyleInput>

    <div class="singleLineTitle">边框</div>
    <BorderInput v-model="value.border"
                 class="settingMarginBottom">
    </BorderInput>

    <div class="singleLineTitle">边框阴影</div>
    <ShadowInput v-model="value.shadow"
                 class="settingMarginBottom">
    </ShadowInput>

    <div class="keyValueSettingContainer">
      背景色：
      <MryColorPicker v-model="value.backgroundColor" title="背景色"></MryColorPicker>
    </div>

    <div class="keyValueSettingContainer">
      垂直内边距：
      <el-input-number v-model="value.vPadding"
                       :max="100"
                       :min="0"
                       :step="1"
                       :stepStrictly="true"
                       controls-position="right"
                       size="mini">
      </el-input-number>
    </div>

    <div class="keyValueSettingContainer">
      圆角半径：
      <el-input-number v-model="value.borderRadius"
                       :max="100"
                       :min="0"
                       :step="1"
                       :stepStrictly="true"
                       controls-position="right"
                       size="mini">
      </el-input-number>
    </div>

  </div>
</template>

<script>
import {range} from 'lodash-es';
import fonts from '@/common/utils/fonts';

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
  },

  computed: {
    fontRange() {
      return range(10, 61);
    },

    fontFamilies() {
      return fonts;
    },

  },

}
</script>

<style lang="scss" module>
.wrapper {
  :global {
    .el-checkbox__inner {
      display: none;
    }

    .el-checkbox__input {
      display: none;
    }
  }
}

</style>

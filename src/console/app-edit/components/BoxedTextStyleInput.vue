<template>
  <div :class="$style.wrapper">
    <div class="singleLineTitle" title="设置字体">字体</div>
    <FontStyleInput v-model="value.fontStyle" class="marginBottom5"></FontStyleInput>
    <div :class="$style.row" class="settingMarginBottom">
      <el-radio-group v-model="value.alignType" :class="$style.alignRadio" class="marginRight5" size="mini">
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

      <el-select v-model="value.lineHeight"
                 class="marginRight5"
                 placeholder="请选择行高"
                 size="mini"
                 title="行高">
        <el-option v-for="aHeight in lineHeightRange"
                   :key="aHeight"
                   :label="aHeight"
                   :value="aHeight">
        </el-option>
      </el-select>

      <div :class="$style.textCheckbox" class="marginRight5">
        <el-checkbox v-model="value.fullWidth"
                     border
                     label="W"
                     size="mini"
                     title="宽度占满整行">
        </el-checkbox>
      </div>

      <MryColorPicker v-model="value.backgroundColor" title="背景色"></MryColorPicker>
    </div>

    <div class="singleLineTitle" title="设置边框">边框</div>
    <BorderInput v-model="value.border"
                 class="settingMarginBottom">
    </BorderInput>

    <div class="singleLineTitle" title="设置边框阴影">边框阴影</div>
    <ShadowInput v-model="value.shadow"
                 class="settingMarginBottom">
    </ShadowInput>

    <div class="keyValueSettingContainer" title="垂直内边距">
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

    <div class="keyValueSettingContainer" title="水平内边距">
      水平内边距：
      <el-input-number v-model="value.hPadding"
                       :max="100"
                       :min="0"
                       :step="1"
                       :stepStrictly="true"
                       controls-position="right"
                       size="mini">
      </el-input-number>
    </div>

    <div class="keyValueSettingContainer" title="顶部外边距">
      顶部外边距：
      <el-input-number v-model="value.topMargin"
                       :max="100"
                       :min="0"
                       :step="1"
                       :stepStrictly="true"
                       controls-position="right"
                       size="mini">
      </el-input-number>
    </div>

    <div class="keyValueSettingContainer" title="底部外边距">
      底部外边距：
      <el-input-number v-model="value.bottomMargin"
                       :max="100"
                       :min="0"
                       :step="1"
                       :stepStrictly="true"
                       controls-position="right"
                       size="mini">
      </el-input-number>
    </div>

    <div class="keyValueSettingContainer" title="圆角半径">
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

    lineHeightRange() {
      return [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2]
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

.row {
  display: flex;
  justify-content: space-between;
}

.alignRadio {
  flex-shrink: 0;
}

.textCheckbox {
  :global {
    .el-checkbox--mini {
      padding: 0 !important;
      min-width: 28px;
      display: table;
      text-align: center;
    }

    .el-checkbox__label {
      padding: 0;
      display: table-cell;
      vertical-align: middle;
      font-size: 14px !important;
      font-weight: bold;
    }
  }
}

</style>

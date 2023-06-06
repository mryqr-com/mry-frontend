<template>
  <div :class="$style.wrapper">
    <EditTitle>引用页面</EditTitle>
    <el-select v-model="value.pageId"
               class="settingMarginBottom block"
               placeholder="请选择需要引用的表单页面"
               size="mini"
               title="设置需要引用的页面，控件展示时将采用表格形式显示所引用页面的最近一次提交">
      <el-option
          v-for="page in allPageSummaries"
          :key="page.id"
          :label="page.name"
          :value="page.id">
      </el-option>
    </el-select>

    <EditTitle>基本设置</EditTitle>
    <div class="keyValueSettingContainer">
      显示类型：
      <el-select v-model="value.styleType"
                 class="rightInputWidth"
                 placeholder="请选择显示类型"
                 size="mini"
                 title="显示类型">
        <el-option
            v-for="styleType in styleTypes"
            :key="styleType.type"
            :label="styleType.text"
            :value="styleType.type">
        </el-option>
      </el-select>
    </div>

    <template v-if="value.styleType === 'HORIZONTAL_TABLE'">
      <div class="keyValueSettingContainer">
        字段名样式：
        <el-popover placement="bottom"
                    trigger="click"
                    width="300">
          <el-button slot="reference" class="rightInputWidth" size="mini" title="设置字段名称样式" type="plain">字段名样式...
          </el-button>
          <div class="singleLineTitle">字体</div>
          <FontStyleInput v-model="value.keyFontStyle"></FontStyleInput>
        </el-popover>
      </div>

      <div class="keyValueSettingContainer">
        字段值样式：
        <el-popover placement="bottom"
                    trigger="click"
                    width="300">
          <el-button slot="reference" class="rightInputWidth" size="mini" title="字段值样式" type="plain">字段值样式...
          </el-button>
          <div class="singleLineTitle">字体</div>
          <FontStyleInput v-model="value.valueFontStyle"></FontStyleInput>
        </el-popover>
      </div>

      <el-checkbox v-model="value.stripped"
                   class="settingMarginBottom block"
                   size="mini"
                   title="表格是否显示条纹">
        显示条纹
      </el-checkbox>

      <el-checkbox v-model="value.showHeader"
                   class="settingMarginBottom block"
                   size="mini"
                   title="表格是否显示表头">
        显示表头
      </el-checkbox>

      <template v-if="value.showHeader">
        <div class="singleLineTitle">表头名称</div>
        <el-input v-model="value.headerText"
                  :maxlength="50"
                  :spellcheck="false"
                  class="settingMarginBottom"
                  size="mini"
                  title="表头名称">
        </el-input>

        <div class="keyValueSettingContainer">
          表头样式：
          <el-popover placement="bottom"
                      trigger="click"
                      width="300">
            <el-button slot="reference" class="rightInputWidth" size="mini" title="表头样式" type="plain">表头样式...
            </el-button>
            <div class="singleLineTitle">字体</div>
            <FontStyleInput v-model="value.headerFontStyle"></FontStyleInput>
          </el-popover>
        </div>
      </template>
    </template>

    <template v-if="value.styleType === 'VERTICAL_TABLE'">
      <div class="keyValueSettingContainer">
        字段名样式：
        <el-popover placement="bottom"
                    trigger="click"
                    width="300">
          <el-button slot="reference" class="rightInputWidth" size="mini" title="字段名样式" type="plain">字段名样式...
          </el-button>
          <BoxedTextStyleInput v-model="value.verticalKeyStyle"></BoxedTextStyleInput>
        </el-popover>
      </div>

      <div class="keyValueSettingContainer">
        字段值样式：
        <el-popover placement="bottom"
                    trigger="click"
                    width="300">
          <el-button slot="reference" class="rightInputWidth" size="mini" title="字段值样式" type="plain">字段值样式...
          </el-button>
          <BoxedTextStyleInput v-model="value.verticalValueStyle"></BoxedTextStyleInput>
        </el-popover>
      </div>

      <div class="keyValueSettingContainer">
        外观样式：
        <el-popover placement="bottom"
                    trigger="click"
                    width="300">
          <el-button slot="reference" class="rightInputWidth" size="mini" title="外观样式" type="plain">外观样式...</el-button>
          <AppearanceStyleInput v-model="value.appearanceStyle"></AppearanceStyleInput>
        </el-popover>
      </div>
    </template>

    <el-checkbox v-model="value.hideControlIfNoData" class="settingMarginBottom block" size="mini" title="无数据时隐藏控件">
      无数据时隐藏控件
    </el-checkbox>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";

const {mapGetters} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
  },

  computed: {
    ...mapGetters([
      'allPageSummaries',
    ]),

    styleTypes() {
      return [
        {
          type: 'HORIZONTAL_TABLE',
          text: '横向排列',
        },
        {
          type: 'VERTICAL_TABLE',
          text: '竖向排列',
        }
      ]
    }
  },
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>

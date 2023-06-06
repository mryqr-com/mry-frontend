<template>
  <div :class="$style.wrapper">
    <EditTitle>属性项</EditTitle>

    <div v-if="allAttributes.length === 0" :class="$style.noAttributeNote">
      尚无可选自定义属性，
      <router-link :class="$style.newAttribute" :to="{name:'app-edit-attributes'}" tag="span">新建自定义属性</router-link>
    </div>

    <el-select v-else
               ref="attributesSelect"
               v-model="value.attributeIds"
               :class="$style.selectInput"
               :multiple-limit="20"
               filterable
               multiple
               placeholder="请选择属性项"
               size="mini"
               title="设置需要显示的属性项（多选）">
      <el-option
          v-for="attribute in allAttributes"
          :key="attribute.id"
          :label="attribute.name"
          :value="attribute.id">
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
        属性名样式：
        <el-popover placement="bottom"
                    trigger="click"
                    width="300">
          <el-button slot="reference" class="rightInputWidth" size="mini" title="属性名称样式设置" type="plain">属性名样式...
          </el-button>
          <div class="singleLineTitle">字体</div>
          <FontStyleInput v-model="value.keyFontStyle"></FontStyleInput>
        </el-popover>
      </div>

      <div class="keyValueSettingContainer">
        属性值样式：
        <el-popover placement="bottom"
                    trigger="click"
                    width="300">
          <el-button slot="reference" class="rightInputWidth" size="mini" title="属性值样式设置" type="plain">属性值样式...
          </el-button>
          <div class="singleLineTitle" title="设置属性值字体">字体</div>
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
        属性名样式：
        <el-popover placement="bottom"
                    trigger="click"
                    width="300">
          <el-button slot="reference" class="rightInputWidth" size="mini" title="属性名样式" type="plain">属性名样式...
          </el-button>
          <BoxedTextStyleInput v-model="value.verticalKeyStyle"></BoxedTextStyleInput>
        </el-popover>
      </div>

      <div class="keyValueSettingContainer">
        属性值样式：
        <el-popover placement="bottom"
                    trigger="click"
                    width="300">
          <el-button slot="reference" class="rightInputWidth" size="mini" title="属性值样式" type="plain">属性值样式...
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
          <AppearanceStyleInput :value="value.appearanceStyle"></AppearanceStyleInput>
        </el-popover>
      </div>
    </template>

    <el-checkbox v-model="value.hideControlIfNoData" class="settingMarginBottom block" size="mini" title="无数据时隐藏控件">
      无数据时隐藏控件
    </el-checkbox>

  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';

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
      'allAttributes',
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

.noAttributeNote {
  margin-top: 10px;
  font-style: italic;
  font-size: 13px;
}

.newAttribute {
  color: $primaryThemeColor;
  text-decoration: underline;
  cursor: pointer;
}

.selectInput {
  width: 100%;
}

</style>

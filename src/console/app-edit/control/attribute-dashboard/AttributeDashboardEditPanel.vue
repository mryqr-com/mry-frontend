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
    <div class="keyValueSettingContainer" title="每行显示表盘数量">
      每行显示数量：
      <el-input-number v-model="value.itemsPerLine"
                       :max="4"
                       :min="1"
                       :stepStrictly="true"
                       class="rightInputWidth"
                       controls-position="right"
                       size="mini">
      </el-input-number>
    </div>

    <div class="keyValueSettingContainer" title="表盘间距">
      间距：
      <el-input-number v-model="value.gutter"
                       :max="50"
                       :min="0"
                       :stepStrictly="true"
                       class="rightInputWidth"
                       controls-position="right"
                       size="mini">
      </el-input-number>
    </div>

    <div class="keyValueSettingContainer" title="表盘的抬头位置">抬头位置：
      <el-radio-group v-model="value.itemTitlePosition" size="mini">
        <el-radio-button label="TOP">顶部
        </el-radio-button>
        <el-radio-button label="BOTTOM">底部
        </el-radio-button>
      </el-radio-group>
    </div>

    <div class="keyValueSettingContainer" title="表盘的抬头样式">
      抬头样式：
      <el-popover placement="bottom"
                  trigger="click"
                  width="300">
        <el-button slot="reference" class="rightInputWidth" size="mini" type="plain">抬头样式...</el-button>
        <BoxedTextStyleInput v-model="value.titleStyle"></BoxedTextStyleInput>
      </el-popover>
    </div>

    <div class="keyValueSettingContainer" title="填值样式">
      填值样式：
      <el-popover placement="bottom"
                  trigger="click"
                  width="300">
        <el-button slot="reference" class="rightInputWidth" size="mini" type="plain">填值样式...</el-button>
        <BoxedTextStyleInput v-model="value.contentStyle"></BoxedTextStyleInput>
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
  line-height: 1.3em;
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

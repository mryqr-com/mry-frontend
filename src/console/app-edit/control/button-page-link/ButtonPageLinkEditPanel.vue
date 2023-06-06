<template>
  <div :class="$style.wrapper">
    <EditTitle>链接项</EditTitle>
    <PageLinkEditor v-model="value.links"
                    :maxLinks="20"
                    :maxTextLength="40"
                    :showButtonText="true"
                    :showDescription="isCard"
                    :showImage="isCard"
                    :showName="isCard">
    </PageLinkEditor>

    <EditTitle>基本设置</EditTitle>
    <el-checkbox v-model="value.showBasedOnPermission"
                 class="settingMarginBottom block"
                 size="mini"
                 title="勾选时，如果用户对某按钮所链接的内部页面无权限，那么该按钮将不予显示，该设置项对于外部链接无效">
      根据链接页面所需权限显示或隐藏按钮
    </el-checkbox>

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

    <template v-if="isCard">
      <div class="keyValueSettingContainer">
        名称样式：
        <el-popover placement="bottom"
                    trigger="click"
                    width="300">
          <el-button slot="reference" class="rightInputWidth" size="mini" title="名称样式" type="plain">名称样式...</el-button>
          <BoxedTextStyleInput v-model="value.nameTextStyle"></BoxedTextStyleInput>
        </el-popover>
      </div>

      <div class="keyValueSettingContainer">
        简介样式：
        <el-popover placement="bottom"
                    trigger="click"
                    width="300">
          <el-button slot="reference" class="rightInputWidth" size="mini" title="简介样式" type="plain">简介样式...</el-button>
          <BoxedTextStyleInput v-model="value.descriptionTextStyle"></BoxedTextStyleInput>
        </el-popover>
      </div>

      <div class="keyValueSettingContainer">
        按钮样式：
        <el-popover placement="bottom"
                    trigger="click"
                    width="300">
          <el-button slot="reference" class="rightInputWidth" size="mini" title="按钮样式" type="plain">按钮样式...</el-button>
          <ButtonStyleInput v-model="value.cardButtonTextStyle"></ButtonStyleInput>
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

      <div class="keyValueSettingContainer">
        图标尺寸：
        <el-input-number v-model="value.linkImageSize"
                         :max="100"
                         :min="20"
                         :step="1"
                         :stepStrictly="true"
                         class="rightInputWidth"
                         controls-position="right"
                         size="mini"
                         title="按钮图标尺寸">
        </el-input-number>
      </div>
    </template>

    <template v-if="!isCard">
      <div class="keyValueSettingContainer">
        按钮样式：
        <el-popover placement="bottom"
                    trigger="click"
                    width="300">
          <el-button slot="reference" class="rightInputWidth" size="mini" title="按钮样式" type="plain">按钮样式...</el-button>
          <ButtonStyleInput v-model="value.buttonTextStyle"></ButtonStyleInput>
        </el-popover>
      </div>

      <div class="keyValueSettingContainer">
        每行按钮数：
        <el-input-number v-model="value.linkPerLine"
                         :max="4"
                         :min="1"
                         :step="1"
                         :stepStrictly="true"
                         class="rightInputWidth"
                         controls-position="right"
                         size="mini"
                         title="每行显示的按钮数目">
        </el-input-number>
      </div>

      <div class="keyValueSettingContainer">
        按钮间距：
        <el-input-number v-model="value.gutter"
                         :max="100"
                         :min="0"
                         :step="1"
                         :stepStrictly="true"
                         class="rightInputWidth"
                         controls-position="right"
                         size="mini"
                         title="按钮间距">
        </el-input-number>
      </div>
    </template>
  </div>
</template>

<script>
import PageLinkEditor from '@/console/app-edit/components/PageLinkEditor';

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
  },

  components: {
    PageLinkEditor,
  },

  computed: {
    isCard() {
      return this.value.styleType === 'CARD_BUTTON';
    },

    styleTypes() {
      return [
        {
          type: 'PURE_BUTTON',
          text: '纯按钮',
        },
        {
          type: 'CARD_BUTTON',
          text: '卡片式'
        }
      ]
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

</style>

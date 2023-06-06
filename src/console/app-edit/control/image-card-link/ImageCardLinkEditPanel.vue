<template>
  <div :class="$style.wrapper">
    <EditTitle>链接项</EditTitle>
    <PageLinkEditor v-model="value.links"
                    :isIcon="false"
                    :maxLinks="100"
                    :maxTextLength="50"
                    :showDescription="true">
    </PageLinkEditor>

    <EditTitle>基本设置</EditTitle>
    <el-checkbox v-model="value.showBasedOnPermission"
                 class="settingMarginBottom block"
                 size="mini"
                 title="勾选时，如果用户对某图卡所链接的内部页面无权限，那么该图卡将不予显示，该设置项对于外部链接无效">
      根据链接页面所需权限显示或隐藏图卡
    </el-checkbox>

    <el-checkbox v-model="value.textOverImage"
                 class="settingMarginBottom block"
                 size="mini"
                 title="勾选时，文本将覆盖在图片上方">
      文本覆盖于图片上方
    </el-checkbox>

    <div class="keyValueSettingContainer">
      名称样式：
      <el-popover placement="bottom"
                  trigger="click"
                  width="300">
        <el-button slot="reference" class="rightInputWidth" size="mini" title="图卡名称样式" type="plain">名称样式...
        </el-button>
        <BoxedTextStyleInput v-model="value.linkNameTextStyle"></BoxedTextStyleInput>
      </el-popover>
    </div>

    <div class="keyValueSettingContainer">
      简介样式：
      <el-popover placement="bottom"
                  trigger="click"
                  width="300">
        <el-button slot="reference" class="rightInputWidth" size="mini" title="图卡简介样式" type="plain">简介样式...
        </el-button>
        <BoxedTextStyleInput v-model="value.linkDescriptionTextStyle"></BoxedTextStyleInput>
      </el-popover>
    </div>

    <div class="keyValueSettingContainer">
      外观样式：
      <el-popover placement="bottom"
                  trigger="click"
                  width="300">
        <el-button slot="reference" class="rightInputWidth" size="mini" title="外观样式" type="plain">外观样式...
        </el-button>
        <AppearanceStyleInput :value="value.appearanceStyle"></AppearanceStyleInput>
      </el-popover>
    </div>

    <div class="keyValueSettingContainer">
      图片宽高比(%)：
      <el-input-number v-model="value.imageAspectRatio"
                       :max="200"
                       :min="50"
                       :step="10"
                       :stepStrictly="true"
                       controls-position="right"
                       size="mini"
                       title="图卡中图片的宽高比">
      </el-input-number>
    </div>

    <div class="keyValueSettingContainer">
      图卡间距：
      <el-input-number v-model="value.gutter"
                       :max="100"
                       :min="0"
                       :step="1"
                       :stepStrictly="true"
                       controls-position="right"
                       size="mini"
                       title="图卡间距">
      </el-input-number>
    </div>

    <div class="keyValueSettingContainer">
      每行图卡数：
      <el-input-number v-model="value.countPerRow"
                       :max="3"
                       :min="1"
                       :step="1"
                       :stepStrictly="true"
                       controls-position="right"
                       size="mini"
                       title="每行图卡数">
      </el-input-number>
    </div>
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
}
</script>

<style lang="scss" module>
.wrapper {

}
</style>

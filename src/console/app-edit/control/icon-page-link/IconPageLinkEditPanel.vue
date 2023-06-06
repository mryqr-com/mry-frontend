<template>
  <div :class="$style.wrapper">
    <EditTitle>链接项</EditTitle>
    <PageLinkEditor v-model="value.links"
                    :maxLinks="50"
                    :maxTextLength="10"
                    :showButtonText="false"
                    :showDescription="false"
                    :showImage="true"
                    :showName="true">
    </PageLinkEditor>

    <EditTitle>基本设置</EditTitle>
    <el-checkbox v-model="value.showBasedOnPermission"
                 class="settingMarginBottom block"
                 size="mini"
                 title="勾选时，如果用户对某图标所链接的内部页面无权限，那么该图标将不予显示，该设置项对于外部链接无效">
      根据链接页面所需权限显示或隐藏图标
    </el-checkbox>

    <div class="keyValueSettingContainer">
      每行图标数：
      <el-input-number v-model="value.numberPerRow"
                       :max="4"
                       :min="3"
                       :step="1"
                       :stepStrictly="true"
                       class="rightInputWidth"
                       controls-position="right"
                       size="mini"
                       title="每行显示的图标数目">
      </el-input-number>
    </div>

    <div class="keyValueSettingContainer">
      图标宽度：
      <el-input-number v-model="value.iconWidth"
                       :max="100"
                       :min="20"
                       :step="1"
                       :stepStrictly="true"
                       class="rightInputWidth"
                       controls-position="right"
                       size="mini"
                       title="图标宽度">
      </el-input-number>
    </div>

    <div class="keyValueSettingContainer">
      名称与图标间距：
      <el-input-number v-model="value.textIconSpace"
                       :max="50"
                       :min="0"
                       :step="1"
                       :stepStrictly="true"
                       class="rightInputWidth"
                       controls-position="right"
                       size="mini"
                       title="名称与图标间距">
      </el-input-number>
    </div>

    <div class="keyValueSettingContainer">
      行间距：
      <el-input-number v-model="value.rowGutter"
                       :max="100"
                       :min="10"
                       :step="1"
                       :stepStrictly="true"
                       class="rightInputWidth"
                       controls-position="right"
                       size="mini"
                       title="行间距">
      </el-input-number>
    </div>

    <div class="keyValueSettingContainer">
      名称字体：
      <el-popover placement="bottom"
                  trigger="click"
                  width="300">
        <el-button slot="reference"
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
      外观样式：
      <el-popover placement="bottom"
                  trigger="click"
                  width="300">
        <el-button slot="reference" class="rightInputWidth" size="mini" title="外观样式" type="plain">外观样式...</el-button>
        <AppearanceStyleInput :value="value.appearanceStyle"></AppearanceStyleInput>
      </el-popover>
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

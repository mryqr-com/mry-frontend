<template>
  <div :class="$style.wrapper">
    <div class="singleLineTitle">边框</div>
    <BorderInput v-model="value.border"
                 class="settingMarginBottom">
    </BorderInput>

    <div class="singleLineTitle">边框阴影</div>
    <ShadowInput v-model="value.shadow"
                 class="settingMarginBottom">
    </ShadowInput>

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

    <div class="keyValueSettingContainer">
      背景色：
      <MryColorPicker v-model="value.backgroundColor" title="背景色"></MryColorPicker>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>

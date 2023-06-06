<template>
  <div :class="$style.wrapper">
    <div class="singleLineTitle">字体</div>
    <FontStyleInput v-model="value.fontStyle" class="settingMarginBottom"></FontStyleInput>

    <div class="keyValueSettingContainer">
      行高：
      <el-input-number v-model="value.lineHeight"
                       :max="2"
                       :min="1"
                       :step="0.1"
                       :stepStrictly="true"
                       controls-position="right"
                       size="mini"
                       title="行高">
      </el-input-number>
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

<template>
  <div :class="$style.wrapper">
    <EditTitle>基本设置</EditTitle>
    <div class="keyValueSettingContainer">
      按钮文本：
      <el-input v-model="value.buttonText"
                :maxlength="10"
                :spellcheck="false"
                class="rightInputWidth"
                size="mini"
                title="按钮文本">
      </el-input>
    </div>

    <div class="keyValueSettingContainer">
      按钮样式：
      <el-popover placement="bottom"
                  trigger="click"
                  width="300">
        <el-button slot="reference" class="rightInputWidth" size="mini" title="设置按钮样式" type="plain">按钮样式...</el-button>
        <ButtonStyleInput v-model="value.buttonStyle"></ButtonStyleInput>
      </el-popover>
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

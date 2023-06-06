<template>
  <div :class="$style.wrapper">
    <EditTitle>基本设置</EditTitle>
    <div class="singleLineTitle marginTop10">占位符</div>
    <el-input v-model="value.placeholder"
              :maxlength="50"
              :spellcheck="false"
              class="settingMarginBottom"
              size="mini"
              title="占位符">
    </el-input>

    <AnswerUniqueSettingInput v-model="value.uniqueType"></AnswerUniqueSettingInput>

  </div>
</template>

<script>

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

</style>

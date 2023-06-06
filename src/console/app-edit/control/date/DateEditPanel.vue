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

    <el-checkbox v-model="value.defaultToToday" class="settingMarginBottom block" size="mini"
                 title="默认显示当天日期">
      默认显示当天日期
    </el-checkbox>
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

<template>
  <div :class="$style.wrapper">
    <EditTitle>基本设置</EditTitle>
    <div class="singleLineTitle marginTop10">占位符</div>
    <el-input v-model="value.placeholder"
              :maxlength="50"
              :spellcheck="false"
              class="settingMarginBottom block"
              size="mini"
              title="占位符">
    </el-input>

    <MinMaxEditor v-model="value.minMaxSetting"
                  :maxMax="100"
                  :minMin="0"
                  :precision="0"
                  :step="1"
                  :stepStrictly="true"
                  maxText="最大字符数："
                  minText="最小字符数：">
    </MinMaxEditor>

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

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
                  :maxMax="50000"
                  :minMin="0"
                  :precision="0"
                  :step="1"
                  :stepStrictly="true"
                  maxText="最大字符数："
                  minText="最小字符数：">
    </MinMaxEditor>

    <div class="keyValueSettingContainer">
      显示行数：
      <el-input-number v-model="value.rows"
                       :max="50"
                       :min="3"
                       :step="1"
                       :stepStrictly="true"
                       class="rightInputWidth"
                       controls-position="right"
                       size="mini"
                       title="默认显示行数">
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

<template>
  <div :class="$style.wrapper">
    <EditTitle>基本设置</EditTitle>

    <div class="keyValueSettingContainer">
      最大分数：
      <el-input-number v-model="value.max"
                       :max="10"
                       :min="5"
                       :step="1"
                       :stepStrictly="true"
                       controls-position="right"
                       size="mini"
                       title="最大分数">
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

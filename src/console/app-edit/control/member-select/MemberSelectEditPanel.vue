<template>
  <div :class="$style.wrapper">
    <EditTitle>基本设置</EditTitle>
    <div class="singleLineTitle marginTop10">占位符</div>
    <el-input v-model="value.placeholder" :maxlength="50"
              :spellcheck="false"
              class="settingMarginBottom"
              size="mini"
              title="占位符">
    </el-input>

    <el-checkbox v-model="value.filterable" class="settingMarginBottom block" size="mini" title="是否可搜索">可搜索
    </el-checkbox>

    <el-checkbox v-model="value.multiple" class="settingMarginBottom block" size="mini" title="是否可多选">多选</el-checkbox>

    <MinMaxEditor v-if="value.multiple"
                  v-model="value.minMaxSetting"
                  :maxMax="100"
                  :minMin="0"
                  :precision="0"
                  :step="1"
                  :stepStrictly="true"
                  maxText="最大可选成员数："
                  minText="最小可选成员数：">
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
  }

}
</script>

<style lang="scss" module>
.wrapper {
}

</style>

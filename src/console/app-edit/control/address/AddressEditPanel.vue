<template>
  <div :class="$style.wrapper">
    <EditTitle>基本设置</EditTitle>

    <el-checkbox v-model="value.positionable" class="settingMarginBottom block" size="mini" title="是否可定位">可定位
    </el-checkbox>

    <div class="keyValueSettingContainer">
      地址精确度：
      <el-select v-model="value.precision"
                 class="rightInputWidth"
                 placeholder="请选择精确程度"
                 size="mini"
                 title="地址精确度">
        <el-option
            v-for="precision in precisions"
            :key="precision.type"
            :label="precision.text"
            :value="precision.type">
        </el-option>
      </el-select>
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

  data() {
    return {
      precisions: [
        {
          type: 1,
          text: '省份'
        },
        {
          type: 2,
          text: '城市'
        },
        {
          type: 3,
          text: '区县'
        },
        {
          type: 4,
          text: '详细地址'
        },
      ]
    }
  },
}
</script>

<style lang="scss" module>
.wrapper {
}

</style>

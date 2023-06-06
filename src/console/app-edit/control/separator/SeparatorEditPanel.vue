<template>
  <div :class="$style.wrapper">
    <EditTitle>基本设置</EditTitle>

    <div class="keyValueSettingContainer">
      分隔符类型：
      <el-select
          v-model="value.separatorType"
          class="rightInputWidth"
          size="mini"
          title="分隔符类型">
        <el-option
            v-for="type in separatorTypes"
            :key="type.key"
            :label="type.key"
            :value="type.value">
        </el-option>
      </el-select>
    </div>

    <div class="keyValueSettingContainer">
      粗细度：
      <el-input-number v-model="value.borderWidth"
                       :max="5"
                       :min="1"
                       :step="1"
                       :stepStrictly="true"
                       class="rightInputWidth"
                       controls-position="right"
                       size="mini"
                       title="分隔符粗细度">
      </el-input-number>
    </div>

    <div class="keyValueSettingContainer">
      占用宽度(%)：
      <el-input-number v-model="value.widthRatio"
                       :max="100"
                       :min="50"
                       :step="1"
                       :stepStrictly="true"
                       class="rightInputWidth"
                       controls-position="right"
                       size="mini"
                       title="分隔符占用整行宽度比">
      </el-input-number>
    </div>

    <div class="singleLineTitle">中间文本</div>
    <el-input v-model="value.text"
              :maxlength="50"
              class="settingMarginBottom block"
              size="mini"
              title="中间显示文本">
    </el-input>

    <div class="keyValueSettingContainer">
      文本样式：
      <el-popover placement="bottom"
                  trigger="click"
                  width="300">
        <el-button slot="reference" class="rightInputWidth" size="mini" title="文本样式" type="plain">文本样式...
        </el-button>
        <div class="singleLineTitle">字体</div>
        <FontStyleInput v-model="value.fontStyle"></FontStyleInput>
      </el-popover>
    </div>

    <div class="keyValueSettingContainer">
      文本背景色：
      <MryColorPicker v-model="value.backgroundColor" title="文本背景色"></MryColorPicker>
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
  computed: {
    separatorTypes() {
      return [
        {
          key: '实线',
          value: "SOLID"
        },

        {
          key: '虚线',
          value: "DASHED"
        },

        {
          key: '点线',
          value: "DOTTED"
        },
      ];
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>

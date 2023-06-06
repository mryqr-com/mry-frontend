<template>
  <div :class="$style.wrapper">
    <EditTitle>基本设置</EditTitle>

    <el-checkbox v-model="value.nameEditable" class="settingMarginBottom block" size="mini" title="上传时，文件名是否可编辑">
      文件名可编辑
    </el-checkbox>

    <el-checkbox v-model="value.sortable" class="settingMarginBottom block" size="mini" title="上传时，图片列表是否可排序">可排序
    </el-checkbox>

    <el-checkbox v-model="value.onlyOnSite" class="settingMarginBottom block" size="mini" title="上传时，只允许现场拍照">只允许现场拍照
    </el-checkbox>

    <div class="keyValueSettingContainer">
      最大上传数：
      <el-input-number v-model="value.max"
                       :max="10"
                       :min="1"
                       class="rightInputWidth"
                       controls-position="right"
                       size="mini"
                       title="限制最大上传数">
      </el-input-number>
    </div>

    <div class="keyValueSettingContainer">
      图片压缩质量：
      <el-select
          v-model="value.compressType"
          class="rightInputWidth"
          placeholder="请选择压缩类型"
          size="mini"
          title="图片压缩质量">
        <el-option
            v-for="item in compressTypes"
            :key="item.type"
            :label="item.text"
            :value="item.type">
        </el-option>
      </el-select>
    </div>

    <div class="keyValueSettingContainer">
      按钮文本：
      <el-input v-model="value.buttonText"
                :maxlength="10"
                :spellcheck="false"
                class="rightInputWidth"
                size="mini"
                title="上传按钮文本">
      </el-input>
    </div>

    <div class="keyValueSettingContainer">
      按钮样式：
      <el-popover placement="bottom"
                  trigger="click"
                  width="300">
        <el-button slot="reference" class="rightInputWidth" size="mini" title="上传按钮样式" type="plain">按钮样式...</el-button>
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

  data() {
    return {
      compressTypes: [
        {
          type: 'VERY_HIGH',
          text: '高'
        },
        {
          type: 'HIGH',
          text: '较高'
        },
        {
          type: 'MEDIUM',
          text: '适中'
        },
        {
          type: 'LOW',
          text: '较低'
        }
      ],
    }
  },

}
</script>

<style lang="scss" module>
.wrapper {
}

</style>

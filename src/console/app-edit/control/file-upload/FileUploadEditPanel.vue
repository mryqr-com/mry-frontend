<template>
  <div :class="$style.wrapper">
    <EditTitle>基本设置</EditTitle>
    <el-checkbox v-model="value.nameEditable"
                 class="settingMarginBottom block"
                 size="mini"
                 title="上传时，文件名是否可编辑">
      文件名可编辑
    </el-checkbox>

    <el-checkbox v-model="value.sortable"
                 class="settingMarginBottom block"
                 size="mini"
                 title="上传时，文件列表是否可排序">
      可排序
    </el-checkbox>

    <div class="keyValueSettingContainer">
      最大上传数：
      <el-input-number v-model="value.max"
                       :max="10"
                       :min="1"
                       class="rightInputWidth"
                       controls-position="right"
                       size="mini"
                       title="最大上传文件数">
      </el-input-number>
    </div>

    <div class="keyValueSettingContainer">
      限制文件类型：
      <el-select v-model="value.category"
                 class="rightInputWidth"
                 placeholder="请选择文件类型"
                 size="mini"
                 title="限制所上传文件的类型">
        <el-option v-for="item in categories"
                   :key="item.type"
                   :disabled="item.disabled"
                   :label="item.text"
                   :value="item.type">
        </el-option>
      </el-select>
    </div>

    <div class="keyValueSettingContainer">
      限制单文件大小：
      <el-select
          v-model="value.perMaxSize"
          class="rightInputWidth"
          placeholder="请选择大小"
          size="mini"
          title="限制文件大小">
        <el-option v-for="(item,index) in fileSizes"
                   :key="index"
                   :label="item+'M'"
                   :value="item">
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
        <el-button slot="reference" class="rightInputWidth" size="mini" title="上传按钮文本样式" type="plain">按钮样式...
        </el-button>
        <ButtonStyleInput v-model="value.buttonStyle"></ButtonStyleInput>
      </el-popover>
    </div>

  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
  },

  data() {
    return {
      fileSizes: [1, 5, 10, 20, 50, 100],
    }
  },

  computed: {
    ...mapGetters(['isVideoAudioAllowed']),

    categories() {
      return [
        {
          type: 'IMAGE',
          text: '图片类',
          disabled: false,
        },
        {
          type: 'DOCUMENT',
          text: '文档类',
          disabled: false,
        },
        {
          type: 'VIDEO',
          text: '视频类',
          disabled: !this.isVideoAudioAllowed,
        },
        {
          type: 'AUDIO',
          text: '音频类',
          disabled: !this.isVideoAudioAllowed,
        }
      ];
    },

  },

}
</script>

<style lang="scss" module>
.wrapper {
}

</style>

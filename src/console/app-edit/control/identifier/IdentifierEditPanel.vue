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
                  :maxMax="50"
                  :minMin="0"
                  :precision="0"
                  :step="1"
                  :stepStrictly="true"
                  maxText="最大字符数："
                  minText="最小字符数：">
    </MinMaxEditor>

    <AnswerUniqueSettingInput v-model="value.uniqueType"></AnswerUniqueSettingInput>

    <div class="keyValueSettingContainer">
      格式检查：
      <el-select v-model="value.identifierFormatType"
                 class="width130"
                 size="mini"
                 title="限制填值格式">
        <el-option v-for="aType in formatTypes"
                   :key="aType.value"
                   :label="aType.text"
                   :value="aType.value">
        </el-option>
      </el-select>
    </div>

    <template v-if="value.identifierFormatType==='REGEX'">
      <div class="singleLineTitle marginTop10">请输入正则表达式</div>
      <el-input v-model="value.formatRegex"
                :maxlength="500"
                :rows="3"
                :spellcheck="false"
                class="settingMarginBottom block"
                placeholder="/^[a-z]+$/"
                size="mini"
                title="请输入符合Javascript语言的正则表达式，语法错误将无效，例如限定小写英文字母的正则表达式为：/^[a-z]+$/"
                type="textarea">
      </el-input>
    </template>
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
    formatTypes() {
      return [
        {
          text: "无",
          value: 'NONE'
        },
        {
          text: "身份证",
          value: 'ID_CARD'
        },
        {
          text: "车牌号码",
          value: 'CAR_PLATE_ID'
        },
        {
          text: "纯数字",
          value: 'NUMBER_ONLY'
        },
        {
          text: "正则表达式",
          value: 'REGEX'
        }
      ]
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

</style>

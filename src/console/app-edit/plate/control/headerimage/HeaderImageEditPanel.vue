<template>
  <div :class="$style.wrapper">
    <EditTitle>基本设置</EditTitle>

    <div class="keyValueSettingContainer">
      图片宽度：
      <el-input-number v-model="value.width"
                       :class="$style.commonInput"
                       :max="500"
                       :min="50"
                       :step="1"
                       :stepStrictly="true"
                       controls-position="right"
                       size="mini"
                       title="图片宽度">
      </el-input-number>
    </div>

    <div class="keyValueSettingContainer">
      图片高度：
      <el-input-number v-model="value.height"
                       :class="$style.commonInput"
                       :max="500"
                       :min="50"
                       :step="1"
                       :stepStrictly="true"
                       controls-position="right"
                       size="mini"
                       title="图片高度">
      </el-input-number>
    </div>

    <div class="keyValueSettingContainer">
      对齐方式：
      <el-radio-group v-model="value.alignType"
                      size="mini">
        <el-radio-button label="JUSTIFY" title="左对齐">
          <icon icon="align-left"/>
        </el-radio-button>
        <el-radio-button label="CENTER" title="居中">
          <icon icon="align-center"/>
        </el-radio-button>
        <el-radio-button label="RIGHT" title="右对齐">
          <icon icon="align-right"/>
        </el-radio-button>
      </el-radio-group>
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

.commonInput {
  width: 125.5px !important; //为了迁就对齐方式控件
}
</style>

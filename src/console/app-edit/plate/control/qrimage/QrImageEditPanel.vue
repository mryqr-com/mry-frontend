<template>
  <div :class="$style.wrapper">
    <EditTitle>二维码样式</EditTitle>

    <QrImageSettingInput v-model="value.setting" class="marginTop10"></QrImageSettingInput>

    <div class="keyValueSettingContainer">
      对齐方式：
      <el-radio-group v-model="value.alignType" size="mini">
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
import QrImageSettingInput from '@/console/app-edit/plate/QrImageSettingInput';

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
  },

  components: {
    QrImageSettingInput,
  }
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>

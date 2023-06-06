<template>
  <div :class="$style.wrapper">
    <el-input-number v-model="value.width"
                     :class="$style.widthInput"
                     :max="100"
                     :min="0"
                     :step="1"
                     :stepStrictly="true"
                     controls-position="right"
                     size="mini"
                     title="阴影宽度">
    </el-input-number>

    <MryColorPicker v-model="value.color" title="阴影颜色"></MryColorPicker>
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
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.widthInput {
  flex-grow: 1;
  margin-right: 5px;
}
</style>

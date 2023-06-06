<template>
  <div :class="$style.wrapper">
    <div :class="$style.row" class="marginBottom5">
      <el-select
          v-model="value.type"
          class="marginRight5"
          placeholder="边框样式"
          size="mini"
          title="边框样式">
        <el-option
            v-for="type in borderTypes"
            :key="type.key"
            :label="type.key"
            :value="type.value">
        </el-option>
      </el-select>

      <el-input-number v-model="value.width"
                       :max="100"
                       :min="0"
                       :step="1"
                       :stepStrictly="true"
                       controls-position="right"
                       size="mini"
                       title="边框宽度">
      </el-input-number>
    </div>

    <div :class="$style.row">
      <el-select
          ref="borderSelect"
          v-model="value.sides"
          :class="$style.sideSelect"
          class="marginRight5"
          collapse-tags
          multiple
          placeholder="页边范围"
          size="mini"
          title="页边范围">
        <el-option
            v-for="type in allSides"
            :key="type.key"
            :label="type.key"
            :value="type.value">
        </el-option>
      </el-select>

      <MryColorPicker v-model="value.color" title="边框颜色"></MryColorPicker>
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
    borderTypes() {
      return [
        {
          key: '无',
          value: "NONE"
        },

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
      ]
    },

    allSides() {
      return [
        {
          key: '上',
          value: "TOP"
        },

        {
          key: '下',
          value: "BOTTOM"
        },

        {
          key: '左',
          value: "LEFT"
        },

        {
          key: '右',
          value: "RIGHT"
        },

      ]
    }
  },
}
</script>

<style lang="scss" module>
.wrapper {

}

.row {
  display: flex;
  justify-content: space-between;
}

.sideSelect {
  flex-grow: 1;
}

</style>

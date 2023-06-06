<template>
  <div :class="$style.wrapper">
    <div :class="$style.row" class="marginBottom5">
      <el-select
          ref="cornersSelect"
          v-model="value.corners"
          class="marginRight5"
          collapse-tags
          multiple
          placeholder="圆角范围"
          size="mini"
          title="圆角范围">
        <el-option
            v-for="corner in radiusCorners"
            :key="corner.key"
            :label="corner.key"
            :value="corner.value">
        </el-option>
      </el-select>
      <el-input-number v-model="value.radius"
                       :max="100"
                       :min="0"
                       :step="1"
                       :stepStrictly="true"
                       controls-position="right"
                       size="mini"
                       title="圆角半径">
      </el-input-number>
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
    radiusCorners() {
      return [
        {
          key: '左上角',
          value: "TOP_LEFT"
        },

        {
          key: '右上角',
          value: "TOP_RIGHT"
        },

        {
          key: '左下角',
          value: "BOTTOM_LEFT"
        },

        {
          key: '右下角',
          value: "BOTTOM_RIGHT"
        },
      ]
    },
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

</style>

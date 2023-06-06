<template>
  <div :class="$style.wrapper">
    <div class="keyValueSettingContainer">
      {{ minText }}
      <el-input-number v-model="value.min"
                       :max="minMax"
                       :min="minMin"
                       :precision="precision"
                       :step="step"
                       :stepStrictly="stepStrictly"
                       controls-position="right"
                       size="mini"
                       title="最小值">
      </el-input-number>
    </div>

    <div class="keyValueSettingContainer">
      {{ maxText }}
      <el-input-number v-model="value.max"
                       :max="maxMax"
                       :min="minMin"
                       :precision="precision"
                       :step="step"
                       :stepStrictly="stepStrictly"
                       controls-position="right"
                       size="mini"
                       title="最大值">
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

    maxMax: {
      type: Number,
      default: 1000000
    },

    minMin: {
      type: Number,
      default: -1000000
    },

    stepStrictly: {
      type: Boolean,
      default: true
    },

    precision: {
      type: Number,
      default: 0
    },

    step: {
      type: Number,
      default: 1
    },

    minText: {
      type: String,
      default: '最小值：'
    },

    maxText: {
      type: String,
      default: '最大值：'
    },
  },

  computed: {
    minMax() {
      return this.value.max;
    },
  },

  watch: {
    'value.max': function (newValue, oldValue) {
      if (this.value.min > newValue) {
        this.value.min = newValue;
      }
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

</style>

<template>
  <div :class="$style.wrapper">
    <el-input ref="theArea"
              :maxlength="50000"
              :value="value"
              placeholder="支持Markdown语法"
              rows="5"
              size="mini"
              type="textarea"
              @input="updateValue($event)">
    </el-input>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String
    }
  },

  methods: {
    updateValue: function (value) {
      this.$emit('input', value)
    },
    focusArea() {
      this.$refs['theArea'].focus();
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {

}


</style>

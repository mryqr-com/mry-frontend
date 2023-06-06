<template>
  <div :class="$style.wrapper">
    <div :class="$style.optionName">
      <slot></slot>
    </div>

    <div :class="$style.operationArea">
      <i :class="$style.icon"
         :style="yesStyle"
         class="el-icon-circle-check"
         @click="yes">
      </i>
      &nbsp;
      <i :class="$style.icon"
         :style="noStyle"
         class="el-icon-circle-close"
         @click="no">
      </i>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    }
  },

  methods: {
    yes() {
      this.check = 'YES';
    },

    no() {
      this.check = 'NO';
    }
  },

  computed: {
    check: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val)
      }
    },

    yesStyle() {
      return {
        color: this.check === 'YES' ? '#10b01b' : null,
      }
    },

    noStyle() {
      return {
        color: this.check === 'NO' ? 'red' : null,
      }
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
  height: $formPageInputHeight;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
}

.operationArea {
  margin-left: 5px;
  flex-shrink: 0;
}

.icon {
  font-size: 25px;
  font-weight: 500;
  color: $placeholderTextColor;
}
</style>

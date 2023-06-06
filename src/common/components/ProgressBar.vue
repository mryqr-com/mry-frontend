<template>
  <el-dialog :append-to-body="true"
             :class="$style.wrapper"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :lock-scroll="true"
             :show-close="false"
             :title="title"
             :visible.sync="visible"
             width="500px"
             @close="$emit('update:show', false)">
    <div :class="$style.barWrapper">
      <div :class="$style.bar" :style="barStyle"></div>
    </div>
    <div :class="$style.text">{{ text }}</div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      default: '进度条',
    },

    text: {
      type: String,
    },

    step: {
      type: Number,
      required: true,
    },

    max: {
      type: Number,
      default: 100,
    }
  },

  data() {
    return {
      visible: this.show,
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  computed: {
    barStyle() {
      return {
        width: (this.step / this.max) * 100 + '%',
      }
    }
  },
}
</script>

<style lang="scss" module>
.wrapper {
  :global {
    .el-dialog__body {
      padding-bottom: 24px;
    }
  }
}

.barWrapper {
  margin-top: 15px;
  background-color: $primaryBackgroundColor;
}

.bar {
  height: 20px;
  background-color: $primaryThemeColor;
  max-width: 100%;
}

.text {
  margin-top: 10px;
}
</style>


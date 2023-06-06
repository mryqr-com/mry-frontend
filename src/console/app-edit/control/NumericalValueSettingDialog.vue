<template>
  <el-dialog :class="$style.wrapper"
             :visible.sync="visible"
             title="赋值设置"
             width="500px"
             @close="$emit('update:show', false)">

    <el-form ref="theForm" :class="$style.theForm" label-width="120px">
      <el-form-item v-for="option in options" :key="option.id" :label="option.name">
        <el-input-number v-model.number="option.numericalValue"
                         :controls="false"
                         size="medium">
        </el-input-number>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button :class="$style.footerButton"
                 icon="el-icon-check"
                 size="medium"
                 type="primary"
                 @click="close">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  props: {
    options: {
      type: Array,
      required: true
    },

    show: {
      type: Boolean,
      default: false,
    }
  },

  data() {
    return {
      visible: this.show,
    };
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  methods: {
    close() {
      this.visible = false;
    },
  },
}
</script>


<style lang="scss" module>
.wrapper {
  :global {
    .el-dialog__body {
      max-height: 400px;
      overflow-y: auto;
    }

    .el-form-item {
      margin-bottom: 10px !important;
    }

    .el-form-item__label {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .el-input-number--medium {
      width: 100%;
    }

    .el-input__inner {
      padding-left: 10px !important;
      padding-right: 10px !important;
      text-align: left !important;
    }
  }
}

.footerButton {
  width: $dialogButtonWidth;
}

</style>


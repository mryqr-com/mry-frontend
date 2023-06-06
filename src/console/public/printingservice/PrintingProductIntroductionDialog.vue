<template>
  <el-dialog v-if="product"
             :class="$style.wrapper"
             :title="product.name"
             :visible.sync="visible"
             top="60px"
             width="800px"
             @close="$emit('update:show', false)">

    <MarkdownViewer :class="$style.content" :value="product.introduction"></MarkdownViewer>

    <div slot="footer" :class="$style.footer">
      <el-button :class="$style.footerButton"
                 icon="el-icon-close"
                 size="medium"
                 type="plain"
                 @click="cancel">
        取消
      </el-button>
      <el-button :class="[$style.footerButton,$style.purchaseButton]"
                 size="medium"
                 type="primary"
                 @click="purchase">
        购买
      </el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    product: {
      type: Object,
    }
  },

  components: {
    MarkdownViewer: () => import(/* webpackChunkName: "markdown-viewer" */ '@/common/components/MarkdownViewer'),
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

  methods: {
    cancel() {
      this.visible = false;
    },

    purchase() {
      this.$emit('purchase', this.product);
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
  :global {
    .el-dialog {
      margin-top: 0;
      margin-bottom: 0;
    }

    .el-dialog__body {
      padding-bottom: 20px;
      height: calc(100vh - 60px - 60px - 66px - 54px);
    }
  }
}

.content {
  padding: 10px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.footer {
  display: flex;
  justify-content: right;
}

.footerButton {
  width: $dialogButtonWidth;
}

.purchaseButton {
  background-color: $oppositeThemeColor !important;
  border-color: $oppositeThemeColor !important;
}

.purchaseButton:hover {
  background-color: #ec8303 !important;
  border-color: #ec8303 !important;
}

</style>

<template>
  <el-dialog :append-to-body="true"
             :class="$style.wrapper"
             :close-on-click-modal="false"
             :destroy-on-close="true"
             :modal-append-to-body="true"
             :title="title"
             :visible.sync="visible"
             top="60px"
             width="650px"
             @close="$emit('update:show', false)"
             @open="initDialog">

    <RichTextInput v-model="localValue" :ossRequest="ossRequest"></RichTextInput>

    <div slot="footer">
      <el-button :class="$style.footerButton"
                 icon="el-icon-close"
                 type="plain"
                 @click="cancelEdit">
        取消
      </el-button>

      <el-button :class="$style.footerButton"
                 icon="el-icon-check"
                 type="primary"
                 @click="confirmEdit">
        完成编辑
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {cloneDeep} from 'lodash-es';

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      default: '编辑',
    },

    value: {
      type: String,
    },

    ossRequest: {
      type: Object,
      required: true
    }

  },

  components: {
    RichTextInput: () => import(/* webpackChunkName: "rich-text-input" */ '@/common/components/RichTextInput'),
  },

  data() {
    return {
      visible: this.show,
      localValue: null,
    }
  },

  watch: {
    show(val) {
      this.visible = val;
    }
  },

  methods: {
    initDialog() {
      this.localValue = cloneDeep(this.value);
    },

    confirmEdit() {
      this.$emit('input', this.localValue);
      this.visible = false;
    },

    cancelEdit() {
      this.visible = false;
    }
  },
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
      padding-bottom: 15px;
      height: calc(100vh - 60px - 60px - 66px - 54px);
    }

    .ql-editor {
      height: calc(100vh - 60px - 60px - 66px - 54px - 82px - 15px);
    }
  }
}

.footerButton {
  width: 150px;
}

</style>

<template>
  <el-dialog :class="$style.wrapper"
             :title="titleText"
             :visible.sync="visible"
             top="60px"
             width="600px">
    <RichTextViewer v-if="content" :class="$style.content" :content="content"></RichTextViewer>
  </el-dialog>
</template>

<script>

import eventBus from '@/common/utils/event-bus';

export default {
  components: {
    RichTextViewer: () => import(/* webpackChunkName: "rich-text-viewer" */ '@/common/components/RichTextViewer'),
  },

  data() {
    return {
      visible: false,
      title: null,
      content: null
    }
  },

  created() {
    eventBus.$on('view-rich-text', this.openDialog);
  },

  beforeDestroy() {
    eventBus.$off('view-rich-text');
  },

  computed: {
    titleText() {
      return this.title ? this.title : '查看';
    }
  },

  methods: {
    openDialog(data) {
      this.content = data.content;
      this.title = data.title;
      this.visible = true;
    },
  }
}
</script>


<style lang="scss" module>
.wrapper {
  :global {
    .el-dialog__body {
      padding-bottom: 20px;
    }
  }
}

.content {
  padding: 10px;
  width: 100%;
  height: 600px;
  overflow-y: auto;
}

</style>

<template>
  <div :class="$style.wrapper">
    <div class="singleLineTitleWithSuffix">
      <EditTitle>
        段落文本
      </EditTitle>
      <el-popover
          placement="bottom"
          trigger="click"
          width="300">
        <ItalicTextButton slot="reference" title="设置段落文本样式">样式</ItalicTextButton>
        <MarkdownStyleInput v-model="value.markdownStyle"></MarkdownStyleInput>
      </el-popover>
    </div>

    <MarkdownEditor v-model="value.content" class="marginBottom10" title="编辑段落文本"></MarkdownEditor>

    <StyledButton @click="markdownDialogVisible=true">
      在Markdown编辑器中打开
    </StyledButton>

    <DialogedMarkdownInput v-model="value.content"
                           :oss-request="appEditOssRequest"
                           :show.sync="markdownDialogVisible"
                           :title="`编辑${value.name}`">
    </DialogedMarkdownInput>
  </div>
</template>

<script>
import MarkdownEditor from '@/console/app-edit/components/MarkdownEditor';
import {createNamespacedHelpers} from "vuex";

const {mapGetters, mapActions} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
  },

  data() {
    return {
      markdownDialogVisible: false
    }
  },

  computed: {
    ...mapGetters([
      'appEditOssRequest'
    ]),
  },

  components: {
    MarkdownEditor,
    DialogedMarkdownInput: () => import(/* webpackChunkName: "dialoged-markdown-editor" */ '@/common/components/DialogedMarkdownInput'),
  },

}
</script>

<style lang="scss" module>
.wrapper {
}

</style>

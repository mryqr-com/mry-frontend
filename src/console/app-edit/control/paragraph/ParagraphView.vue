<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">
    <MarkdownViewer v-if="control.content"
                    :class="$style.markdownViewer"
                    :markdownStyle="control.markdownStyle"
                    :value="control.content">
    </MarkdownViewer>

    <div v-if="!control.content" :class="$style.placeholderText">
      <i class="el-icon-warning-outline"> 请填写段落文本</i>
    </div>
  </div>
</template>

<script>

export default {
  props: ['control', 'tabletView', "controlIndex"],
  components: {
    MarkdownViewer: () => import(/* webpackChunkName: "markdown-viewer" */ '@/common/components/MarkdownViewer'),
  },
}
</script>

<style lang="scss" module>
.wrapper {
}

.placeholderText {
  color: $warningYellow;
}

.markdownViewer {
}

</style>

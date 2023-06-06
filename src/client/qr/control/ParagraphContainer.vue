<template>
  <ControlWrapper v-if="control.content" :control="control" :index="index">
    <MarkdownViewer :markdownStyle="control.markdownStyle" :value="control.content"></MarkdownViewer>
  </ControlWrapper>
</template>

<script>

export default {
  props: ['control', 'index'],
  components: {
    MarkdownViewer: () => import(/* webpackChunkName: "markdown-viewer" */ '@/common/components/MarkdownViewer'),
  },
}
</script>

<style lang="scss" module>

</style>

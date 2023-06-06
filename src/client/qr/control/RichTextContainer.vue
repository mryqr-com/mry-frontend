<template>
  <ControlWrapper v-if="control.content" :control="control" :index="index">
    <RichTextViewer :content="control.content"></RichTextViewer>
  </ControlWrapper>
</template>

<script>

export default {
  props: ['control', 'index'],

  components: {
    RichTextViewer: () => import(/* webpackChunkName: "rich-text-viewer" */ '@/common/components/RichTextViewer'),
  },

}
</script>

<style lang="scss" module>

</style>

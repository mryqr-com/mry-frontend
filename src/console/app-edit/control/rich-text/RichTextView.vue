<template>
  <div :class="$style.wrapper">
    <RichTextViewer v-if="control.content" :content="control.content"></RichTextViewer>
    <div v-else :class="$style.placeholderText">
      <i class="el-icon-warning-outline"> 请编辑内容</i>
    </div>
  </div>
</template>

<script>
export default {
  props: ['control', 'tabletView', "controlIndex"],

  components: {
    RichTextViewer: () => import(/* webpackChunkName: "rich-text-viewer" */ '@/common/components/RichTextViewer'),
  },
}
</script>

<style lang="scss" module>
.wrapper {
  :global {
    .ql-editor > * {
      cursor: inherit !important;
    }
  }
}

.placeholderText {
  color: $warningYellow;
}

</style>

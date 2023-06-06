<template>
  <MarkdownViewer v-if="displayValue"
                  :class="$style.wrapper"
                  :markdownStyle="presentationControl.markdownAnswerStyle.markdownStyle"
                  :value="displayValue">
  </MarkdownViewer>
</template>

<script>

export default {
  props: ['refControl', 'presentationControl', 'value'],

  components: {
    MarkdownViewer: () => import(/* webpackChunkName: "markdown-viewer" */ '@/common/components/MarkdownViewer'),
  },

  computed: {
    displayValue() {
      if (!this.value) {
        return null;
      }

      return this.value.text;
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {

}
</style>

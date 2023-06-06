<template>
  <RichTextViewer v-if="displayValue"
                  :content="displayValue">
  </RichTextViewer>
</template>

<script>

export default {
  props: ['control', 'value'],

  components: {
    RichTextViewer: () => import(/* webpackChunkName: "rich-text-viewer" */ '@/common/components/RichTextViewer'),
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

</style>

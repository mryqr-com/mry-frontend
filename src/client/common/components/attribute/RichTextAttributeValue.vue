<template>
  <RichTextViewer v-if="displayValue"
                  :class="$style.wrapper"
                  :content="displayValue">
  </RichTextViewer>
</template>

<script>

export default {
  props: ['attribute', 'value', 'refControl'],

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
.wrapper {

}
</style>

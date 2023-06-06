<template>
  <div :class="$style.wrapper">
    <button :class="$style.backButton"
            class="majoricon i-left plainButton"
            title="返回"
            @click="goToPreviousPage">
    </button>

    <BoxedTextViewer :textStyle="pageTitle.textStyle">
      {{ pageTitle.text }}
    </BoxedTextViewer>

    <MarkdownViewer v-if="pageTitle.description"
                    :markdownStyle="pageTitle.descriptionStyle"
                    :value="pageTitle.description">
    </MarkdownViewer>
  </div>
</template>

<script>

export default {
  props: {
    pageTitle: {
      type: Object,
      required: true
    },

  },

  components: {
    MarkdownViewer: () => import(/* webpackChunkName: "markdown-viewer" */ '@/common/components/MarkdownViewer'),
  },

  methods: {
    goToPreviousPage() {
      this.$router.go(-1);
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
  position: relative;
}

.backButton {
  position: absolute;
  font-size: 20px;
  padding: 10px;
  color: $secondaryTextColor;
  top: 10px;
  left: 10px;
}

@media (min-width: $mobileScreenBreakpoint), print {
  .backButton {
    display: none;
  }
}


</style>

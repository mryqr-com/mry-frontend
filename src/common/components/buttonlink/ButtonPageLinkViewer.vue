<template>
  <div :class="$style.wrapper">
    <PureButtonPageLinkViewer v-if="control.styleType === 'PURE_BUTTON'"
                              :control="control"
                              :links="links"
                              :showWarning="showWarning"
                              @click="onClick">
    </PureButtonPageLinkViewer>

    <CardButtonPageLinkViewer v-else
                              :control="control"
                              :links="links"
                              :showWarning="showWarning"
                              @click="onClick">
    </CardButtonPageLinkViewer>
  </div>
</template>

<script>
import PureButtonPageLinkViewer from '@/common/components/buttonlink/PureButtonPageLinkViewer';
import CardButtonPageLinkViewer from '@/common/components/buttonlink/CardButtonPageLinkViewer';

export default {
  props: {
    control: {
      type: Object,
    },

    links: {
      type: Array,
    },

    showWarning: {
      type: Boolean,
      default: false,
    }
  },

  components: {
    PureButtonPageLinkViewer,
    CardButtonPageLinkViewer,
  },

  methods: {
    onClick(link) {
      this.$emit("click", link);
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>

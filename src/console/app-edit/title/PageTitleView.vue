<template>
  <PageTitleViewer :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]"
                   :pageTitle="theTitle">
  </PageTitleViewer>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import PageTitleViewer from '@/common/components/PageTitleViewer';

const {mapState, mapGetters} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  components: {
    PageTitleViewer
  },
  computed: {
    ...mapGetters([
      'currentPage',
    ]),

    ...mapState([
      'tabletView'
    ]),

    theTitle() {
      return this.currentPage.title;
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
  cursor: pointer;
  padding-left: $narrowPageVPadding;
  padding-right: $narrowPageVPadding;
}

.wrapperWide {
  padding-left: $widePageVPadding;
  padding-right: $widePageVPadding;
}

</style>

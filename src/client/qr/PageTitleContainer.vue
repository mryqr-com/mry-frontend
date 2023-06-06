<template>
  <PageTitleViewer v-if="shouldCurrentPageShowTitle"
                   :class="$style.wrapper"
                   :instanceName="instanceName"
                   :pageTitle="currentPageTitle">
  </PageTitleViewer>
</template>

<script>
import PageTitleViewer from '@/common/components/PageTitleViewer';
import {createNamespacedHelpers} from 'vuex';

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  components: {
    PageTitleViewer
  },

  computed: {
    instanceName() {
      return this.isCurrentHomePage ? null : this.qrName;
    },

    currentPageTitle() {
      if (this.isCurrentHomePage && this.qrName) {
        let description = this.qrDescription ? this.qrDescription : this.currentPage.title.description;
        return {...this.currentPage.title, text: this.qrName, description: description}
      }

      return this.currentPage.title;
    },

    ...clientQrStore.mapGetters([
      'qrName',
      'qrDescription',
      'currentPage',
      'isCurrentHomePage',
      'shouldCurrentPageShowTitle'
    ]),

  }
}
</script>

<style lang="scss" module>
.wrapper {
  padding-right: $narrowPageVPadding;
  padding-left: $narrowPageVPadding;
}

@media (min-width: $mobileScreenBreakpoint), print {
  .wrapper {
    padding-right: $widePageVPadding;
    padding-left: $widePageVPadding;
  }
}

</style>

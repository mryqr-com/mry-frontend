<template>
  <PageHeaderViewer v-if="shouldCurrentPageShowHeader" :header="currentPageHeader"></PageHeaderViewer>
</template>

<script>
import PageHeaderViewer from '@/common/components/PageHeaderViewer';
import {createNamespacedHelpers} from 'vuex';

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  components: {
    PageHeaderViewer
  },

  computed: {
    ...clientQrStore.mapGetters([
      'currentPage',
      'qrHeaderImage',
      'homePage',
      'isCurrentHomePage',
      'isHomePageHeaderImageReplaceable',
      'shouldCurrentPageShowHeader',
      'currentPageHeader',
    ]),
  },
}
</script>

<style lang="scss" module>

</style>

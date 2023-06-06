<template>
  <ClientQrSubmissionList :initPageId="pageId"
                          :selectablePages="allableViewablePages"
                          type="SUBMITTER_SUBMISSION">
  </ClientQrSubmissionList>
</template>

<script>
import ClientQrSubmissionList from '@/client/qr/submissions/ClientQrSubmissionList';
import {createNamespacedHelpers} from "vuex";

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  props: ['pageId'],

  components: {
    ClientQrSubmissionList,
  },

  computed: {
    ...clientQrStore.mapGetters([
      'allableViewablePages',
    ])
  }

}
</script>

<style lang="scss" module>

</style>

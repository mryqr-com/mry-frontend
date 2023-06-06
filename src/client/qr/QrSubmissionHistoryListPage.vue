<template>
  <ClientQrSubmissionList :initPageId="pageId"
                          :selectablePages="allableManagablePages"
                          type="ALL_SUBMIT_HISTORY">
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
      'allableManagablePages',
    ])
  }

}
</script>

<style lang="scss" module>

</style>

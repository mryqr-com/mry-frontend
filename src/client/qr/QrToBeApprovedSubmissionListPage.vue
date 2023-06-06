<template>
  <ClientQrSubmissionList :initPageId="pageId"
                          :selectablePages="allableApprovablePages"
                          type="TO_BE_APPROVED">
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
      'allableApprovablePages',
    ])
  }

}
</script>

<style lang="scss" module>

</style>

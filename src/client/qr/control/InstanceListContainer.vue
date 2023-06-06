<template>
  <ControlWrapper v-if="shouldShowControl" :control="control" :index="index">
    <InstanceListViewer v-if="instances.length > 0"
                        :instances="instances"
                        :rowGutter="control.rowGutter"
                        :showCreatedAt="control.showCreatedAt"
                        :showCreator="control.showCreator"
                        :showSeparator="control.showSeparator"
                        @click="openQr">
    </InstanceListViewer>

    <div v-else>无数据</div>
  </ControlWrapper>
</template>

<script>
import InstanceListViewer from '@/common/components/InstanceListViewer';

import presentationApi from "@/common/api/presentation-api";
import {createNamespacedHelpers} from "vuex";
import {qrUrl} from "@/common/utils/common-utils";

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  props: ['control', 'index'],

  components: {
    InstanceListViewer,
  },

  data() {
    return {
      instances: [],
      loaded: false,
    }
  },

  created() {
    presentationApi.fetchPresentation(this.qrId, this.currentPageId, this.control.id)
        .then(response => this.instances = response.data.instances)
        .catch(e => {
          console.error("Failed to fetch instance list:" + e.message)
        }).finally(() => this.loaded = true);
  },

  computed: {
    ...clientQrStore.mapGetters([
      'qrId',
      'currentPageId',
    ]),

    shouldShowControl() {
      return this.loaded;
    },
  },

  methods: {
    openQr(instance) {
      window.open(qrUrl(instance.plateId), '_blank');
    },
  }

}
</script>

<style lang="scss" module>

</style>

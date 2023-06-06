<template>
  <div v-if="loaded" :class="$style.wrapper">
    <router-view :key="$route.path"></router-view>
    <MrySupportFooter :class="$style.footer"
                      :shouldHideBottomMryLogo="shouldHideBottomMryLogo">
    </MrySupportFooter>
  </div>
</template>

<script>
import ACTIONS from '@/client/qr/store/client-qr-actions'
import {createNamespacedHelpers} from 'vuex';
import {imageThumbnailUrl} from '@/common/utils/image-utils'
import MrySupportFooter from '@/client/common/components/MrySupportFooter';
import {changeFavIcon} from "@/common/utils/common-utils";

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  props: ['plateId'],
  components: {
    MrySupportFooter,
  },

  data() {
    return {
      loaded: false,
    }
  },

  created() {
    this.updateReferenceData(this.$route.query.referenceData)
    this.updateHideTopBar(!!this.$route.query.hideTopBar);

    return this[ACTIONS.FETCH_SUBMISSION_QR](this.plateId).then(() => {
      document.title = `${this.qrName}`;
      this.$nextTick(() => {
        if (this.tenantLogo) {
          changeFavIcon(imageThumbnailUrl(this.tenantLogo));
        }
      });
      this.loaded = true;

      if (this.$route.name === 'qr-home') {
        this.$router.replace({
          name: 'new-submission',
          params: {pageId: this.homePageId}
        });
      }
    }).catch((e) => {
      if (e.response.data && e.response.data.error.code === 'PLATE_NOT_BOUND') {
        console.warn('Plate not bound,navigate to binding page.');
        this.$router.replace({name: 'bind-plate', params: {plateId: this.plateId}});
        return;
      }
      throw  e;
    })
  },

  methods: {
    ...clientQrStore.mapActions([
      ACTIONS.FETCH_SUBMISSION_QR
    ]),

    ...clientQrStore.mapMutations([
      'updateHideTopBar',
      'updateReferenceData',
    ])
  },

  computed: {
    ...clientQrStore.mapGetters([
      'tenantLogo',
      'isSubdomainEffective',
      'shouldHideBottomMryLogo',
      'appName',
      'qrName',
      'homePageId',
    ]),
  },

}
</script>

<style lang="scss" module>
.wrapper {
  height: 100%;
  background-size: cover;
  background-position: center;
  background-color: $primaryBackgroundColor;
}

.footer {
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translatex(-50%);
  margin: 0 auto;
  height: 50px;
  z-index: $clientPageZIndex - 1;
}

@media (min-width: $mobileScreenBreakpoint) {
  .wrapper {
    background-image: linear-gradient(white, #b9e3ff);
  }
}

@media print {
  .footer {
    display: none;
  }
}

</style>

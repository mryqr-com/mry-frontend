<template>
  <div v-if="currentPageId" :class="$style.wrapper" :style="viewportStyle">
    <QrTopBar v-if="shouldShowTopBar" :class="$style.qrTopBar"></QrTopBar>
    <div id="pageScrollToTopHelper"></div>

    <div :class="$style.pageTopMarginSupporter"
         :style="pageTopMarginSupporterStyle">
    </div>

    <router-view :class="$style.page"
                 :style="pageStyle">
    </router-view>

    <div :class="$style.pageBottomMarginSupporter"
         :style="pageBottomMarginSupporterStyle">
    </div>
  </div>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import QrTopBar from '@/client/qr/QrTopBar';
import {borderStyles, displayErrorMessage, shadowStyles} from "@/common/utils/common-utils";
import {imageDisplayUrl} from "@/common/utils/image-utils";

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  props: ['pageId'],

  components: {
    QrTopBar,
  },

  data() {
    return {
      pageTopBottomMargin: 50,
    }
  },

  created() {
    if (!this.pageExists(this.pageId)) {
      displayErrorMessage(404, '页面不存在');
      return;
    }

    this.setCurrentPage(this.pageId);
    document.title = `${this.qrName}`;
  },

  computed: {
    ...clientQrStore.mapGetters([
      'qrName',
      'appTopBar',
      'currentPageId',
      'pageExists',
      'shouldCurrentPageShowTopBar',
      'currentPageMaxWidth',
      'currentPageBackgroundColor',
      'currentPageShadow',
      'currentPageBorder',
      'currentPageViewPortBackgroundImage',
      'currentPageViewPortBackgroundColor',
      'shouldCurrentPageShowTopBottomBlank'
    ]),

    ...clientQrStore.mapState([
      'hideTopBar',
    ]),

    shouldShowTopBar() {
      return this.shouldCurrentPageShowTopBar && !this.hideTopBar;
    },

    viewportStyle() {
      if (this.currentPageViewPortBackgroundImage) {
        return {
          backgroundColor: 'transparent',
          backgroundImage: `url('${imageDisplayUrl(this.currentPageViewPortBackgroundImage)}')`
        }
      }

      if (this.currentPageViewPortBackgroundColor) {
        return {
          backgroundColor: this.currentPageViewPortBackgroundColor,
          backgroundImage: 'none'
        }
      }
    },

    pageTopMarginSupporterStyle() {
      if (this.shouldShowTopBar && this.shouldCurrentPageShowTopBottomBlank) {
        return {
          height: (this.appTopBar.height + this.pageTopBottomMargin) + 'px',
        }
      }

      if (this.shouldShowTopBar && !this.shouldCurrentPageShowTopBottomBlank) {
        return {
          height: this.appTopBar.height + 'px',
        }
      }

      if (!this.shouldShowTopBar && this.shouldCurrentPageShowTopBottomBlank) {
        return {
          height: this.pageTopBottomMargin + 'px',
        }
      }
    },

    pageStyle() {
      return {
        ...({
          maxWidth: this.currentPageMaxWidth + 'px',
          backgroundColor: this.currentPageBackgroundColor,
        }),
        ...borderStyles(this.currentPageBorder),
        ...shadowStyles(this.currentPageShadow)
      };
    },

    pageBottomMarginSupporterStyle() {
      if (this.shouldCurrentPageShowTopBottomBlank) {
        return {
          height: this.pageTopBottomMargin + 'px',
        }
      }
    },
  },

  methods: {
    ...clientQrStore.mapMutations(['setCurrentPage']),
  },
}
</script>

<style lang="scss" module>
.wrapper {
  height: 100%;
  overflow-y: auto;
}

.qrTopBar {
  display: none;
}

.pageTopMarginSupporter {
  display: none;
}

.page {
  margin-right: auto;
  margin-left: auto;
  z-index: $clientPageZIndex;
  position: relative;
}

.pageBottomMarginSupporter {
  display: none;
}

@media (min-width: $mobileScreenBreakpoint), print {
  .qrTopBar {
    display: flex;
  }

  .pageTopMarginSupporter {
    display: block;
  }

  .pageBottomMarginSupporter {
    display: block;
  }
}

@media (max-width: $mobileScreenBreakpoint), print {
  .wrapper {
    background-color: transparent !important;
    background-image: none !important;
  }

  .page {
    box-shadow: none !important;
  }
}

@media print {
  .wrapper {
    overflow-y: hidden; //隐藏滑动条
  }

  .qrTopBar {
    display: none;
  }

  .pageTopMarginSupporter {
    display: none;
  }

  .page {
    width: 100% !important;
    max-width: none !important;
  }

  .pageBottomMarginSupporter {
    display: none;
  }

}
</style>

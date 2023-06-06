<template>
  <div :class="wrapperClass">
    <router-view v-if="memberProfileLoaded" :key="consoleHomePageRefreshKey"></router-view>
    <MarkdownDialogViewer></MarkdownDialogViewer>
    <RichTextDialogViewer></RichTextDialogViewer>
    <ErrorPage></ErrorPage>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex';
import ACTIONS from '@/console/console-root-action';
import MarkdownDialogViewer from '@/common/components/MarkdownDialogViewer';
import RichTextDialogViewer from '@/common/components/RichTextDialogViewer';
import ErrorPage from '@/common/components/ErrorPage';
import eventBus from '@/common/utils/event-bus';

import {
  changeFavIcon,
  currentSubdomainPrefix,
  isCurrentUsingDomainName,
  isSubdomainCustomized,
  replaceCurrentUrlWithSubdomain
} from '@/common/utils/common-utils';
import {imageThumbnailUrl} from '@/common/utils/image-utils'

export default {
  components: {
    MarkdownDialogViewer,
    RichTextDialogViewer,
    ErrorPage
  },

  data() {
    return {
      memberProfileLoaded: false,
      leftMenuFold: null,
    }
  },

  created() {
    eventBus.$on('lefeMenuFoldChanged', this.onLeftMenuFoldChanged);
    return this[ACTIONS.FETCH_MY_PROFILE]().then(() => {
      if (this.isSubdomainEffective && isCurrentUsingDomainName() && currentSubdomainPrefix() !== this.subdomainPrefix) {
        location.replace(replaceCurrentUrlWithSubdomain(this.subdomainPrefix));
        return;
      }

      if (!this.isSubdomainEffective && isSubdomainCustomized()) {
        location.replace(replaceCurrentUrlWithSubdomain('console'));
        return;
      }

      this.memberProfileLoaded = true;
      this.$nextTick(() => {
        if (this.tenantLogo) {
          changeFavIcon(imageThumbnailUrl(this.tenantLogo));
        }
      });

    });
  },

  beforeDestroy() {
    eventBus.$off('lefeMenuFoldChanged');
  },

  methods: {
    ...mapActions([
      ACTIONS.FETCH_MY_PROFILE,
    ]),

    onLeftMenuFoldChanged(fold) {
      this.leftMenuFold = fold;
    },
  },

  computed: {
    ...mapGetters(['tenantLogo', 'subdomainPrefix', 'isSubdomainEffective']),
    ...mapState(['consoleHomePageRefreshKey']),

    wrapperClass() {
      switch (this.leftMenuFold) {
        case 'FOLD': {
          return 'foldWrapper';
        }
        case 'UNFOLD': {
          return 'unFoldWrapper';
        }
      }
    }

  }

}
</script>

<style lang="scss" module>
:global { //foldWrapper和unFoldWrapper要生效的话，需要保证该组件的div直接位于body之下，因为这样才能定位同级的el-loading-mask和el-message
  .foldWrapper ~ .el-loading-mask {
    padding-left: 50px;
  }

  .foldWrapper ~ .el-message {
    margin-left: 25px;
  }

  .unFoldWrapper ~ .el-loading-mask {
    padding-left: 240px;
  }

  .unFoldWrapper ~ .el-message {
    margin-left: 120px;
  }

}
</style>

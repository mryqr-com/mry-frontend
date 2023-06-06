<template>
  <MenuViewer :class="$style.wrapper"
              :links="viewableMenuLinks"
              @linkClick="onLinkClicked">
  </MenuViewer>
</template>

<script>
import MenuViewer from '@/common/components/MenuViewer';
import {createNamespacedHelpers} from 'vuex';

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  components: {
    MenuViewer: MenuViewer
  },

  computed: {
    ...clientQrStore.mapGetters([
      'isLoggedIn',
      'qrId',
      'isPageRequireLogin',
      'hasAccessToPage',
      'currentPageId',
      'viewableMenuLinks',
    ]),
  },

  methods: {
    onLinkClicked(link) {
      if (link.pageId && link.type === 'PAGE') {
        if (link.pageId === this.currentPageId) {
          this.$router.go();//刷新当前页面
        }

        //没有登录时，先尝试进入页面，进入页面后会再次检查是否登录，这样登录回来后可以自动跳到该页面，而不是当前页面
        if (this.isPageRequireLogin(link.pageId) && !this.isLoggedIn) {
          this.$router.push({
            name: 'new-submission',
            params: {qrId: this.qrId, pageId: link.pageId}
          });
          return;
        }

        if (!this.hasAccessToPage(link.pageId)) {
          this.$message({
            type: 'error',
            message: `无权访问。`,
            center: true,
            duration: 1000,
          });
          return;
        }

        this.$router.push({
          name: 'new-submission',
          params: {qrId: this.qrId, pageId: link.pageId}
        });

        return;
      }

      if (link.url && link.type === 'EXTERNAL_URL') {
        window.open(link.url, '_blank');
      }
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

</style>

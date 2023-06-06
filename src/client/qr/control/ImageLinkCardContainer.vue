<template>
  <ControlWrapper v-if="viewableLinks.length > 0" :control="control" :index="index">
    <el-row :gutter="control.gutter">
      <el-col v-for="link in viewableLinks" :key="link.id" :span="24/control.countPerRow">
        <ImageLinkCard :appearanceStyle="control.appearanceStyle"
                       :imageAspectRatio="control.imageAspectRatio"
                       :link="link"
                       :linkDescriptionTextStyle="control.linkDescriptionTextStyle"
                       :linkNameTextStyle="control.linkNameTextStyle"
                       :style="cardStyle"
                       :textOverImage="control.textOverImage"
                       @click="onLinkClicked">
        </ImageLinkCard>
      </el-col>
    </el-row>
  </ControlWrapper>
</template>

<script>
import {createNamespacedHelpers} from "vuex";
import ImageLinkCard from '@/common/components/ImageLinkCard';

const clientQrStore = createNamespacedHelpers('CLIENT_QR_STORE');

export default {
  props: ['control', 'index'],
  components: {
    ImageLinkCard,
  },

  computed: {
    ...clientQrStore.mapGetters([
      'isLoggedIn',
      'qrId',
      'isPageRequireLogin',
      'hasAccessToPage',
      'currentPageId',
      'viewablePageLinks',
    ]),

    viewableLinks() {
      return this.viewablePageLinks(this.control.links, this.control.showBasedOnPermission);
    },

    cardStyle() {
      return {
        marginBottom: this.control.gutter + 'px',
      }
    },
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

</style>

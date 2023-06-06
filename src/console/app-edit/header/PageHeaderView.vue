<template>
  <div :class="$style.wrapper">
    <PageHeaderViewer v-if="shouldShowHeader" :header="header"></PageHeaderViewer>

    <div v-else :class="$style.thePlaceholder">
      + 点击编辑页眉
    </div>
  </div>
</template>

<script>
import PageHeaderViewer from '@/common/components/PageHeaderViewer';
import {createNamespacedHelpers} from 'vuex';

const appEditStore = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  components: {
    PageHeaderViewer
  },

  computed: {
    ...appEditStore.mapState([
      'tabletView'
    ]),

    ...appEditStore.mapGetters([
      'currentPage',
      'homePage',
      'isCurrentHomePage'
    ]),

    shouldShowHeader() {
      return (this.header.showImage && this.header.image) || this.header.showText;
    },

    header() {
      if (!this.isCurrentHomePage && this.currentPage.header.type === 'INHERITED') {
        return this.homePage.header;
      } else {
        return this.currentPage.header;
      }
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
  cursor: pointer;
}

.thePlaceholder {
  background-color: #ececec;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

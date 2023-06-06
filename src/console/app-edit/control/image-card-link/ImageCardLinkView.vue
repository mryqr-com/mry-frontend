<template>
  <div :class="[$style.wrapper,{[$style.wrapperWide]: tabletView}]">
    <el-row :gutter="control.gutter">
      <el-col v-for="link in control.links" :key="link.id" :span="24/control.countPerRow">
        <div :class="$style.cardContainer">
          <ImageLinkCard :appearanceStyle="control.appearanceStyle"
                         :imageAspectRatio="control.imageAspectRatio"
                         :link="link"
                         :linkDescriptionTextStyle="control.linkDescriptionTextStyle"
                         :linkNameTextStyle="control.linkNameTextStyle"
                         :style="cardStyle"
                         :textOverImage="control.textOverImage"
                         :title="cardTitle(link)">
          </ImageLinkCard>
          <div v-if="!isComplete(link)" :class="$style.cardIncompleteNote">
            <i class="el-icon-warning-outline" title="请完善该项链接设置"></i>
          </div>
        </div>
      </el-col>
    </el-row>

    <div v-if="control.links.length === 0" :class="$style.placeholderText">
      <i class="el-icon-warning-outline"> 请添加链接项</i>
    </div>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import ImageLinkCard from '@/common/components/ImageLinkCard';

const {mapGetters} = createNamespacedHelpers('APP_EDIT_STORE');

export default {
  props: ['control', 'tabletView', "controlIndex"],

  components: {
    ImageLinkCard,
  },

  computed: {
    ...mapGetters([
      'pageNameOf',
    ]),

    cardStyle() {
      return {
        marginBottom: this.control.gutter + 'px',
      }
    },
  },

  methods: {
    isComplete(link) {
      if (!link.type) {
        return false;
      }

      if (link.type === 'PAGE') {
        return !!link.pageId;
      }

      return !!link.url;
    },

    cardTitle(link) {
      if (this.isComplete(link)) {
        if (link.type === 'PAGE') {
          return `引用页面：${this.pageNameOf(link.pageId)}`;
        }
        return `引用网址：${link.url}`;
      }
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.cardContainer {
  position: relative;
}

.cardIncompleteNote {
  position: absolute;
  top: 0;
  right: 0;
  background-color: $warningYellow;
  color: white;
  padding: 5px;
  font-weight: 500;
}

.placeholderText {
  color: $warningYellow;
}

</style>

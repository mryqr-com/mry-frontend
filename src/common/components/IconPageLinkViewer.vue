<template>
  <div :class="$style.wrapper" :style="wrapperStyle">
    <el-row :class="$style.elRow" :gutter="10">
      <el-col v-for="(link,index) in links"
              :key="link.id"
              :span="24/control.numberPerRow">
        <div :class="$style.linkContainer" :style="linkContainerStyle(index)" @click="onClick(link)">
          <img :alt="link.name"
               :src="imageSrc(link)"
               :style="imageStyle"/>
          <div :style="nameStyle">
            {{ link.name }}
            <i v-if="showWarning && isIncomplete(link)"
               :class="$style.warning"
               class="el-icon-warning-outline"
               title="请完善链接设置">
            </i>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import {imageDisplayUrl} from "@/common/utils/image-utils";
import defaultIcon from "@/common/static/icons8-app-store-96.png";
import {appearanceStyles, fontStyles} from "@/common/utils/common-utils";

export default {
  props: {
    control: {
      type: Object,
    },

    links: {
      type: Array,
    },

    showWarning: {
      type: Boolean,
      default: false,
    }
  },

  computed: {
    wrapperStyle() {
      return {
        ...appearanceStyles(this.control.appearanceStyle),
      }
    },

    imageStyle() {
      return {
        width: this.control.iconWidth + 'px',
        height: this.control.iconWidth + 'px',
        marginBottom: this.control.textIconSpace + 'px',
      }
    },

    nameStyle() {
      return {
        ...fontStyles(this.control.fontStyle),
      }
    },

    lastRowNumber() {
      return Math.ceil(this.control.links.length / this.control.numberPerRow);
    },
  },

  methods: {
    imageSrc(link) {
      return link.image ? imageDisplayUrl(link.image) : defaultIcon;
    },

    onClick(link) {
      this.$emit("click", link);
    },

    linkContainerStyle(index) {
      let currentRowNumber = Math.ceil((index + 1) / this.control.numberPerRow);
      let rowGutter = currentRowNumber === this.lastRowNumber ? 0 : this.control.rowGutter;
      return {
        marginBottom: rowGutter + 'px',
      }
    },

    isIncomplete(link) {
      if (!link.type) {
        return true;
      }

      if (link.type === 'PAGE') {
        return !link.pageId;
      }

      return !link.url;
    }
  },
}
</script>

<style lang="scss" module>
.wrapper {
}

.elRow {
  display: flex;
  flex-wrap: wrap;
}

.linkContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.warning {
  color: $warningYellow;
}
</style>

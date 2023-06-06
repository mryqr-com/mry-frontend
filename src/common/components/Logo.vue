<template>
  <div :class="$style.wrapper" @click="onLogoClick">
    <img :class="[$style.logoImage,
    {[$style.miniImage]:isMini},
    {[$style.smallImage]:isSmall},
    {[$style.mediumImage]:isMedium},
    {[$style.largeImage]:isLarge}]" :src="logoImageUrl" alt="LOGO"/>

    <div :class="[$style.logoText,
    {[$style.miniText]:isMini},
    {[$style.smallText]:isSmall},
    {[$style.mediumText]:isMedium},
    {[$style.largeText]:isLarge}]">
      {{ logoText }}
    </div>

  </div>
</template>

<script>
import mryLogo from '@/common/static/mry.svg';
import {imageThumbnailUrl} from '@/common/utils/image-utils';

export default {
  props: {
    name: {
      type: String,
    },

    iconFile: {
      type: Object,
    },

    size: {
      type: String,
      default: 'medium'
    },
  },
  computed: {
    isMini() {
      return this.size === 'mini';
    },

    isSmall() {
      return this.size === 'small';
    },

    isMedium() {
      return !this.isLarge && !this.isSmall && !this.isMini;
    },

    isLarge() {
      return this.size === 'large';
    },

    shouldCustomize() {
      return this.iconFile && this.name;
    },

    logoImageUrl() {
      return this.shouldCustomize ? imageThumbnailUrl(this.iconFile) : mryLogo;
    },

    logoText() {
      return this.shouldCustomize ? this.name : '码如云';
    },
  },
  methods: {
    onLogoClick() {
      this.$emit("click");
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  align-items: center;
}

.logoImage {
  margin-right: 8px;
}

.logoText {
  font-weight: 500;
  color: $primaryTextColor;
}

.miniImage {
  height: 20px;
}

.smallImage {
  height: 30px;
}

.mediumImage {
  height: 40px;
}

.largeImage {
  height: 50px;
}

.miniText {
  font-size: 12px;
}

.smallText {
  font-size: 16px;
}

.mediumText {
  font-size: 20px;
}

.largeText {
  font-size: 24px;
}

</style>

<template>
  <div v-if="!shouldHideBottomMryLogo" :class="$style.wrapper" @click="gotoMryOfficialSite">
    <img :class="$style.footerLogo" :src="mryLogoUrl" alt="码如云">
    码如云提供技术支持
  </div>
</template>

<script>
import mryLogo from "@/common/static/mry.svg";
import {goToMryOfficialWebsite} from '@/common/utils/common-utils';

export default {
  props: ['shouldHideBottomMryLogo'],

  computed: {
    mryLogoUrl() {
      return mryLogo;
    },
  },

  methods: {
    gotoMryOfficialSite() {
      goToMryOfficialWebsite();
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  color: $secondaryTextColor;
  cursor: pointer;
  font-size: 13px;
}

.wrapper:hover {
  color: $primaryThemeColor;
}

.footerLogo {
  height: 20px;
  margin-right: 5px;
}

</style>

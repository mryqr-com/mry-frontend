<template>
  <img :class="$style.wrapper" :src="avatarUrl" alt="avatar"/>
</template>

<script>
import avatarPlaceholder from '@/common/static/avatar-placeholder.svg';
import {imageThumbnailUrl} from "@/common/utils/image-utils";

export default {
  props: ['avatar'],

  computed: {
    avatarUrl() {
      if (!this.avatar) {
        return avatarPlaceholder;
      }

      return imageThumbnailUrl(this.avatar);
    }
  }

}
</script>

<style lang="scss" module>
.wrapper {
  border-radius: 50%;
  background-color: #eaecec;
}
</style>

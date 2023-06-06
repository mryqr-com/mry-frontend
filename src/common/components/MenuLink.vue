<template>
  <button :class="$style.wrapper" @click="go">
    <img v-if="link.image" :class="$style.linkImage" :src="imageUrl" alt="">
    <span>{{ link.name }}</span>
  </button>
</template>

<script>
import {imageThumbnailUrl} from '@/common/utils/image-utils'

export default {
  props: {
    link: {
      type: Object,
      required: true
    }
  },

  methods: {
    go() {
      this.$emit("click", this.link);
    },
  },

  computed: {
    imageUrl() {
      return imageThumbnailUrl(this.link.image)
    }
  }

}
</script>

<style lang="scss" module>
.wrapper {
  cursor: pointer;
  outline: none;
  text-decoration: none;
  padding: 0;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: whitesmoke;
  color: $regularTextColor;
  height: $formPageMenuHeight;
}

.wrapper:hover {
  filter: brightness(97%);
}

.linkImage {
  max-height: 20px;
  max-width: 20px;
  margin-right: 3px;
}

</style>

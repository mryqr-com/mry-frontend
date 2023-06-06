<template>
  <span v-if="images.length > 0" :class="$style.wrapper">
    <span v-for="(image,index) in images"
          :class="$style.imageContainer"
          :style="{ backgroundImage: `url('${imageThumbnailUrl(image)}')` }"
          @click="previewImage($event,index)">
    </span>
  </span>
</template>

<script>
import Vue from 'vue';

import {imageDisplayUrl, imageThumbnailUrl} from '@/common/utils/image-utils'
import 'viewerjs/dist/viewer.css';
import VueViewer from 'v-viewer';
import {isMobileBrowser} from "@/common/utils/common-utils";

Vue.use(VueViewer);

export default {
  props: {
    images: {
      type: Array,
    },
  },

  methods: {
    imageThumbnailUrl,

    previewImage(event, index) {
      event.stopPropagation();

      this.$viewerApi({
        images: this.images.map(image => imageDisplayUrl(image)),
        options: {
          toolbar: false,
          title: false,
          initialViewIndex: index,
          zIndexInline: 10000,
          zIndex: 10000,
          viewed() {
            if (isMobileBrowser()) {
              return;
            }

            const _this = this;
            const images = document.querySelectorAll('.viewer-canvas');
            images.forEach(image => {
              image.addEventListener('click', (event) => {
                _this.viewer.hide();
              });
            });
          },
        },
      });
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.imageContainer {
  background-position: center center;
  background-size: cover;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: inline-block;
  margin-right: 5px;
  border: $primary1pxBorder;
}
</style>

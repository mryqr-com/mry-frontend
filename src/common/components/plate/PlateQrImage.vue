<template>
  <img :id="id" :class="$style.wrapper" alt="QR"/>
</template>

<script>
import {imageThumbnailUrl} from "@/common/utils/image-utils";
import {randomHtmlElementId, rgba2hex} from "@/common/utils/common-utils";
import {isEqual} from 'lodash-es';

export default {
  props: {
    content: {
      type: String,
      required: true,
    },

    setting: {
      type: Object,
      required: true,
    }
  },

  data() {
    return {
      id: randomHtmlElementId(),
    }
  },

  created() {
    this.render();
  },

  watch: {
    content: {
      handler() {
        this.render();
      },
    },

    setting: {
      handler(newValue, oldValue) {
        if (!isEqual(newValue, oldValue)) {
          this.render();
        }
      },
      deep: true,
    },
  },

  computed: {
    isRgba() {
      return this.setting.color && this.setting.color.includes('rgba');
    },
  },

  methods: {
    render() {
      this.$nextTick(() => {
        import(/* webpackChunkName: "qrcode-with-logos" */ 'qrcode-with-logos').then(({default: _}) => {
          let qrcode = new _({
            image: document.getElementById(this.id),
            content: this.content,
            width: this.setting.width,
            nodeQrCodeOptions: {
              margin: this.setting.margin,
              errorCorrectionLevel: 'Q',
              color: {
                dark: this.isRgba ? rgba2hex(this.setting.color) : this.setting.color,
                light: '#FFFFFF'
              }
            },
            logo: this.setting.logo ? {
              logoSize: 0.2,
              src: this.setting.logo ? imageThumbnailUrl(this.setting.logo) : null,
            } : null
          });
          qrcode.toImage().then(() => {
          });
        });
      });
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
}
</style>

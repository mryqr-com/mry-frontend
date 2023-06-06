<template>
  <div :class="$style.wrapper" :style="wrapperStyle">
    <div :class="$style.contentSection" :style="contentSectionStyle">
      <div v-for="value in control.textValues" :key="value.id" :class="$style.row" :style="rowStyle">
        <div :style="textStyle">
          <span :class="$style.key" :style="textStyle">
          {{ valueNameOf(value.name) }}：
          </span>
          {{ valueOf(value.id) }}
        </div>
      </div>
    </div>
    <div v-if="control.qrEnabled" :class="$style.qrSection" :style="qrSectionStyle">
      <PlateQrImage :content="qrContent" :setting="control.qrImageSetting"></PlateQrImage>
    </div>
  </div>
</template>

<script>
import PlateQrImage from '@/common/components/plate/PlateQrImage';
import {alignSelfOf, fontStyles, justifyContentOf} from "@/common/utils/common-utils";

export default {
  props: {
    control: {
      type: Object,
      required: true,
    },

    contentTexts: {
      type: Array,
    },

    qrContent: {
      type: String,
    },
  },

  components: {
    PlateQrImage,
  },

  computed: {
    wrapperStyle() {
      return {
        flexDirection: this.control.horizontalPositionType === 'LEFT' ? 'row-reverse' : 'row',
      }
    },

    contentSectionStyle() {
      return {
        alignSelf: alignSelfOf(this.control.verticalAlignType),
        alignItems: justifyContentOf(this.control.textHorizontalAlignType),
      }
    },

    rowStyle() {
      return {
        height: this.control.lineHeight + 'px',
      }
    },

    textStyle() {
      return {
        ...fontStyles(this.control.fontStyle),
      }
    },

    qrSectionStyle() {
      return {
        alignSelf: alignSelfOf(this.control.verticalAlignType),
        marginLeft: this.control.horizontalPositionType === 'RIGHT' ? this.control.horizontalGutter + 'px' : 0,
        marginRight: this.control.horizontalPositionType === 'LEFT' ? this.control.horizontalGutter + 'px' : 0,
      }
    }
  },

  methods: {
    valueNameOf(name) {
      return name ? name : '未命名';
    },

    valueOf(id) {
      let item = this.contentTexts.find(text => text.id === id);
      return item ? item.text : '';
    }
  }

}
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
}

.contentSection {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
  align-items: center;
}

.key {
  //padding-right: 5px;
}

.qrSection {
  padding: 1px;
  display: flex;
  align-items: center;
  justify-items: center;
}
</style>

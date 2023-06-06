<template>
  <div :class="$style.wrapper" :style="wrapperStyle">
    <span :class="[{[$style.textPadding]:text}]" :style="textStyle">{{ text }}</span>
  </div>
</template>

<script>
import {fontStyles} from "@/common/utils/common-utils";

export default {
  props: {
    separatorType: {
      type: String,
      default: 'DASHED',
    },

    text: {
      type: String,
    },

    fontStyle: {
      type: Object,
      default: function () {
        return {
          fontFamily: "默认",
          fontSize: 14,
          bold: false,
          italic: false,
          color: null,
        };
      }
    },

    widthRatio: {
      type: Number,
      default: 100,
    },

    backgroundColor: {
      type: String,
      default: 'rgba(255,255,255,1)',
    },

    borderWidth: {
      type: Number,
      default: 1,
    },
  },

  computed: {
    wrapperStyle() {
      return {
        borderBottomStyle: this.separatorType,
        borderBottomWidth: this.borderWidth + 'px',
        borderBottomColor: this.fontStyle.color,
        height: this.fontStyle.fontSize / 2 + 'px',
        width: this.widthRatio + '%',
      };
    },

    textStyle() {
      return {
        ...fontStyles(this.fontStyle),
        backgroundColor: this.backgroundColor,
      };
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
  text-align: center;
}

.textPadding {
  padding: 2px 5px;
}

</style>

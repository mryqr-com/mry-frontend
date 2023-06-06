<template>
  <button :class="$style.wrapper"
          :style="theStyle"
          @click="callback($event)">
    <slot></slot>
  </button>
</template>

<script>

import {borderStyles, fontStyles, shadowStyles} from "@/common/utils/common-utils";

export default {
  props: {
    buttonStyle: {
      type: Object,
      default: function () {
        return {
          fontStyle: {
            fontFamily: "默认",
            fontSize: 13,
            bold: false,
            italic: false,
            color: "#303133",
          },
          backgroundColor: "#edf1f8",
          border: {
            type: 'SOLID',
            width: 1,
            sides: ['TOP', 'BOTTOM', 'LEFT', 'RIGHT'],
            color: '#DCDFE6'
          },
          shadow: {
            width: 0,
            color: 'rgba(0, 0, 0, .3)'
          },
          vPadding: 8,
          borderRadius: 0,
        };
      }
    }
  },

  computed: {
    theStyle() {
      return {
        ...fontStyles(this.buttonStyle.fontStyle),
        ...{
          backgroundColor: this.buttonStyle.backgroundColor,
          paddingTop: this.buttonStyle.vPadding + 'px',
          paddingBottom: this.buttonStyle.vPadding + 'px',
          borderRadius: this.buttonStyle.borderRadius + 'px',
        },
        ...borderStyles(this.buttonStyle.border),
        ...shadowStyles(this.buttonStyle.shadow)
      };
    }
  },

  methods: {
    callback: function (e) {
      this.$emit('click', e);
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
  outline: none;
  text-decoration: none;
  cursor: pointer;
  border: none;
  width: 100%;
  background-color: transparent;
  color: $regularTextColor;
}

.wrapper:hover {
  filter: brightness(95%);
}

.wrapper[disabled=disabled]:hover, .wrapper:disabled:hover, .wrapper[disabled]:hover {
  cursor: not-allowed;
  filter: brightness(100%);
}

</style>

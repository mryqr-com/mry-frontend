<template>
  <div :class="$style.wrapper" :style="wrapperStyle">
    <div :class="[$style.content, {[$style.button]:isButton}]" :style="contentStyle" @click="$emit('buttonClick')">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import {borderStyles, fontStyles, justifyContentOf, shadowStyles, textAlignOf} from '@/common/utils/common-utils';

export default {
  props: {
    textStyle: {
      type: Object,
      required: true
    },

    isButton: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    fullWidth() {
      return this.textStyle.fullWidth;
    },

    wrapperStyle() {
      if (!this.fullWidth) {
        return {
          display: 'flex',
          justifyContent: justifyContentOf(this.textStyle.alignType),
        }
      }
    },

    contentStyle() {
      return {
        ...fontStyles(this.textStyle.fontStyle),
        ...{
          textAlign: textAlignOf(this.textStyle.alignType),
          lineHeight: this.textStyle.lineHeight + 'em',
          backgroundColor: this.textStyle.backgroundColor,
          paddingTop: this.textStyle.vPadding + 'px',
          paddingBottom: this.textStyle.vPadding + 'px',
          paddingLeft: this.textStyle.hPadding + 'px',
          paddingRight: this.textStyle.hPadding + 'px',
          marginTop: this.textStyle.topMargin + 'px',
          marginBottom: this.textStyle.bottomMargin + 'px',
          borderRadius: this.textStyle.borderRadius + 'px',
        },
        ...borderStyles(this.textStyle.border),
        ...shadowStyles(this.textStyle.shadow)
      }
    },
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

//do not collapse margin
.wrapper::after, .wrapper::before {
  display: table;
  content: '';
}

.content {
  cursor: inherit;
}

.button {
  cursor: pointer;
}

.button:hover {
  filter: brightness(95%);
}

</style>

<template>
  <div :class="$style.wrapper" @click="openMryDocSite">
    <icon :style="iconStyle" icon="book"></icon>
    <div :class="$style.iconText" :style="textStyle">文档</div>
  </div>
</template>

<script>

export default {
  props: {
    iconSize: {
      type: Number,
      default: 15
    },

    textSize: {
      type: Number,
      default: 12
    },

    color: {
      type: String,
      default: '#909399',
    },
  },

  computed: {
    iconStyle() {
      return {
        fontSize: this.iconSize + 'px',
        color: this.color,
      }
    },

    textStyle() {
      return {
        fontSize: this.textSize + 'px',
        color: this.color,
      }
    },
  },

  methods: {
    openMryDocSite() {
      window.open('//docs.mryqr.com', '_blank');
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
  cursor: pointer;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}

.wrapper:hover {
  filter: brightness(90%);
  cursor: pointer;
}

.iconText {
  margin-top: 5px;
}
</style>

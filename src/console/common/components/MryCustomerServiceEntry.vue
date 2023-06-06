<template>
  <div :class="$style.wrapper">
    <el-popover :trigger="trigger">
      <div slot="reference" :class="$style.iconContainer">
        <icon :style="iconStyle" icon="headset"></icon>
        <div :class="$style.iconText" :style="textStyle">客服</div>
      </div>
      <div :class="$style.content">
        <img :class="$style.qrImage" alt="码如云客服" src="/images/customer-service-151.png"/>
        <div :class="$style.text">{{ message }}</div>
      </div>
    </el-popover>
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
      default: '#00bfff',
    },

    message: {
      type: String,
      default: '微信扫码，咨询客服',
    },

    trigger: {
      type: String,
      default: 'click',
    }
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
  }
}
</script>

<style lang="scss" module>
.wrapper {
}

.iconContainer {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.iconContainer:hover {
  filter: brightness(90%);
}

.iconText {
  margin-top: 5px;
}

.content {
  width: 130px;
}

.qrImage {
  width: 100%;
}

.text {
  margin-top: 10px;
  text-align: center;
  padding-bottom: 5px;
  font-size: 13px;
}
</style>

<template>
  <el-popover :trigger="trigger">
    <el-button slot="reference" :class="$style.textButton" type="text">
      码如云客服
    </el-button>
    <div :class="$style.content">
      <img :class="$style.qrImage" alt="码如云客服" src="/images/customer-service-151.png"/>
      <div :class="$style.text">{{ message }}</div>
    </div>
  </el-popover>
</template>

<script>

export default {
  props: {
    message: {
      type: String,
      default: '微信扫码，咨询客服',
    },

    trigger: {
      type: String,
      default: 'click',
    }
  },
}
</script>

<style lang="scss" module>
.textButton {
  padding-top: 0;
  padding-bottom: 0;
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

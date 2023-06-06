<template>
  <AbnormalPageWrapper>
    <div :class="$style.wrapper">
      <div :class="$style.the404">404</div>
      <div :class="$style.the404Text">{{ message }}</div>
    </div>
  </AbnormalPageWrapper>
</template>

<script>
import AbnormalPageWrapper from '@/client/common/pages/AbnormalPageWrapper';

export default {
  props: {
    message: {
      type: String,
      default: '未找到相关资源'
    }
  },

  components: {
    AbnormalPageWrapper
  },

  created() {
    document.title = '404';
  }
};
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.the404 {
  font-size: 80px;
  font-weight: 600;
  color: #d2d2da;
}

.the404Text {
  font-size: 18px;
  margin-top: 24px;
  color: $regularTextColor;
}

</style>

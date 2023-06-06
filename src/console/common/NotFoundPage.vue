<template>
  <AbnormalPageWrapper>
    <div :class="$style.wrapper">
      <div :class="$style.the404">404</div>
      <div :class="$style.the404Text">{{ message }}</div>
      <el-button :class="$style.theButton" type="plain"
                 @click="backToHomePage">
        返回首页
      </el-button>
    </div>
  </AbnormalPageWrapper>
</template>

<script>
import AbnormalPageWrapper from '@/console/common/AbnormalPageWrapper';

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
  },

  methods: {
    backToHomePage() {
      this.$router.replace({name: "default-home"})
    }
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

.theButton {
  display: block;
  margin-top: 24px;
  width: 300px;
}
</style>

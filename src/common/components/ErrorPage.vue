<template>
  <div v-if="visible" :class="$style.wrapper">
    <div v-if="code" :class="$style.code">{{ code }}</div>
    <div :class="$style.message">{{ message }}</div>
  </div>
</template>

<script>
import eventBus from '@/common/utils/event-bus';

export default {
  data() {
    return {
      visible: false,
      code: null,
      message: null
    }
  },

  created() {
    eventBus.$on('showError', this.show);
    eventBus.$on('hideError', this.hide);
  },

  beforeDestroy() {
    eventBus.$off('showError');
    eventBus.$off('hideError');
  },

  methods: {
    show({code, message}) {
      this.visible = true;
      this.code = code;
      this.message = message;
    },

    hide() {
      this.visible = false;
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
  background-color: whitesmoke;
  width: 100%;
  height: 100%;
  z-index: 100000;
  top: 0;
  left: 0;
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.code {
  font-size: 80px;
  font-weight: 600;
  color: #d2d2da;
  margin-bottom: 24px;
}

.message {
  font-size: 18px;
  line-height: 1.3em;
  margin-right: 24px;
  margin-left: 24px;
  color: $regularTextColor;
}
</style>
